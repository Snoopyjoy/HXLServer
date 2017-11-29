exports.config = {
    name:"data",
    enabled:true,
    security: {
    }
};

var CODES = global.requireModule("service/ServiceCodes.js");
var Utils = global.requireModule("utils/Utils.js");
var DBModel = global.requireModule("DBModel.js");
var Setting = global.requireModule("setting.js");

