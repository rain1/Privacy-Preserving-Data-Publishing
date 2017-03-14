/**
 * Created by rain on 11.02.17.
 */

import WindowManager = require("./WindowManager");
import GeneralizationDialog = require("./dialogs/GeneralizationDialog");
import Application = require("./Application");
import OpenDialog = require("./dialogs/OpenDialog");
import JoinDialog = require("./dialogs/JoinDialog");
import TypeDialog = require("./dialogs/TypeDialog");
import ActionDialog = require("./dialogs/ActionDialog");
import Anonymization = require("./Anonymization");
import UploadDialog = require("./dialogs/UploadDialog");
import Statistics = require("./Statistics");


class Main {
    winMgr = new WindowManager();
    app = new Application();
    openDlg = new OpenDialog(this.app, this.winMgr);
    uploadDlg = new UploadDialog(this.app, this.winMgr);
    joinDlg = new JoinDialog(this.app, this.winMgr);
    typeDlg = new TypeDialog(this.app, this.winMgr);
    actionDlg = new ActionDialog(this.app, this.winMgr);
    generalizationDlg = new GeneralizationDialog(this.app, this.winMgr);
    anonymizer = new Anonymization(this.app);

    init() {
        this.winMgr.loadWindow("open");
        this.winMgr.loadWindow("join");
        this.winMgr.loadWindow("types");
        this.winMgr.loadWindow("actions");
        this.winMgr.loadWindow("generalization");
        this.winMgr.loadWindow("suppression");
        this.winMgr.loadWindow("upload");

        this.app.uploadDialog = this.uploadDlg;
        this.app.openDialog = this.openDlg;
        this.app.joinDialog = this.joinDlg;
        this.app.typeDialog = this.typeDlg;
        this.app.actionDialog = this.actionDlg;
        this.app.generalizationDialog = this.generalizationDlg;
        this.app.anonymizer = this.anonymizer;
    }

    jsonToTable(jsonData, maxLength:number = -1, highlight:string[] = [], id:string = "") {

        if (id != "") {
            id = ' id="' + id + '"';
        }

        var table = '<table' + id + ' class="preview_table"><thead><tr>';

        for (let key of Object.keys(jsonData[0])) {
            if (highlight.indexOf(key) > -1) {
                table += '<th class="highlight">' + key + "</th>";
            } else {
                table += "<th>" + key + "</th>";
            }
        }
        table += "</tr></thead><tbody>";

        var rowCount = 0;
        for (let row of jsonData) {
            table += "<tr>";
            for (let cell in row) {
                if (highlight.indexOf(cell) > -1) {
                    table += '<td class="highlight">' + row[cell] + "</td>";
                } else {
                    table += '<td>' + row[cell] + "</td>";
                }
            }
            table += "</tr>";
            rowCount++;
            if (rowCount == maxLength) {
                table += "<tr>";
                for (let cell in row) {
                    table += "<td>" + "..." + "</td>"
                }
                table += "</tr>";
                break;
            }
        }

        table += "</tbody></table>";

        return table;
    }

    jsonToCSV(jsonData) {
        var table = '';

        for (let key of Object.keys(jsonData[0])) {
            table += key + ",";
        }
        table = table.slice(0,-1);
        table += "\n";

        for (let row of jsonData) {
            for (let cell in row) {
                    table += row[cell] + ",";
            }
            table = table.slice(0,-1);
            table += "\n";
        }

        return table;
    }

}

window.app = new Main();
window.statistics = new Statistics();
console.log("I am alive");