import Application = require("./../Application");
import WindowManager = require("./../WindowManager");
class ActionDialog {
    specificationEnded = false;

    app:Application;
    winMgr:WindowManager;

    constructor(app:Application, winMgr:WindowManager) {
        this.app = app;
        this.winMgr = winMgr;
    }

    buildActionsCombo(name:string) {
        return '<select class="action_select" name="' + name + '">' +
            '   <option value="keep">Keep as is</option>' +
            '   <option value="remove">Remove column</option>' +
            '   <option value="generalize">Generalize</option>' +
                //'   <option value="suppress">Suppress</option>' +
            '</select>';
    }

    buildActionsTable(tableJson) {
        console.log("building....");
        var keys = [];
        for (var k in tableJson[0]) keys.push(k);
        var content = "<table class='preview_table'><tr>";
        for (let key of keys) {
            content += "<th>" + key + " " + this.buildActionsCombo(key) + "</th>";
        }
        content += "</tr>";

        var cellContent = "";
        var rowcount = 0;
        tableJson.forEach(
            function (row) {
                content += "<tr>";
                for (var cell in row) {
                    cellContent = row[cell] == "" ? "e" : row[cell];
                    content += "<td>" + cellContent + "</td>";
                }
                content += "</tr>";
                rowcount++;
                if (rowcount == 5) {
                    return;
                }
            }
        );

        content += "</table>"

        return content;

    }

    preselectActions() {
        var identifiers = this.app.getColumnNamesByType("id");
        for (var i in identifiers) {
            console.log(identifiers[i]);
            var element = $('select[class="action_select"][name="' + identifiers[i] + '"]');
            element.val("remove");
            element.prop("disabled", true);
            element.prop("title", "Identificators will always be removed");
        }
        var identifiers = this.app.getColumnNamesByType("sensitive");
        for (var i in identifiers) {
            console.log(identifiers[i]);
            var element = $('select[class="action_select"][name="' + identifiers[i] + '"]');
            element.val("keep");
            element.prop("disabled", true);
            element.prop("title", "Sensitive attributes are not generalized");
        }
    }


    init() {
        this.app.attributeActions = {};
        var htmlContent = '';

        htmlContent += this.buildActionsTable(this.app.schema);
        $("#actions").show();

        if (this.app.method == "kanonymity") {
            $("#special_actions").hide();
        } else {
            $("#special_actions").show();
        }

        $("#action_list").html(htmlContent);
        this.preselectActions();
    }


    defineRules(action, columnName:string) {
        var columName = columnName;
        this.specificationEnded = false;
        switch (action.action) {
            case "keep":
            case "remove":
                this.specificationEnded = true;
                this.app.attributeActions[columnName].defined = true;
                this.defineNextRule();
                break;
            case "generalize":
                this.app.generalizationDialog.init(columName);
                $("#generalization").show();
                break;
            case "suppress":
                setupSuppression(columName);
                $("#suppression").show();
                break;
            default:
                this.specificationEnded = true;
                this.app.attributeActions[columnName].defined = true;
                this.defineNextRule();
                break;
        }
        this.app.attributeActions[columnName].defined = true;
    }


    defineNextRule() {
        for (var colName in this.app.attributeActions) {
            if (!this.app.attributeActions[colName].defined) {
                this.defineRules(this.app.attributeActions[colName], colName);
                console.log("Rule defined for " + colName);
                //this.waitForIt();
                console.log("Rule defined END for " + colName);
                return;
            }
        }
        this.app.anonymizer.anonymizeData();
    }


    nextClicked() {
        console.log("sadfsd");
        for (let element of $('select[class="action_select"]')) {
            var colName = $(element).attr('name');
            var jsonVariable = {};
            jsonVariable["action"] = $(element).val();
            jsonVariable["defined"] = false;
            this.app.attributeActions[colName] = jsonVariable;
        }
        this.defineNextRule();
        this.winMgr.closeWindow('actions');
        console.log(this.app.attributeActions);
        console.log("defining done");

    }
}

export = ActionDialog;