/**
 * Created by hxl on 2017/9/15.
 */
const WebSocket = require("ws");
var Setting = global.requireModule("setting.js");
const WEBSOCKET_PORT = Setting
var socketServer = new WebSocket.Server({ port: WEBSOCKET_PORT, perMessageDeflate: false});