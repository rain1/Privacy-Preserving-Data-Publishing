import Application = require("./../Application");
import WindowManager = require("./../WindowManager");
class UploadDialog {
    app:Application;
    winMgr:WindowManager;

    constructor(app:Application, winMgr:WindowManager) {
        this.app = app;
        this.winMgr = winMgr;
    }

    init() {
        $("#upload").show();
    }

    nextClicked() {
        this.winMgr.closeWindow('upload');
    }

}

export = UploadDialog;