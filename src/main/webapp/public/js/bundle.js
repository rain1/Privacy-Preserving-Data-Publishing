/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

"use strict";
"use strict";
var ActionDialog = (function () {
    function ActionDialog(app, winMgr) {
        this.specificationEnded = false;
        this.app = app;
        this.winMgr = winMgr;
    }
    ActionDialog.prototype.buildActionsCombo = function (name) {
        return '<select class="action_select" name="' + name + '">' +
            '   <option value="keep">Keep as is</option>' +
            '   <option value="remove">Remove column</option>' +
            '   <option value="generalize">Generalize</option>' +
            //'   <option value="suppress">Suppress</option>' +
            '</select>';
    };
    ActionDialog.prototype.buildActionsTable = function (tableJson) {
        console.log("building....");
        var keys = [];
        for (var k in tableJson[0])
            keys.push(k);
        var content = "<table class='preview_table'><tr>";
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
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
    ActionDialog.prototype.init = function () {
        this.app.attributeActions = {};
        var htmlContent = '';
        htmlContent += this.buildActionsTable(this.app.schema);
        $("#actions").show();
        if (this.app.method == "kanonymity") {
            $("#special_actions").hide();
        }
        else {
            $("#special_actions").show();
        }
        $("#action_list").html(htmlContent);
        this.preselectActions();
    };
    ActionDialog.prototype.defineRules = function (action, columnName) {
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
        this.app.anonymizer.anonymizeData();
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
module.exports = ActionDialog;


/***/ },
/* 1 */
/***/ function(module, exports) {

"use strict";
"use strict";
var Application = (function () {
    function Application() {
        this.schemaName = "";
        this.attributeTypes = [];
        this.attributeActions = [];
        this.schema = {};
        this.workingSchema = {};
        this.method = "";
    }
    Application.prototype.getSchemas = function () {
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
    ;
    Application.prototype.getSchema = function (schema) {
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
    ;
    Application.prototype.getValuesByColumn = function (columnName, schema) {
        if (schema === void 0) { schema = {}; }
        var values = [];
        if (this.equals(schema, {})) {
            schema = this.schema;
        }
        for (var i in schema) {
            values.push(schema[i][columnName]);
        }
        return values;
    };
    ;
    Application.prototype.getUniqueValueByColumn = function (columnName, schema) {
        if (schema === void 0) { schema = {}; }
        return unique(this.getValuesByColumn(columnName, schema));
    };
    ;
    Application.prototype.getColumnNamesByType = function (search) {
        var columns = [];
        for (var c in this.attributeTypes) {
            if (this.attributeTypes[c].type == search) {
                columns.push(c);
            }
        }
        return columns;
    };
    ;
    Application.prototype.equals = function (a, b) {
        return JSON.stringify(a) == JSON.stringify(b);
    };
    ;
    Application.prototype.hasDuplicateKeys = function () {
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
    ;
    return Application;
}());
module.exports = Application;


/***/ },
/* 2 */
/***/ function(module, exports) {

"use strict";
"use strict";
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
            $("#min_max").html("");
            $("#values_radio").click();
            $("#value_pool").html(elements);
        }
        $("#column_name").html(this.currentColumn);
        $("#interval_size").val("");
        $("#rules").val("");
        $("#generalization_preview").html(app.jsonToTable(this.app.schema, -1, [this.currentColumn]));
        //$("#generalization_next").prop("disabled", true);
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
        $("#rules").val($("#rules").val() + "\n");
    };
    GeneralizationDialog.prototype.intervalSizeChanged = function () {
        if (this.app.attributeActions[this.currentColumn].mode == "interval") {
            var inputValue = $("#interval_size").val();
            if (inputValue == "") {
                $("#generalization_next").prop("disabled", true);
            }
            else {
                $("#generalization_next").prop("disabled", false);
            }
        }
    };
    GeneralizationDialog.prototype.nextClicked = function () {
        if (this.app.attributeActions[this.currentColumn].mode == "interval") {
            this.app.attributeActions[this.currentColumn].operation = $("#interval_size").val();
        }
        else {
            this.app.attributeActions[this.currentColumn].operation = {};
            var inputValue = $("#rules").val();
            if (inputValue.substring(inputValue.length - 1) == "\n") {
                inputValue = inputValue.substring(0, inputValue.length - 1);
            }
            var lines = inputValue.split("\n");
            for (var i = 0; i < lines.length; i++) {
                var parts = lines[i].split("->");
                var leftParts = parts[0].split(",");
                for (var j = 0; j < leftParts.length; j++) {
                    this.app.attributeActions[this.currentColumn].operation[leftParts[j]] = parts[1];
                }
            }
        }
        this.winMgr.closeWindow("generalization");
        this.app.actionDialog.defineNextRule();
    };
    return GeneralizationDialog;
}());
module.exports = GeneralizationDialog;


/***/ },
/* 3 */
/***/ function(module, exports) {

"use strict";
"use strict";
var ColumnHeader = (function () {
    function ColumnHeader(columnName) {
        this.columnName = "";
        this.columnName = columnName;
    }
    ColumnHeader.prototype.getTableName = function () {
        return this.columnName.split(".")[0];
    };
    return ColumnHeader;
}());
var JoinRule = (function () {
    function JoinRule(left, operator, right) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    JoinRule.prototype.toString = function () {
        return this.left.columnName + this.operator + this.right.columnName;
    };
    JoinRule.prototype.getLeftString = function () {
        return this.left.columnName;
    };
    JoinRule.prototype.getRightString = function () {
        return this.right.columnName;
    };
    JoinRule.prototype.getOperator = function () {
        return this.operator;
    };
    return JoinRule;
}());
var JoinDialog = (function () {
    function JoinDialog(app, winMgr) {
        this.schemasJSON = {};
        this.defineRules = false;
        this.joinRules = {};
        this.joinRulesList = [];
        this.lastJoinResult = [];
        this.app = app;
        this.winMgr = winMgr;
    }
    JoinDialog.prototype.findRuleByString = function (rule) {
        for (var index in this.joinRulesList) {
            if (this.joinRulesList[index].toString() == rule) {
                return index;
            }
        }
        return -1;
    };
    JoinDialog.prototype.addRule = function () {
        this.defineRules = true;
        var joinButton = $("#new_join_rule");
        joinButton.prop("disabled", true);
        joinButton.val("Ok");
        joinButton.prop("title", "Please select table headers left.");
        joinButton.attr("onclick", "app.joinDlg.finishRule();");
        $('#schema_list .preview_table th').css("color", "#000");
    };
    JoinDialog.prototype.finishRule = function () {
        this.defineRules = false;
        var joinButton = $("#new_join_rule");
        var ruleKeys = Object.keys(this.joinRules);
        var joinRule = new JoinRule(this.joinRules[ruleKeys[0]], "=", this.joinRules[ruleKeys[1]]);
        this.joinRulesList.push(joinRule);
        var htmlContent = '<code class="window_container"><span class="rule">' + joinRule.toString() + '</span><img class="icon24 window_container_remove" src="./public/icons/delete.png" title="Remove rule" onclick="app.joinDlg.removeRule(this)"></code>';
        $("#join_rules").append(htmlContent);
        joinButton.val("Add rule");
        joinButton.attr("onclick", "app.joinDlg.addRule();");
        for (var _i = 0, _a = this.tableNames; _i < _a.length; _i++) {
            var tableName = _a[_i];
            for (var _b = 0, _c = $("#" + tableName + " th"); _b < _c.length; _b++) {
                var currrentElement = _c[_b];
                currrentElement.className = "";
            }
        }
        $('#schema_list .preview_table th').css("color", "#555");
        this.joinRules = {};
        this.showResult();
    };
    JoinDialog.prototype.removeRule = function (element) {
        var parent = $(element).parent();
        var rule = $(".rule", parent).text();
        var index = this.findRuleByString(rule);
        this.joinRulesList.splice(index, 1);
        parent.remove();
        this.showResult();
    };
    JoinDialog.prototype.toggleSelect = function (header, element) {
        if (this.defineRules) {
            if (element.classList.contains("on")) {
                console.log("toggle off: " + header);
                element.className = "";
            }
            else {
                console.log("toggle on: " + header);
                var tablename = header.split(".")[0];
                for (var _i = 0, _a = $("#" + tablename + " th"); _i < _a.length; _i++) {
                    var currrentElement = _a[_i];
                    currrentElement.className = "";
                }
                element.className = "on";
                this.joinRules[tablename] = new ColumnHeader(header);
                if (Object.keys(this.joinRules).length == 2) {
                    var joinButton = $("#new_join_rule");
                    joinButton.prop("disabled", false);
                    joinButton.prop("title", "");
                }
            }
        }
        else {
            alert("You are not currently defining any rules. Please click on 'Add rule' first.");
        }
    };
    JoinDialog.prototype.buildTable = function (tableName, tableJson) {
        console.log("building....");
        var keys = [];
        for (var k in tableJson[0])
            keys.push(k);
        var content = "<h4>" + tableName + "</h4><table class='preview_table'><tr id='" + tableName + "'>";
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            content += "<th onclick='app.joinDlg.toggleSelect(\"" + tableName + "." + key + "\", this)'>" + key + "</th>";
        }
        content += "</tr>";
        var cellContent = "";
        var rowcount = 0;
        for (var _a = 0, tableJson_1 = tableJson; _a < tableJson_1.length; _a++) {
            var row = tableJson_1[_a];
            content += "<tr>";
            for (var cell in row) {
                cellContent = row[cell] == "" ? "e" : row[cell];
                content += "<td>" + cellContent + "</td>";
            }
            content += "</tr>";
            rowcount++;
            if (rowcount == 5) {
                content += "<tr>";
                for (var cell in row) {
                    content += "<td>...</td>";
                }
                content += "</tr>";
                break;
            }
        }
        content += "</table>";
        return content;
    };
    JoinDialog.prototype.nextClicked = function () {
        this.winMgr.closeWindow("join");
        this.app.schema = this.lastJoinResult;
        this.app.typeDialog.init("merged");
    };
    JoinDialog.prototype.init = function (selectedTables) {
        var htmlContent = '';
        this.schemasJSON = {};
        this.tableNames = selectedTables;
        console.log("init join");
        if (selectedTables.length == 0) {
            console.log("none");
            return;
        }
        else if (selectedTables.length == 1) {
            console.log("skip to column types");
            this.app.schema = this.app.getSchema(selectedTables[0]);
            this.app.typeDialog.init(selectedTables[0]);
            return;
        }
        else {
            console.log("merge" + selectedTables.length.toString());
            for (var _i = 0, selectedTables_1 = selectedTables; _i < selectedTables_1.length; _i++) {
                var schemaName = selectedTables_1[_i];
                console.log(schemaName);
                this.schemasJSON[schemaName] = this.app.getSchema(schemaName);
                htmlContent += this.buildTable(schemaName, this.schemasJSON[schemaName]);
            }
        }
        $("#join").show();
        $("#schema_list").html(htmlContent);
        $('#schema_list .preview_table th').css("color", "#555");
        $("#joinNext").prop("disabled", true);
    };
    JoinDialog.prototype.compareRow = function (rows) {
        var generatedRow = {};
        var addRow = true;
        var rules = this.joinRulesList;
        for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
            var rule = rules_1[_i];
            var left = rule.getLeftString().split(".");
            var op = rule.getOperator();
            var right = rule.getRightString().split(".");
            var leftData = rows[left[0]][left[1]];
            var rightData = rows[right[0]][right[1]];
            if (leftData == undefined || rightData == undefined) {
                console.error("Row does not have fields with exptected names.");
                return {
                    "add": false,
                    "content": {}
                };
            }
            if (op = "=") {
                if (leftData != rightData) {
                    return {
                        "add": false,
                        "content": {}
                    };
                }
            }
        }
        for (var _a = 0, _b = Object.keys(rows); _a < _b.length; _a++) {
            var tableName = _b[_a];
            generatedRow = jQuery.extend(true, generatedRow, rows[tableName]);
        }
        return {
            "add": addRow,
            "content": generatedRow
        };
    };
    JoinDialog.prototype.joinTables = function (schemaList, rows, resultTable) {
        if (this.joinRulesList.length == 0) {
            return [];
        }
        var joinRules = {};
        var tableName = Object.keys(schemaList)[0];
        if (Object.keys(schemaList).length == 0) {
            return schemaList;
        }
        else if (Object.keys(schemaList).length == 1) {
            var currentJson = schemaList[tableName]; //pop
            delete schemaList[tableName]; //pop
            for (var _i = 0, currentJson_1 = currentJson; _i < currentJson_1.length; _i++) {
                var row1 = currentJson_1[_i];
                rows[tableName] = row1;
                var compareResult = this.compareRow(rows);
                if (compareResult.add) {
                    console.log(compareResult.content);
                    resultTable.push(compareResult.content);
                }
            }
        }
        else {
            var currentJson = schemaList[tableName]; //pop
            delete schemaList[Object.keys(schemaList)[0]]; //pop
            for (var _a = 0, currentJson_2 = currentJson; _a < currentJson_2.length; _a++) {
                var row1 = currentJson_2[_a];
                rows[tableName] = row1;
                this.joinTables(jQuery.extend(true, {}, schemaList), rows, resultTable);
            }
        }
        return resultTable;
    };
    JoinDialog.prototype.showResult = function () {
        var result = this.joinTables(jQuery.extend(true, {}, this.schemasJSON), {}, []);
        if (result.length == 0 && this.joinRulesList.length == 0) {
            $("#join_preview").html("No rules defined.");
            $("#joinNext").prop("disabled", true);
        }
        else if (result.length == 0 && this.joinRulesList.length > 0) {
            $("#join_preview").html("Rules are defined but seem to be invalid. Please check your rules and remove any rules that incorrect.<br>Hint: can you expect Job to be equal to diasese");
            $("#joinNext").prop("disabled", true);
        }
        else {
            $("#join_preview").html(app.jsonToTable(result));
            this.lastJoinResult = result;
            $("#joinNext").prop("disabled", false);
        }
    };
    return JoinDialog;
}());
module.exports = JoinDialog;


/***/ },
/* 4 */
/***/ function(module, exports) {

"use strict";
"use strict";
var OpenDialog = (function () {
    function OpenDialog(app, winMgr) {
        this.app = app;
        this.winMgr = winMgr;
    }
    OpenDialog.prototype.init = function () {
        var schemasJSON = this.app.getSchemas();
        $("#anonymization_method").val("none");
        $("#open_table_preview").html("None selected.");
        this.methodChanged();
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
                previewHtml += app.jsonToTable(schemaJson, 5) + "<br>";
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
        var selectedCheckboxes = $("input:checked[type=checkbox]");
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
module.exports = OpenDialog;


/***/ },
/* 5 */
/***/ function(module, exports) {

"use strict";
"use strict";
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
    TypeDialog.prototype.buildTableTypes = function (tableJson) {
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
        htmlContent += this.buildTableTypes(this.app.schema);
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
        app.actionDlg.init();
    };
    return TypeDialog;
}());
module.exports = TypeDialog;


/***/ },
/* 6 */
/***/ function(module, exports) {

"use strict";
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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by rain on 11.02.17.
 */
"use strict";
var WindowManager = __webpack_require__(6);
var GeneralizationDialog = __webpack_require__(2);
var Application = __webpack_require__(1);
var OpenDialog = __webpack_require__(4);
var JoinDialog = __webpack_require__(3);
var TypeDialog = __webpack_require__(5);
var ActionDialog = __webpack_require__(0);
var Anonymization = __webpack_require__(8);
var Main = (function () {
    function Main() {
        this.winMgr = new WindowManager();
        this.app = new Application();
        this.openDlg = new OpenDialog(this.app, this.winMgr);
        this.joinDlg = new JoinDialog(this.app, this.winMgr);
        this.typeDlg = new TypeDialog(this.app, this.winMgr);
        this.actionDlg = new ActionDialog(this.app, this.winMgr);
        this.generalizationDlg = new GeneralizationDialog(this.app, this.winMgr);
        this.anonymizer = new Anonymization(this.app);
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
        this.app.anonymizer = this.anonymizer;
    };
    Main.prototype.jsonToTable = function (jsonData, maxLength, highlight, id) {
        if (maxLength === void 0) { maxLength = -1; }
        if (highlight === void 0) { highlight = []; }
        if (id === void 0) { id = ""; }
        if (id != "") {
            id = ' id="' + id + '"';
        }
        var table = '<table' + id + ' class="preview_table"><thead><tr>';
        for (var _i = 0, _a = Object.keys(jsonData[0]); _i < _a.length; _i++) {
            var key = _a[_i];
            if (highlight.indexOf(key) > -1) {
                table += '<th class="highlight">' + key + "</th>";
            }
            else {
                table += "<th>" + key + "</th>";
            }
        }
        table += "</tr></thead><tbody>";
        var rowCount = 0;
        for (var _b = 0, jsonData_1 = jsonData; _b < jsonData_1.length; _b++) {
            var row = jsonData_1[_b];
            table += "<tr>";
            for (var cell in row) {
                if (highlight.indexOf(cell) > -1) {
                    table += '<td class="highlight">' + row[cell] + "</td>";
                }
                else {
                    table += '<td>' + row[cell] + "</td>";
                }
            }
            table += "</tr>";
            rowCount++;
            if (rowCount == maxLength) {
                table += "<tr>";
                for (var cell in row) {
                    table += "<td>" + "..." + "</td>";
                }
                table += "</tr>";
                break;
            }
        }
        table += "</tbody></table>";
        return table;
    };
    return Main;
}());
window.app = new Main();
console.log("I am alive");


/***/ },
/* 8 */
/***/ function(module, exports) {

"use strict";
"use strict";
var Anonymization = (function () {
    function Anonymization(app) {
        this.app = app;
    }
    Anonymization.prototype.anonymizeCell = function (cell, rule) {
        switch (rule.action) {
            case "keep":
                return cell;
            case "remove":
                //specificationEnded = true;
                break;
            case "generalize":
                if (rule.mode == "interval") {
                    var result = cell / rule.operation;
                    return "[" + Math.floor(result) * rule.operation + ", " + (Math.floor(result) + 1) * rule.operation + ")";
                }
                else {
                    return rule.operation[cell];
                }
                break;
            case "suppress":
                //setupSuppression(columName);
                $("#suppression").show();
                break;
            default:
                //specificationEnded = true;
                break;
        }
    };
    Anonymization.prototype.anonymizeData = function () {
        this.app.workingSchema = jQuery.extend(true, {}, this.app.schema);
        var resultTable = [];
        for (var i = 0; i < this.app.schema.length; i++) {
            var obj = this.app.schema[i];
            var row = {};
            for (var key in obj) {
                var actionData = this.app.attributeActions[key];
                if (actionData.action != "remove") {
                    row[key] = this.anonymizeCell(obj[key], actionData);
                    console.log(key, obj[key], actionData);
                }
            }
            resultTable.push(row);
        }
        //TODO see tuleb 6igesti teha.
        console.log(JSON.stringify(resultTable));
        var qid_cols = this.app.getColumnNamesByType("qid");
        var tableKeys = Object.keys(resultTable[0]);
        var qid_ids = [];
        for (i in tableKeys) {
            if (qid_cols.indexOf(tableKeys[i]) > -1) {
                qid_ids.push({
                    "name": tableKeys[i],
                    "values": this.app.getUniqueValueByColumn(tableKeys[i], resultTable).length,
                    'id': i
                });
            }
        }
        qid_ids.sort(function (a, b) {
            return parseFloat(a.values) - parseFloat(b.values);
        });
        var final_sort = [];
        for (var _i = 0, qid_ids_1 = qid_ids; _i < qid_ids_1.length; _i++) {
            var sortToken = qid_ids_1[_i];
            final_sort.push([sortToken.id, 0]);
        }
        debugger;
        $("#finished_table").html(app.jsonToTable(resultTable, -1, [], "myTable"));
        $("#myTable").tablesorter({ sortList: final_sort }); //TODO sorteerida muutuste j2gi, et saada max QID.
    };
    return Anonymization;
}());
module.exports = Anonymization;


/***/ }
/******/ ]);