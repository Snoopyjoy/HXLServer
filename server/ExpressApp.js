var PATH = require("path");
var URLIB = require("url");
var FS = require("fs");

var Setting = global.requireModule("setting.js");
var CODES = global.requireModule("service/ServiceCodes.js");
var Utils = global.requireModule("utils/Utils.js");
var isRunning = false;

var EXPRESS  = require('express');
var BODY_PARSER = require('body-parser');
var METHOD_OVERRIDE = require('method-override');
var COOKIE = require("cookie-parser");

var App = EXPRESS();
App.use(function(req, res, next) {
    req._cookies = new COOKIE(req, res);
    if (req.url == '/pay_notify/alipay' && req.get('content-type') != 'application/x-www-form-urlencoded') {
        req.headers['content-type'] = 'application/x-www-form-urlencoded';
    }
    next();
});
App.use(BODY_PARSER.urlencoded({ extended: true }));
App.use(BODY_PARSER.json());
App.use(METHOD_OVERRIDE());
App.use(COOKIE());
App.use(EXPRESS.static(PATH.join(global.APP_ROOT, "client/res")));



var ALLOW_DOMAIN_MAP = {};

var ROUTER_MAP = { };
var SERVICE_MAP = { };

function sayOK(res, data, headers) {
    var responseHeader = {
        "Content-Type": "application/json"
    };
    if (headers) {
        for (var key in headers) {
            responseHeader[key] = headers[key];
        }
    }
    var resBody = JSON.stringify({code: CODES.OK, data:data, msg:'OK'});
    var len = Buffer.byteLength(resBody, "utf8");
    responseHeader['Content-Length'] = len;
    res.writeHead(200, responseHeader);
    res.end(resBody);
}

function sendBinary(res, binary, mime, headers) {
    var responseHeader = {
        "Content-Type": mime,
        "Cache-Control":"no-cache",
        "Content-Length":binary.length
    };
    if (headers) {
        for (var key in headers) {
            responseHeader[key] = headers[key];
        }
    }
    res.writeHead(200, responseHeader);
    res.end(binary);
}

function sayError(res, code, msg) {
    res.json({code:code, data:{}, msg:msg});
}


App.post("/api", function (req, res) {
    res.sayError = function(code, msg) {
        if (!msg) {
            msg = "unknown";
        } else if (typeof msg == 'object') {
            msg = msg.toString();
        }
        sayError(this, code, msg);
    };
    res.sayOK = function(data, headers) {
        sayOK(this, data, headers);
    };
    res.sendBinary = function(data, mime, headers) {
        sendBinary(this, data, mime, headers);
    };

    var method = req.body.method;
    if (!method || method == '' || method.indexOf("$") >= 0) {
        res.sayError(CODES.NO_SUCH_METHOD, "NO_SUCH_METHOD");
        return;
    }

    method = method.split(".");
    var service = SERVICE_MAP[method[0]];
    if (!service || !service.hasOwnProperty(method[1])) {
        res.sayError(CODES.NO_SUCH_METHOD, "NO_SUCH_METHOD");
        return;
    }

    var params = req.body.data;
    if (!params) params = {};
    if (typeof params == "string") {
        try {
            params = JSON.parse(params);
        } catch (err) {
            res.sayError(CODES.REQUEST_PARAMS_INVALID, "REQUEST_PARAMS_INVALID: JSON.parse(params) error ==> " + err.toString());
            return;
        }
    }

    var auth = req.body.auth;
    if (auth) {
        if (typeof auth == "string") {
            try {
                auth = JSON.parse(auth);
            } catch (err) {
                res.sayError(CODES.REQUEST_PARAMS_INVALID, "REQUEST_PARAMS_INVALID: JSON.parse(auth) error ==> " + err.toString());
                return;
            }
        }
    } else {
        auth = null;
    }

    method = method[1];

    if (service.config.security && service.config.security[method]) {
        var security = service.config.security[method];

        //检查参数合法性
        if (security.checkParams) {
            for (var prop in security.checkParams) {
                if (!params.hasOwnProperty(prop)) {
                    res.sayError(CODES.REQUEST_PARAMS_INVALID, "REQUEST_PARAMS_INVALID: [" + prop + "] is required.");
                    return;
                }
                var val = params[prop];
                var checkType = security.checkParams[prop];
                var result = App["checkRequestParam_" + checkType](val);
                if (result.err) {
                    res.sayError(CODES.REQUEST_PARAMS_INVALID, "REQUEST_PARAMS_INVALID: [" + prop + "] ==> " + result.err.toString());
                    return;
                }
                params[prop] = result.value;
            }
        }

        handleUserSession(req, res, function(flag, user) {
            service[method](req, res, params);
        }, function(err) {
            res.sayError(CODES.SERVER_ERROR, "SERVER_ERROR: " + err.toString());
        }, auth);
    } else {
        service[method](req, res, params);
    }
});

App.checkRequestParam_string = function(val) {
    if (!val || val == "") {
        return { value:null, err:new Error("empty string") };
    }
    return { value:val };
}

App.checkRequestParam_json = function(val) {
    if (typeof val == "object") return { value:val };
    try {
        val = (val == "{}") ? {} : JSON.parse(val);
    } catch (err) {
        return { value:null, err:err };
    }
    return { value:val };
}

App.checkRequestParam_object = function(val) {
    return App.checkRequestParam_json(val);
}

App.checkRequestParam_qf = function(val) {
    try {
        val = Utils.convertQueryFields(val);
    } catch (err) {
        return { value:null, err:err };
    }
    return { value:val };
}

App.checkRequestParam_boolean = function(val) {
    if (String(val) != "true" && String(val) != "false" && String(val) != "1" && String(val) != "0") {
        return { value:null, err:new Error("invalid boolean") };
    }
    var flag = (String(val) == "true" || String(val) == "1") ? true : false;
    return { value:flag };
}

App.checkRequestParam_number = function(val) {
    if (isNaN(Number(val))) {
        return { value:null, err:new Error("NaN number") };
    }
    return { value:Number(val) };
}

App.checkRequestParam_int = function(val) {
    if (isNaN(Number(val))) {
        return { value:null, err:new Error("NaN int") };
    }
    return { value:parseInt(val) };
}

function redirectToPage(res, page) {
    res.redirect(303, COMMON_RESPONSE_DATA.SITE + page);
}

function redirectToLogin(req, res, loginPage) {
    loginPage = loginPage ? loginPage : "index";
    var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    console.log("* Redirect from<" + fullUrl + "> to <" + loginPage + ">");
    if (req.originalUrl == "/") {
        res.redirect(303, COMMON_RESPONSE_DATA.SITE + loginPage + "?sign=login");
    } else {
        res.redirect(303, COMMON_RESPONSE_DATA.SITE + loginPage + "?from=" + encodeURIComponent(req.originalUrl) + "&sign=login");
    }
}

function getUserFromCache(user, fields, callBack) {
    callBack(user);
}

var COMMON_RESPONSE_DATA = {
    "ENV": Setting.env,
    "SITE": Setting.site,
    "SITE_DOMAIN": Setting.site,
    "API_GATEWAY": Setting.site + "api",
    "RES_CDN_DOMAIN": Setting.cdn.res
};

function registerRouter(router) {
    App.all(router.url, function (req, res) {

        var r = router;
        if (r.mobile) {
            req.__isMobile = Utils.isFromMobile(req);
            console.log("isMobile --> " + req.__isMobile);
            if (req.__isMobile) {
                r = ROUTER_MAP[r.mobile];
                if (!r) r = router;
            }
        }

        res.goPage = function(page) {
            redirectToPage(res, page);
        }

        handleUserSession(req, res, function(flag, user) {
            var output = function(view, user, data, err) {
                data = data ? data : {};
                if (err) {
                    res.render("error", { setting:COMMON_RESPONSE_DATA, err:err.toString(), user:user, now:Date.now() });
                } else {
                    res.render(view, { setting:COMMON_RESPONSE_DATA, data:data, user:user, now:Date.now() });
                }
            };
            var r_handle = null;
            if(req.method == "POST"){

                if (r.postHandler) r_handle = r.postHandler;
            }else{
                if (r.handle) r_handle = r.handle;
            }

            if (r_handle != null) {
                var func = function (data, err, useView) {
                    output(useView ? useView : r.view, user, data, err);
                };
                func.status = function (code) {
                    res.status(code);
                    return {
                        call: function (view, user, data, err) {
                            func.apply(res, [view, user, data, err]);
                        }
                    };
                };
                r_handle(req, res, func, user);
            }else {
                output(r.view, user);
            }

        }, function(err) {
            console.error("handle user session error ==> " + err.toString());
            redirectToLogin(req, res, r.loginPage);
        }, null);
    });
}


function handleUserSession(req, res, next, error, auth) {
    var user = { isLogined:false, type:100 };
    next(0, user);
}

exports.start = function(port, callBack) {
    if (isRunning) {
        console.log("ExpressApp is already running.");
        return;
    }

    var doRegisterRouter = function(path, file) {
        path = path.replace(global.APP_ROOT, "").replace("\\server\\", "").replace("/server/", "").replace("\\", "/");
        var router = global.requireModule(path + "/" + file);
        var filename = file.replace(".js", "");
        var key = path == "router" ? "" : (path.replace("router/", "") + ".");
        if (router.hasOwnProperty('getRouterMap') && router.getRouterMap) {
            var map = router.getRouterMap();
            map.forEach(function(r) {
                if (r.id) ROUTER_MAP[key + filename + "." + r.id] = r;
                registerRouter(r);
            });
        }
    }

    var doRegisterService = function(path, file) {
        path = path.replace(global.APP_ROOT, "").replace("\\server\\", "").replace("/server/", "").replace("\\", "/");
        var service = global.requireModule(path + "/" + file);
        if (service.config && service.config.name && service.config.enabled == true) {
            SERVICE_MAP[service.config.name] = service;
        }
    }

    var checkFolder = function(path, handler) {
        var files = FS.readdirSync(path);
        files.forEach(function(rf) {
            if (rf == ".svn") return;
            if (rf.indexOf(".") > 0) {
                if (rf.indexOf(".js") > 0) {
                    handler(path, rf);
                }
            } else {
                checkFolder(PATH.join(path, rf), handler);
            }
        });
    }

    var nunjucks = require("nunjucks");
    var viewPath =  PATH.join(global.APP_ROOT, "client/views");
    var viewCache = false;
    if (Setting.env === 'dev') {
        viewCache = true;
    }
    var nunjucksEnv = nunjucks.configure(viewPath, {
        autoescape: true,
        express: App,
        noCache: !viewCache,
        web: {
            useCache: viewCache
        }
    });
    nunjucks.$setFilter = function(key, func) {
        nunjucksEnv.addFilter(key, func);
    };
    viewEngine = nunjucks;
    App.set('view engine', 'html');

    App.set('views', viewPath );
    App.set('view cache', viewCache);

    require("./utils/ViewEngineFilter").init({ engine:nunjucks });

    //init routers
    checkFolder(PATH.join(global.APP_ROOT, "server/router"), doRegisterRouter);

    //init services
    checkFolder(PATH.join(global.APP_ROOT, "server/service"), doRegisterService);

    App.listen(port);
    isRunning = true;
    console.log("Starting ExpressApp at BACKEND_PORT: " + port);
    if (callBack) setTimeout(callBack, 1000);
};