var CODES = global.requireModule("service/ServiceCodes.js");
var Utils = global.requireModule("utils/Utils.js");
var DBModel = global.requireModule("DBModel.js");
var Setting = global.requireModule("setting.js");
function renderRoot(req, res, output, user) {
    output({});
}


exports.getRouterMap = function() {
    return [
        { url: "/index", view: "index", handle: renderRoot, needLogin:false }
    ];
}


