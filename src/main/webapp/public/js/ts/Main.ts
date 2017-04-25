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
    statistics = new Statistics(this.app);

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

    getHighlightClass(row:{}, highlightData:{}, qidColumns:string[], sensitiveColumns:string[]) {
        var highlightClass = "normal";
        if (Object.keys(highlightData).length == 0) {
            return highlightClass;
        }
        if (this.app.method == "tc" || this.app.method == "ldiv") {
            var qidData = this.statistics.getRowColumns(row, qidColumns);
            var sensitiveData = this.statistics.getRowColumns(row, sensitiveColumns);
            for (let key in highlightData["fails"]) {
                if (JSON.stringify(qidData) == key) {
                    highlightClass = "warn-group";
                    if (this.app.method == "tc" && highlightData["fails"][key].indexOf(sensitiveData[sensitiveColumns[0]]) > -1) {
                        highlightClass = "warn-row";
                    }
                }
            }
        }
        return highlightClass;
    }

    jsonToTable(jsonData, maxLength:number = -1, highlight:string[] = [], id:string = "", highlightData = {}) {
        var qidColumns = this.app.getColumnNamesByType("qid");
        var sensitiveColumns = this.app.getColumnNamesByType("sensitive");

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
            table += '<tr class="' + this.getHighlightClass(row, highlightData, qidColumns, sensitiveColumns) + '">';
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
        table = table.slice(0, -1);
        table += "\n";

        for (let row of jsonData) {
            for (let cell in row) {
                table += '"' + row[cell] + '",';
            }
            table = table.slice(0, -1);
            table += "\n";
        }

        return table;
    }

    jsonToString() {
        var exportData = {
            tableFull: this.app.anonymizedSchemaFull,
            table: this.app.anonymizedSchema,
            types: this.app.attributeTypes,
            actions: this.app.attributeActions,
            method: this.app.method,
            param: this.app.methodParam
        };
        return JSON.stringify(exportData);
    }

}

window.app = new Main();
window.statistics = new Statistics();
console.log("I am alive");