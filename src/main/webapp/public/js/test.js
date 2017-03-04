/**
 * Created by rain on 11.02.17.
 */
"use strict";
var WindowManager = require("./WindowManager");
var Application = (function () {
    function Application() {
        this.schemaName = "";
        this.attributeTypes = [];
        this.attributeActions = [];
        this.schema = {};
        this.workingSchema = {};
        this.method = "";
        this.getSchemas = function () {
            var response = "";
            $.ajax({
                url: './rest/schemas/',
                success: function (result) {
                    response = result;
                    console.log(result);
                },
                async: false
            });
            return response;
        };
        this.getSchema = function (schema) {
            var response = "";
            $.ajax({
                url: './rest/schema/' + schema,
                success: function (result) {
                    response = result;
                    console.log(result);
                },
                async: false
            });
            return response;
        };
        this.getValuesByColumn = function (columnName) {
            var values = [];
            for (var i in this.schema) {
                values.push(this.schema[i][columnName]);
            }
            return values;
        };
        this.getUniqueValueByColumn = function (columnName) {
            return this.app.unique(this.getValuesByColumn(columnName));
        };
        this.getColumnNamesByType = function (search) {
            var columns = [];
            for (var c in this.attributeTypes) {
                if (this.attributeTypes[c].type == search) {
                    columns.push(c);
                }
            }
            return columns;
        };
        this.equals = function (a, b) {
            return JSON.stringify(a) == JSON.stringify(b);
        };
        this.hasDuplicateKeys = function () {
            var columns = this.getColumnNamesByType("id");
            if (columns.length == 0) {
                console.log("non");
                return false;
            }
            var currentKey = {};
            var foundItems = [];
            for (var i = 0; i < Object.keys(this.schema).length; i++) {
                currentKey = {};
                for (var column = 0; column < columns.length; column++) {
                    var columnName = columns[column];
                    currentKey[columnName] = this.schema[i][columnName];
                }
                console.log("debug: ", JSON.stringify(currentKey));
                for (var j = 0; j < Object.keys(foundItems).length; j++) {
                    if (this.equals(currentKey, foundItems[j])) {
                        console.log("found");
                        return true;
                    }
                }
                foundItems.push(currentKey);
            }
            return false;
        };
    }
    return Application;
}());
var OpenDialog = (function () {
    function OpenDialog(app, winMgr) {
        this.app = app;
        this.winMgr = winMgr;
    }
    OpenDialog.prototype.init = function () {
        var schemasJSON = this.app.getSchemas();
        console.log("sadfsds");
        console.log([1, 2].length.toString());
        var htmlContent = "";
        for (var i in schemasJSON) {
            htmlContent += '<input class="table_check" type="checkbox"  name="' + schemasJSON[i] + '" >' + schemasJSON[i] + '<br>';
        }
        $('#table_list').html(htmlContent);
        $("#open").show();
        $(".table_check").change(function () {
            app.openDlg.checkboxesChanged();
        });
    };
    OpenDialog.prototype.buildPreviews = function (selectedElements) {
        var previewHtml = "None selected.";
        if (selectedElements.length > 0) {
            previewHtml = "";
            for (var _i = 0, selectedElements_1 = selectedElements; _i < selectedElements_1.length; _i++) {
                var schemaName = selectedElements_1[_i];
                var schemaJson = this.app.getSchema(schemaName);
                previewHtml += "<h4>" + schemaName + "</h4>";
                previewHtml += app.jsonToTable(schemaJson) + "<br>";
            }
        }
        $("#open_table_preview").html(previewHtml);
        return previewHtml;
    };
    OpenDialog.prototype.nextClicked = function () {
        var selected = [];
        $("#open input:checked").each(function () {
            selected.push($(this).attr('name'));
        });
        this.app.method = $("#anonymization_method").val();
        this.winMgr.closeWindow('open');
        this.app.joinDialog.init(selected);
    };
    OpenDialog.prototype.methodChanged = function () {
        if ($("#anonymization_method").val() == "none") {
            $("#open_next").prop("disabled", true);
        }
        else {
            $("#open_next").prop("disabled", false);
        }
    };
    OpenDialog.prototype.checkboxesChanged = function () {
        console.log("changed");
        var selectedCheckboxes = $("input:checked");
        var checkedInputs = selectedCheckboxes.length;
        if (checkedInputs == 0) {
            $("option[value=kanonymity]").prop("disabled", true);
            $("option[value=xy]").prop("disabled", true);
            $("option[value=multir]").prop("disabled", true);
            $("option[value=ldiv]").prop("disabled", true);
            $("option[value=tc]").prop("disabled", true);
            $("option[value=edif]").prop("disabled", true);
            $("option[value=dist]").prop("disabled", true);
        }
        else if (checkedInputs == 1) {
            $("option[value=kanonymity]").prop("disabled", false);
            $("option[value=xy]").prop("disabled", false);
            $("option[value=multir]").prop("disabled", true);
            $("option[value=ldiv]").prop("disabled", false);
            $("option[value=tc]").prop("disabled", false);
            $("option[value=edif]").prop("disabled", false);
            $("option[value=dist]").prop("disabled", false);
        }
        else {
            $("option[value=kanonymity]").prop("disabled", true);
            $("option[value=xy]").prop("disabled", true);
            $("option[value=multir]").prop("disabled", false);
            $("option[value=ldiv]").prop("disabled", true);
            $("option[value=tc]").prop("disabled", true);
            $("option[value=edif]").prop("disabled", true);
            $("option[value=dist]").prop("disabled", true);
            $("#anonymization_method").val("multir");
        }
        if (checkedInputs < 2 && ($("#anonymization_method").val() == "multir" || $("#anonymization_method").val() == null)) {
            $("#anonymization_method").val("none");
        }
        var selectedNames = [];
        if (checkedInputs == 1) {
            selectedNames.push(selectedCheckboxes.attr("name"));
        }
        else {
            for (var _i = 0, selectedCheckboxes_1 = selectedCheckboxes; _i < selectedCheckboxes_1.length; _i++) {
                var element = selectedCheckboxes_1[_i];
                selectedNames.push($(element).attr("name"));
            }
        }
        this.methodChanged();
        this.buildPreviews(selectedNames);
    };
    return OpenDialog;
}());
var JoinDialog = (function () {
    function JoinDialog(app, winMgr) {
        this.app = app;
        this.winMgr = winMgr;
    }
    JoinDialog.prototype.toggleSelect = function (header, element) {
        if (element.classList.contains("on")) {
            console.log("togle off: " + header);
            element.className = "";
        }
        else {
            console.log("togle on: " + header);
            element.className = "on";
        }
    };
    JoinDialog.prototype.buildTable = function (tableName, tableJson) {
        console.log("building....");
        var keys = [];
        for (var k in tableJson[0])
            keys.push(k);
        console.log("sdfsd");
        var content = "<table class='preview_table'><tr>";
        keys.forEach(function (e) {
            content += "<th onclick='toggleSelect(\"" + tableName + "." + e + "\", this)'>" + e + "</th>";
        });
        content += "</tr>";
        console.log(content);
        console.log(tableJson);
        var cellContent = "";
        var rowcount = 0;
        tableJson.forEach(function (row) {
            content += "<tr>";
            for (var cell in row) {
                cellContent = row[cell] == "" ? "e" : row[cell];
                content += "<td>" + cellContent + "</td>";
                console.log("cell: '" + cellContent + "'");
            }
            content += "</tr>";
            rowcount++;
            if (rowcount == 5) {
                return;
            }
        });
        content += "</table>";
        return content;
    };
    JoinDialog.prototype.init = function (selectedTables) {
        var schemasJSON = "";
        var htmlContent = '';
        console.log("init join");
        if (selectedTables.length == 0) {
            console.log("none");
            return;
        }
        else if (selectedTables.length == 1) {
            console.log("skip to column types");
            this.app.typeDialog.init(selectedTables[0]);
            return;
        }
        else {
            console.log("merge" + selectedTables.length.toString());
            for (var i in selectedTables) {
                console.log(selectedTables[i]);
                var schemasJSON = this.app.getSchema(selectedTables[i]);
                htmlContent += this.buildTable(selectedTables[i], schemasJSON);
            }
        }
        $("#join").show();
        $("#schema_list").html(htmlContent);
    };
    return JoinDialog;
}());
var TypeDialog = (function () {
    function TypeDialog(app, winMgr) {
        this.app = app;
        this.winMgr = winMgr;
    }
    TypeDialog.prototype.buildCombo = function (name) {
        return '<select class="type_select" name="' + name + '">' +
            '   <option value="none">Not Defined</option>' +
            '   <option value="id">ID</option>' +
            '   <option value="qid">QID</option>' +
            '   <option value="sensitive">Sensitive</option>' +
            '   <option value="nonsensitive">Nonsensitive</option>' +
            '</select>';
    };
    TypeDialog.prototype.buildTableTypes = function (tableName, tableJson) {
        console.log("building....");
        var keys = [];
        for (var k in tableJson[0])
            keys.push(k);
        var content = "<table class='preview_table'><tr>";
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var e = keys_1[_i];
            console.log(e);
            content += "<th>" + e + " " + this.buildCombo(e) + "</th>";
        }
        content += "</tr>";
        var cellContent = "";
        var rowcount = 0;
        tableJson.forEach(function (row) {
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
        });
        content += "</table>";
        return content;
    };
    TypeDialog.prototype.init = function (selectedTable) {
        this.app.schemaName = selectedTable;
        var schemasJSON = "";
        var htmlContent = '';
        this.app.schema = this.app.getSchema(selectedTable);
        htmlContent += this.buildTableTypes(selectedTable, this.app.schema);
        $("#types").show();
        $("#type_list").html(htmlContent);
    };
    TypeDialog.prototype.nextClicked = function () {
        this.app.attributeTypes = {};
        console.log("sadfsd");
        for (var _i = 0, _a = $('select[class="type_select"]'); _i < _a.length; _i++) {
            var element = _a[_i];
            var key = $(element).attr('name');
            var jsonVariable = {
                type: $(element).val()
            };
            this.app.attributeTypes[key] = jsonVariable;
        }
        if (this.app.hasDuplicateKeys()) {
            if (this.app.method == "kanonymity") {
                alert("Your table contains duplicate identifiers.\nYou should either add more coulmns as ID or choose (X, Y)-Anonymity instead.");
                return;
            }
        }
        this.winMgr.closeWindow('types');
        app.actionDlg.init(this.app.schemaName);
    };
    return TypeDialog;
}());
var ActionDialog = (function () {
    function ActionDialog(app, winMgr) {
        this.specificationEnded = false;
        this.app = app;
        this.winMgr = winMgr;
    }
    /*waitForIt() {
     if (!this.specificationEnded) {
     setTimeout(this.waitForIt, 250);
     } else {

     this.defineNextRule();
     }
     }*/
    ActionDialog.prototype.buildActionsCombo = function (name) {
        return '<select class="action_select" name="' + name + '">' +
            '   <option value="keep">Keep as is</option>' +
            '   <option value="remove">Remove column</option>' +
            '   <option value="generalize">Generalize</option>' +
            //'   <option value="suppress">Suppress</option>' +
            '</select>';
    };
    ActionDialog.prototype.buildActionsTable = function (tableName, tableJson) {
        console.log("building....");
        var keys = [];
        for (var k in tableJson[0])
            keys.push(k);
        var content = "<table class='preview_table'><tr>";
        for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
            var key = keys_2[_i];
            content += "<th>" + key + " " + this.buildActionsCombo(key) + "</th>";
        }
        content += "</tr>";
        var cellContent = "";
        var rowcount = 0;
        tableJson.forEach(function (row) {
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
        });
        content += "</table>";
        return content;
    };
    ActionDialog.prototype.preselectActions = function () {
        var identifiers = this.app.getColumnNamesByType("id");
        for (var i in identifiers) {
            console.log(identifiers[i]);
            var element = $('select[class="action_select"][name="' + identifiers[i] + '"]');
            element.val("remove");
            element.prop("disabled", true);
            element.prop("title", "Identificators will always be removed");
        }
        if (this.app.method == "kanonymity") {
            var identifiers = this.app.getColumnNamesByType("sensitive");
            for (var i in identifiers) {
                console.log(identifiers[i]);
                var element = $('select[class="action_select"][name="' + identifiers[i] + '"]');
                element.val("keep");
                element.prop("disabled", true);
                element.prop("title", "In k-Anonymity sensitive attributes are not generalized");
            }
        }
    };
    ActionDialog.prototype.init = function (selectedTable) {
        this.app.attributeActions = {};
        var htmlContent = '';
        console.log("types: " + selectedTable);
        htmlContent += this.buildActionsTable(selectedTable, this.app.schema);
        $("#actions").show();
        if (app.method == "kanonymity") {
            $("#special_actions").hide();
        }
        else {
            $("#special_actions").show();
        }
        $("#action_list").html(htmlContent);
        this.preselectActions();
    };
    ActionDialog.prototype.defineRules = function (jsonVariable, colName) {
        var columName = colName;
        this.specificationEnded = false;
        switch (jsonVariable.action) {
            case "keep":
            case "remove":
                this.specificationEnded = true;
                this.app.attributeActions[colName].defined = true;
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
                this.app.attributeActions[colName].defined = true;
                this.defineNextRule();
                break;
        }
        this.app.attributeActions[colName].defined = true;
    };
    ActionDialog.prototype.defineNextRule = function () {
        for (var colName in this.app.attributeActions) {
            if (!this.app.attributeActions[colName].defined) {
                this.defineRules(this.app.attributeActions[colName], colName);
                console.log("Rule defined for " + colName);
                //this.waitForIt();
                console.log("Rule defined END for " + colName);
                return;
            }
        }
        anonymizeData();
    };
    ActionDialog.prototype.nextClicked = function () {
        console.log("sadfsd");
        for (var _i = 0, _a = $('select[class="action_select"]'); _i < _a.length; _i++) {
            var element = _a[_i];
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
    };
    return ActionDialog;
}());
var GeneralizationDialog = (function () {
    function GeneralizationDialog(app, winMgr) {
        this.isNum = true;
        this.currentColumn = "";
        this.app = app;
        this.winMgr = winMgr;
    }
    GeneralizationDialog.prototype.init = function (columnName) {
        this.isNum = true;
        this.currentColumn = columnName;
        var cells = this.app.getUniqueValueByColumn(columnName);
        var elements = "";
        for (var i in cells) {
            elements += '<span class="word" onclick="app.generalizationDlg.addWord(this);">' + cells[i] + '</span>';
            if (!$.isNumeric(cells[i])) {
                this.isNum = false;
            }
        }
        if (this.isNum) {
            //selectIntervals();
            //$("#intervals_radio").prop("checked", true);
            $("#intervals_radio").click();
            $("#min_max").html('Min:' + Math.min.apply(Math, cells) + ' Max:' + Math.max.apply(Math, cells));
        }
        else {
            $("#values_radio").click();
            $("#value_pool").html(elements);
        }
        $("#column_name").html(this.currentColumn);
        $("#interval_size").val("");
        $("#rules").val("");
    };
    GeneralizationDialog.prototype.selectIntervals = function () {
        this.app.attributeActions[this.currentColumn].mode = "interval";
        $("#interval_desc").css("color", "inherit");
        $("#interval_size").prop("disabled", false);
        $("#rules").prop("disabled", true);
        $("#disabled").prop("disabled", true);
        $("#set_rule").prop("disabled", true);
        $("#new_rule").prop("disabled", true);
        $("#value_pool").prop("disabled", true);
    };
    GeneralizationDialog.prototype.selectValues = function () {
        this.app.attributeActions[this.currentColumn].mode = "values";
        $("#interval_desc").css("color", "#555");
        $("#interval_size").prop("disabled", true);
        $("#rules").prop("disabled", false);
        $("#set_rule").prop("disabled", false);
        $("#new_rule").prop("disabled", false);
        $("#value_pool").prop("disabled", false);
    };
    GeneralizationDialog.prototype.addWord = function (element) {
        $(element).hide();
        $("#rules").val($("#rules").val() + $(element).text() + ",");
    };
    GeneralizationDialog.prototype.addGeneralization = function () {
        var general = prompt("Please specify general value for these values", "");
        var currentRules = $("#rules").val();
        if (currentRules.slice(-1) == ",") {
            currentRules = currentRules.slice(0, -1);
        }
        $("#rules").val(currentRules + "->" + general);
    };
    GeneralizationDialog.prototype.newGeneralization = function () {
        $("#rules").val($("#rules").val() + "\n");
    };
    GeneralizationDialog.prototype.nextClicked = function () {
        if (this.app.attributeActions[this.currentColumn].mode == "interval") {
            this.app.attributeActions[this.currentColumn].operation = $("#interval_size").val();
        }
        else {
            this.app.attributeActions[this.currentColumn].operation = {};
            var lines = $("#rules").val().split("\n");
            for (var i = 0; i < lines.length; i++) {
                var parts = lines[i].split("->");
                var leftParts = parts[0].split(",");
                for (var j = 0; j < leftParts.length; j++) {
                    this.app.attributeActions[this.currentColumn].operation[leftParts[j]] = parts[1];
                }
            }
        }
        this.winMgr.closeWindow("generalization");
        //this.app.actionDialog.specificationEnded = true;
        this.app.actionDialog.defineNextRule();
    };
    return GeneralizationDialog;
}());
var Main = (function () {
    function Main() {
        this.winMgr = new WindowManager();
        this.app = new Application();
        this.openDlg = new OpenDialog(this.app, this.winMgr);
        this.joinDlg = new JoinDialog(this.app, this.winMgr);
        this.typeDlg = new TypeDialog(this.app, this.winMgr);
        this.actionDlg = new ActionDialog(this.app, this.winMgr);
        this.generalizationDlg = new GeneralizationDialog(this.app, this.winMgr);
    }
    Main.prototype.init = function () {
        this.winMgr.loadWindow("open");
        this.winMgr.loadWindow("join");
        this.winMgr.loadWindow("types");
        this.winMgr.loadWindow("actions");
        this.winMgr.loadWindow("generalization");
        this.winMgr.loadWindow("suppression");
        this.app.openDialog = this.openDlg;
        this.app.joinDialog = this.joinDlg;
        this.app.typeDialog = this.typeDlg;
        this.app.actionDialog = this.actionDlg;
        this.app.generalizationDialog = this.generalizationDlg;
        this.foo2();
    };
    Main.prototype.foo2 = function () {
        console.log("asdasda");
    };
    Main.prototype.jsonToTable = function (jsonData) {
        var table = '<table class="preview_table"><tr>';
        for (var _i = 0, _a = Object.keys(jsonData[0]); _i < _a.length; _i++) {
            var key = _a[_i];
            table += "<th>" + key + "</th>";
        }
        table += "</tr>";
        for (var _b = 0, jsonData_1 = jsonData; _b < jsonData_1.length; _b++) {
            var row = jsonData_1[_b];
            table += "<tr>";
            for (var cell in row) {
                table += "<td>" + row[cell] + "</td>";
            }
            table += "</tr>";
        }
        table += "</table>";
        return table;
    };
    return Main;
}());
var app = new Main();
