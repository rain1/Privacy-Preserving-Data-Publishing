class WindowManager {
    closeWindow(window) {
        console.log("closing: " + window);
        $("#" + window).hide();
    }

    loadWindow(window) {
        $("#" + window).load("public/html/" + window + ".html");
        $("#" + window).draggable({
            containment: 'window',
            scroll: false,
            handle: '#titlebar_' + window
        });
    }

    setWindowTitle() {

    }
}

export = WindowManager;