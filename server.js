
global.APP_ROOT = __dirname;

global.requireModule = function(path) {
    return require(require("path").join(global.APP_ROOT, "server/" + path));
};

var Setting = global.requireModule("setting.js");
var Utils = global.requireModule("utils/Utils.js");

function startup() {

    var tasks = [];
   /* tasks.push(function(callBack) {
        global.requireModule("DBModel.js").open(Setting.db.host,
            Setting.db.port,
            Setting.db.name,
            Setting.db.option,
            function() {
                callBack();
            }, true);
    });*/

    tasks.push(function(callBack) {
        global.requireModule("ExpressApp.js").start(Setting.port, callBack);
    });

    Utils.runQueueTask(tasks, function() {
        console.log('Server is working!');
    });
}

startup();