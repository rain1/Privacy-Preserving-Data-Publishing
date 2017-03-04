"use strict";
var WindowManager = (function () {
    function WindowManager() {
    }
    WindowManager.prototype.closeWindow = function (window) {
        console.log("closing: " + window);
        $("#" + window).hide();
    };
    WindowManager.prototype.loadWindow = function (window) {
        $("#" + window).load("public/html/" + window + ".html");
        $("#" + window).draggable({
            containment: 'window',
            scroll: false,
            handle: '#titlebar_' + window
        });
    };
    return WindowManager;
}());
module.exports = WindowManager;
