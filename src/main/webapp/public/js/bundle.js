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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

"use strict";
"use strict";
var Statistics = (function () {
    function Statistics(app) {
        this.charts = [];
        Chart.defaults.global.legend.display = false;
        this.app = app;
    }
    Statistics.prototype.pushElement = function (qidMap, qid, element) {
        if (qidMap[qid] == undefined) {
            qidMap[qid] = [element];
        }
        else {
            qidMap[qid].push(element);
        }
    };
    Statistics.prototype.addId = function (qidMap, qid, id) {
        if (qidMap[qid] == undefined) {
            qidMap[qid] = new Set([id]);
        }
        else {
            qidMap[qid].add(id);
        }
    };
    Statistics.prototype.incrementMapCounter = function (qidMap, key) {
        if (qidMap[key] == undefined) {
            qidMap[key] = 1;
        }
        else {
            qidMap[key] += 1;
        }
    };
    Statistics.prototype.getRowColumns = function (row, columns) {
        var selected = {};
        for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
            var column = columns_1[_i];
            selected[column] = row[column];
        }
        return selected;
    };
    Statistics.prototype.getRowColumnsNot = function (row, columns) {
        var selected = {};
        for (var key in Object.keys(row)) {
            if (columns.indexOf(row[key]) == -1) {
                selected[key] = row[key];
            }
        }
        return selected;
    };
    Statistics.prototype.selectColumns = function (table, columns) {
        var resultTable = [];
        for (var _i = 0, table_1 = table; _i < table_1.length; _i++) {
            var row = table_1[_i];
            resultTable.push(this.getRowColumns(row, columns));
        }
        return resultTable;
    };
    Statistics.prototype.getQIDSizeMap = function (qidColumns) {
        var qidMap = {};
        for (var _i = 0, _a = this.app.anonymizedSchema; _i < _a.length; _i++) {
            var row = _a[_i];
            var qid = this.getRowColumns(row, qidColumns);
            this.incrementMapCounter(qidMap, JSON.stringify(qid));
        }
        return qidMap;
    };
    Statistics.prototype.xyMap = function (qidColumns, idColumns) {
        var qidIdMap = {};
        for (var _i = 0, _a = this.app.anonymizedSchemaFull; _i < _a.length; _i++) {
            var row = _a[_i];
            var qid = this.getRowColumns(row, qidColumns);
            var id = this.getRowColumns(row, idColumns);
            this.addId(qidIdMap, JSON.stringify(qid), JSON.stringify(id));
        }
        return qidIdMap;
    };
    Statistics.prototype.max = function (list) {
        var maximum = -Infinity;
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var element = list_1[_i];
            if (element > maximum) {
                maximum = element;
            }
        }
        return maximum;
    };
    Statistics.prototype.min = function (list) {
        var minimum = +Infinity;
        for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
            var element = list_2[_i];
            if (element < minimum) {
                minimum = element;
            }
        }
        return minimum;
    };
    Statistics.prototype.findLargestMapValue = function (qidMap) {
        var valueList = Object.values(qidMap);
        return this.max(valueList);
    };
    Statistics.prototype.findSmallestMapValue = function (qidMap) {
        var valueList = Object.values(qidMap);
        return this.min(valueList);
    };
    Statistics.prototype.findLargestMapKey = function (qidMap) {
        var keyList = Object.keys(qidMap).map(function (x) { return parseInt(x); });
        return this.max(keyList);
    };
    Statistics.prototype.findSmallestMapKey = function (qidMap) {
        var keyList = Object.keys(qidMap).map(function (x) { return parseInt(x); });
        return this.min(keyList);
    };
    Statistics.prototype.buildCanvas = function (id) {
        return '<div class="canvas_container"><canvas id="' + id + '"></canvas></div>';
    };
    Statistics.prototype.getXYStatistics = function (qidColumns, correspondingColumns) {
        var qidIdSet = this.xyMap(qidColumns, correspondingColumns);
        var qidIdSetSizeMap = this.qidIdSetToSizeMap(qidIdSet);
        var smallestQIDXY = this.findSmallestMapKey(qidIdSetSizeMap);
        var largestQIDXY = this.findLargestMapKey(qidIdSetSizeMap);
        return {
            map: qidIdSetSizeMap,
            smallest: smallestQIDXY,
            largest: largestQIDXY,
            rawMap: qidIdSet
        };
    };
    Statistics.prototype.frequencyMapToRelative = function (distributionMap, numElements) {
        for (var key in distributionMap) {
            distributionMap[key] = distributionMap[key] / numElements;
        }
    };
    Statistics.prototype.getTableFrequencyMap = function (table, sensitiveColumn) {
        var distributionMap = {};
        var numElements = table.length;
        for (var _i = 0, table_2 = table; _i < table_2.length; _i++) {
            var row = table_2[_i];
            this.incrementMapCounter(distributionMap, row[sensitiveColumn]);
        }
        this.frequencyMapToRelative(distributionMap, numElements);
        return distributionMap;
    };
    Statistics.prototype.getGroupFrequencyMap = function (values) {
        var distributionMap = {};
        var numElements = values.length;
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var value = values_1[_i];
            this.incrementMapCounter(distributionMap, value);
        }
        this.frequencyMapToRelative(distributionMap, numElements);
        return distributionMap;
    };
    Statistics.prototype.getDistributionsSimilarity = function (table, qidColumns, sensitiveColumns) {
        var sensitiveColumn = sensitiveColumns[0];
        var tableDistributionMap = this.getTableFrequencyMap(table, sensitiveColumn);
        var qidSensitiveMap = {};
        for (var _i = 0, table_3 = table; _i < table_3.length; _i++) {
            var row = table_3[_i];
            var qid = this.getRowColumns(row, qidColumns);
            var sensitive = this.getRowColumns(row, [sensitiveColumn]);
            this.pushElement(qidSensitiveMap, JSON.stringify(qid), sensitive[sensitiveColumns[0]]);
        }
        var qidFrequencies = {};
        for (var key in qidSensitiveMap) {
            qidFrequencies[key] = this.getGroupFrequencyMap(qidSensitiveMap[key]);
        }
        var qidFails = {};
        for (var qidKey in qidFrequencies) {
            for (var sensitiveKey in qidFrequencies[qidKey]) {
                if (Math.abs(qidFrequencies[qidKey][sensitiveKey] - tableDistributionMap[sensitiveKey]) > 0.1) {
                    this.pushElement(qidFails, qidKey, sensitiveKey);
                }
            }
        }
        return {
            total: Object.keys(qidFrequencies).length,
            fails: qidFails
        };
    };
    Statistics.prototype.filterSetMap = function (qidIdMap) {
        var setMap = {};
        for (var key in qidIdMap) {
            var element = qidIdMap[key];
            if (element.size == 1) {
                setMap[key] = {};
            }
        }
        return setMap;
    };
    Statistics.prototype.build = function () {
        var statistics = "<b>Statistics:</b><br>";
        var qidColumns = this.app.getColumnNamesByType("qid");
        var idColumns = this.app.getColumnNamesByType("id");
        var sensitiveColumns = this.app.getColumnNamesByType("sensitive");
        var qidMap = this.getQIDSizeMap(qidColumns);
        var frequencyMap = this.qidMapToFrequencyMap(qidMap);
        var smallestQID = this.findSmallestMapValue(qidMap);
        var largestQID = this.findLargestMapValue(qidMap);
        var highlightData = {};
        if (qidColumns.length == 0) {
            statistics += "Warning: QID not defined<br>";
        }
        else {
            statistics += "Unique QIDs: " + Object.keys(qidMap).length + "<br>";
            switch (this.app.method) {
                case "kanonymity":
                case "multir":
                case "edif":
                    statistics += "Smallest QID group: " + smallestQID + "<br>";
                    statistics += "Largest QID group: " + largestQID + "<br>";
                    statistics += this.buildCanvas("qidsize");
                    statistics += "Table is: " + smallestQID + "-anonymous<br>";
                    this.charts.push({
                        elementId: "qidsize",
                        dataMap: frequencyMap,
                        xLabel: 'QID group size',
                        yLabel: 'Occurrences',
                        title: 'Distribution of QID groups'
                    });
                    for (var value in frequencyMap) {
                        statistics += "There are " + frequencyMap[value] + " QID groups that represent " + value + " different persons.<br>";
                    }
                    break;
                case "xy":
                    var xy = this.getXYStatistics(qidColumns, idColumns);
                    statistics += "Smallest QID group: " + xy.smallest + "<br>";
                    statistics += "Largest QID group: " + xy.largest + "<br>";
                    statistics += this.buildCanvas("qidid");
                    this.charts.push({
                        elementId: "qidid",
                        dataMap: xy.map,
                        xLabel: 'Unique persons in QID group',
                        yLabel: 'Num groups',
                        title: 'Number of unique persons represented by QID group'
                    });
                    for (var value in xy.map) {
                        statistics += "There are " + xy.map[value] + " QID groups that represent " + value + " different persons.<br>";
                    }
                    break;
                case "ldiv":
                    debugger;
                    var ldiv = this.getXYStatistics(qidColumns, sensitiveColumns);
                    statistics += "QID group(s) that has the least amount of unique sensitive attribute values contains: " + ldiv.smallest + " different sensitive attribute values<br>";
                    statistics += "QID group(s) that has the largest amount of unique sensitive attribute values contains: " + ldiv.largest + " different sensitive attribute values<br>";
                    statistics += this.buildCanvas("qidsens");
                    highlightData["fails"] = this.filterSetMap(ldiv.rawMap);
                    this.charts.push({
                        elementId: "qidsens",
                        dataMap: ldiv.map,
                        xLabel: 'Unique sensitive attributes in QID group',
                        yLabel: 'Num groups',
                        title: 'Number of unique persons represented by QID group'
                    });
                    for (var value in ldiv.map) {
                        statistics += "There are " + ldiv.map[value] + " QID groups that represent " + value + " different values.<br>";
                    }
                    break;
                case "tc":
                    highlightData = this.getDistributionsSimilarity(this.app.anonymizedSchemaFull, qidColumns, sensitiveColumns);
                    var numFails = Object.keys(highlightData["fails"]).length;
                    statistics += "Total QID groups: " + highlightData["total"] + "<br>";
                    statistics += "QID groups that have similar distribution to table: " + (highlightData["total"] - numFails) + "<br>";
                    statistics += "QID groups that have different distribution from table: " + numFails + "<br>";
                    var tableDistributionMap = this.getTableFrequencyMap(this.app.anonymizedSchemaFull, sensitiveColumns[0]);
                    statistics += this.buildCanvas("table-distribution");
                    this.charts.push({
                        elementId: "table-distribution",
                        dataMap: tableDistributionMap,
                        xLabel: 'Sensitive attribute',
                        yLabel: 'Occurrences %',
                        title: 'Distribution of sensitive attributes'
                    });
                    for (var value in tableDistributionMap) {
                        statistics += (tableDistributionMap[value] * 100) + " % of sensitive attribute values are " + value + " .<br>";
                    }
                    break;
                default:
                    break;
            }
        }
        return {
            "statistics": statistics,
            "highlightData": highlightData
        };
    };
    Statistics.prototype.qidMapToFrequencyMap = function (qidMap) {
        var frequencyMap = {};
        for (var key in qidMap) {
            this.incrementMapCounter(frequencyMap, qidMap[key]);
        }
        return frequencyMap;
    };
    Statistics.prototype.qidIdSetToSizeMap = function (qidIdSet) {
        var sizeMap = {};
        for (var key in qidIdSet) {
            this.incrementMapCounter(sizeMap, qidIdSet[key].size);
        }
        return sizeMap;
    };
    Statistics.prototype.drawChart = function (drawInfo) {
        var barLabels = [];
        var barValues = [];
        for (var value in drawInfo.dataMap) {
            barLabels.push(value);
            barValues.push(drawInfo.dataMap[value]);
        }
        var barChartData = {
            labels: barLabels,
            datasets: [{
                    fillColor: "rgba(0,60,100,1)",
                    strokeColor: "black",
                    data: barValues
                }]
        };
        var ctx = document.getElementById(drawInfo.elementId).getContext("2d");
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: barLabels,
                datasets: [{
                        data: barValues,
                        backgroundColor: "#0095FF"
                    }]
            },
            options: {
                scales: {
                    yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: drawInfo.yLabel
                            },
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                    xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: drawInfo.xLabel
                            }
                        }]
                },
                title: {
                    display: true,
                    text: drawInfo.title
                }
            }
        });
    };
    return Statistics;
}());
module.exports = Statistics;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var Statistics = __webpack_require__(0);
var Anonymization = (function () {
    function Anonymization(app) {
        this.app = app;
    }
    Anonymization.prototype.randInt = function (min, max) {
        return Math.floor((Math.random() * max) + min);
    };
    Anonymization.prototype.randNoise = function (cell) {
        return this.randInt(cell * 0.9, cell * 1.1);
    };
    Anonymization.prototype.anonymizeCell = function (cell, rule) {
        switch (rule.action) {
            case "keep":
                return cell;
            case "remove":
                return cell;
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
                $("#suppression").show();
                break;
            case "noise":
                return this.randNoise(cell);
                break;
            default:
                break;
        }
    };
    Anonymization.prototype.getPreservedColumns = function () {
        var columns = [];
        for (var column in this.app.attributeActions) {
            if (this.app.attributeActions[column]["action"] != "remove") {
                columns.push(column);
            }
        }
        return columns;
    };
    Anonymization.prototype.generateIdentificators = function (table, idColumns) {
        var remember = {};
        var counter = 0;
        var statistics = new Statistics();
        for (var row in table) {
            var currentIdColumns = statistics.getRowColumns(table[row], idColumns);
            var currentIdColumnsStr = JSON.stringify(currentIdColumns);
            if (remember[currentIdColumnsStr] == undefined) {
                remember[currentIdColumnsStr] = ++counter;
            }
            //jQuery.extend(true, {"id": remember[currentIdColumnsStr]}, statistics.getRowColumnsNot(row, idColumns));
            table[row] = jQuery.extend(true, { "_id": remember[currentIdColumnsStr] }, table[row]);
        }
    };
    Anonymization.prototype.anonymizeData = function () {
        this.app.workingSchema = jQuery.extend(true, {}, this.app.schema);
        var id_cols = this.app.getColumnNamesByType("id");
        var qid_cols = this.app.getColumnNamesByType("qid");
        var resultTable = [];
        var statistics = new Statistics(this.app);
        for (var i = 0; i < this.app.schema.length; i++) {
            var obj = this.app.schema[i];
            var row = {};
            for (var key in obj) {
                var actionData = this.app.attributeActions[key];
                //if (actionData.action != "remove") {
                row[key] = this.anonymizeCell(obj[key], actionData);
            }
            resultTable.push(row);
        }
        this.generateIdentificators(resultTable, id_cols);
        var preservedColumns = this.getPreservedColumns();
        if (id_cols.length > 0) {
            preservedColumns.unshift("_id");
        }
        var subSet = statistics.selectColumns(resultTable, preservedColumns);
        this.app.anonymizedSchema = subSet;
        this.app.anonymizedSchemaFull = resultTable;
        var tableKeys = Object.keys(this.app.anonymizedSchema[0]);
        var qid_ids = [];
        for (i in tableKeys) {
            if (qid_cols.indexOf(tableKeys[i]) > -1) {
                qid_ids.push({
                    "name": tableKeys[i],
                    "values": this.app.getUniqueValueByColumn(tableKeys[i], this.app.anonymizedSchema).length,
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
        var statistics = new Statistics(this.app);
        var statisticsData = statistics.build();
        $("#finished_table").html(app.jsonToTable(this.app.anonymizedSchema, -1, [], "myTable", statisticsData.highlightData));
        $("#export_schema").prop("disabled", false);
        $("#myTable").tablesorter({ sortList: final_sort });
        $("#statistics").html(statisticsData.statistics);
        for (var _a = 0, _b = statistics.charts; _a < _b.length; _a++) {
            var chart = _b[_a];
            statistics.drawChart(chart);
        }
    };
    return Anonymization;
}());
module.exports = Anonymization;


/***/ },
/* 2 */
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
        this.anonymizedSchema = {};
        this.anonymizedSchemaFull = {};
    }
    Application.prototype.downloadResult = function () {
        var csv = app.jsonToCSV(this.anonymizedSchema);
        var downloadLink = $("#result_download");
        downloadLink.attr("href", "data:text/plain," + encodeURIComponent(csv));
        downloadLink[0].click();
    };
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
    Application.prototype.unique = function (arr) {
        var u = {};
        var a = [];
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var element = arr_1[_i];
            if (!u.hasOwnProperty(element)) {
                a.push(element);
                u[element] = 1;
            }
        }
        return a;
    };
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
        return this.unique(this.getValuesByColumn(columnName, schema));
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
    Application.prototype.getColumnNames = function () {
        var columns = [];
        for (var c in this.attributeTypes) {
            columns.push(c);
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
/* 3 */
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
    WindowManager.prototype.setWindowTitle = function () {
    };
    return WindowManager;
}());
module.exports = WindowManager;


/***/ },
/* 4 */
/***/ function(module, exports) {

"use strict";
"use strict";
var ActionDialog = (function () {
    function ActionDialog(app, winMgr) {
        this.specificationEnded = false;
        this.startOver = true;
        this.app = app;
        this.winMgr = winMgr;
    }
    ActionDialog.prototype.buildActionsCombo = function (name) {
        var additiveNoise = this.app.method == "edif" ? '<option value="noise">Add noise</option>' : '';
        return '<select class="action_select" name="' + name + '">' +
            '   <option value="keep">Keep as is</option>' +
            '   <option value="remove">Remove column</option>' +
            '   <option value="generalize">Generalize</option>' +
            //'   <option value="suppress">Suppress</option>' +
            additiveNoise +
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
        var identifiers = this.app.getColumnNamesByType("sensitive");
        for (var i in identifiers) {
            console.log(identifiers[i]);
            var element = $('select[class="action_select"][name="' + identifiers[i] + '"]');
            element.prop("disabled", true);
            if (this.app.method == "edif") {
                element.val("noise");
                element.prop("title", "ϵ-Differential privacy is achieved by adding random noise to variable.");
            }
            else {
                element.val("keep");
                element.prop("title", "Sensitive attributes are not generalized");
            }
        }
    };
    ActionDialog.prototype.init = function (startOver) {
        this.app.typeDialog.startOver = false;
        if (startOver) {
            this.app.attributeActions = {};
            var htmlContent = '';
            htmlContent += this.buildActionsTable(this.app.schema);
            $("#action_list").html(htmlContent);
        }
        $("#actions").show();
        this.preselectActions();
        this.startOver = false;
    };
    ActionDialog.prototype.defineRules = function (action, columnName) {
        var columName = columnName;
        this.specificationEnded = false;
        switch (action.action) {
            case "noise":
            case "keep":
            case "remove":
                this.specificationEnded = true;
                this.app.attributeActions[columnName].defined = true;
                this.defineNextRule();
                break;
            case "generalize":
                this.app.generalizationDialog.init(columName);
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
    ActionDialog.prototype.backClicked = function () {
        this.winMgr.closeWindow("actions");
        this.app.typeDialog.startOver = false;
        $("#types").show();
    };
    ActionDialog.prototype.nextClicked = function () {
        console.log("sadfsd");
        for (var _i = 0, _a = $('select[class="action_select"]'); _i < _a.length; _i++) {
            var element = _a[_i];
            var colName = $(element).attr('name');
            var jsonVariable = {};
            if (this.app.attributeActions[colName] == undefined
                || (this.app.attributeActions[colName] != undefined && this.app.attributeActions[colName].action != $(element).val())) {
                jsonVariable["action"] = $(element).val();
                jsonVariable["defined"] = false;
                this.app.attributeActions[colName] = jsonVariable;
            }
        }
        //if(this.app.generalizationDialog.definingInProgress && !this.startOver){
        if (this.app.generalizationDialog.definingInProgress) {
            var firstColumn = this.getFirstGeneralizeColumn();
            if (firstColumn == "") {
                this.app.anonymizer.anonymizeData();
            }
            else {
                this.app.generalizationDialog.init(firstColumn);
            }
        }
        else {
            this.defineNextRule();
        }
        this.winMgr.closeWindow('actions');
        console.log(this.app.attributeActions);
        console.log("defining done");
    };
    ActionDialog.prototype.getFirstGeneralizeColumn = function () {
        var columns = this.app.getColumnNames();
        var next = 0;
        while (next < columns.length - 1) {
            var nextValue = columns[next];
            if (this.app.attributeActions[nextValue].action == "generalize") {
                return nextValue;
            }
            next++;
        }
        return "";
    };
    return ActionDialog;
}());
module.exports = ActionDialog;


/***/ },
/* 5 */
/***/ function(module, exports) {

"use strict";
"use strict";
var GeneralizationDialog = (function () {
    function GeneralizationDialog(app, winMgr) {
        this.isNum = true;
        this.currentColumn = "";
        this.currentColumnId = -1;
        this.lastDefinedColumn = "";
        this.lastDefinedColumnId = -1;
        this.definingInProgress = false;
        this.app = app;
        this.winMgr = winMgr;
    }
    GeneralizationDialog.prototype.updateLastDefinedColumn = function (column) {
        var columns = this.app.getColumnNames();
        if (columns.indexOf(column) > columns.indexOf(this.lastDefinedColumn)) {
            this.lastDefinedColumn = column;
            this.lastDefinedColumnId = columns.indexOf(column);
        }
        this.currentColumnId = columns.indexOf(column);
    };
    GeneralizationDialog.prototype.renderView = function (columnName) {
        if (this.app.attributeActions[columnName].defined) {
            if (this.app.attributeActions[columnName].mode == "interval") {
                $("#interval_size").val(this.app.attributeActions[columnName]["operation"]);
                this.intervalSizeChanged();
            }
            else {
                var actionDict = {};
                var ruleData = "";
                for (var k in this.app.attributeActions[columnName]["operation"]) {
                    if (actionDict[this.app.attributeActions[columnName]["operation"][k]] == undefined) {
                        actionDict[this.app.attributeActions[columnName]["operation"][k]] = [k];
                    }
                    else {
                        actionDict[this.app.attributeActions[columnName]["operation"][k]].push(k);
                    }
                }
                for (var k in actionDict) {
                    ruleData += actionDict[k].join();
                    ruleData += "->" + k + "\n";
                }
                $("#rules").val(ruleData);
            }
        }
    };
    GeneralizationDialog.prototype.init = function (columnName) {
        this.isNum = true;
        this.definingInProgress = true;
        this.currentColumn = columnName;
        var cells = this.app.getUniqueValueByColumn(columnName);
        var elements = "";
        $("#value_pool").html("");
        for (var i in cells) {
            elements += '<span class="word" onclick="app.generalizationDlg.addWord(this);">' + cells[i] + '</span>';
            if (!$.isNumeric(cells[i])) {
                this.isNum = false;
            }
        }
        if (this.isNum) {
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
        this.renderView(columnName);
        this.updateLastDefinedColumn(columnName);
        $("#generalization").show();
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
        this.intervalSizeChanged();
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
    GeneralizationDialog.prototype.isValidInterval = function (str) {
        var integerValue = Math.floor(Number(str));
        if (String(integerValue) == str) {
            if (integerValue == 0) {
                alert("Error: Interval with size of 0 is not usable for generalization.");
                return false;
            }
            return true;
        }
        return false;
    };
    GeneralizationDialog.prototype.intervalSizeChanged = function () {
        if (this.app.attributeActions[this.currentColumn].mode == "interval") {
            var inputValue = $("#interval_size").val();
            if (this.isValidInterval(inputValue)) {
                $("#generalization_next").prop("disabled", false);
            }
            else {
                $("#generalization_next").prop("disabled", true);
            }
        }
    };
    GeneralizationDialog.prototype.saveFormData = function () {
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
    };
    GeneralizationDialog.prototype.getPreviousColumn = function () {
        var columns = this.app.getColumnNames();
        var previous = columns.indexOf(this.currentColumn) - 1;
        while (previous > -1) {
            var previousValue = columns[previous];
            if (this.app.attributeActions[previousValue].action == "generalize") {
                return previousValue;
            }
            previous--;
        }
        return "";
    };
    GeneralizationDialog.prototype.getNextColumn = function () {
        var columns = this.app.getColumnNames();
        var next = columns.indexOf(this.currentColumn) + 1;
        while (next < columns.length - 1) {
            var nextValue = columns[next];
            if (this.app.attributeActions[nextValue].action == "generalize") {
                return nextValue;
            }
            next++;
        }
        return "";
    };
    GeneralizationDialog.prototype.backClicked = function () {
        this.app.attributeActions[this.currentColumn].defined = true;
        this.saveFormData();
        var previousColumn = this.getPreviousColumn();
        if (previousColumn == "") {
            this.winMgr.closeWindow("generalization");
            $("#actions").show();
        }
        else {
            this.init(previousColumn);
        }
    };
    GeneralizationDialog.prototype.nextClicked = function () {
        this.saveFormData();
        this.winMgr.closeWindow("generalization");
        this.app.attributeActions[this.currentColumn].defined = true;
        if (this.currentColumnId >= this.lastDefinedColumnId) {
            this.definingInProgress = false;
            this.app.actionDialog.defineNextRule();
        }
        else {
            this.init(this.getNextColumn());
        }
    };
    return GeneralizationDialog;
}());
module.exports = GeneralizationDialog;


/***/ },
/* 6 */
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
        this.startOver = true;
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
    JoinDialog.prototype.finishRuleVisuals = function () {
        var joinButton = $("#new_join_rule");
        var ruleKeys = Object.keys(this.joinRules);
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
    };
    JoinDialog.prototype.finishRule = function () {
        this.finishRuleVisuals();
        this.defineRules = false;
        var ruleKeys = Object.keys(this.joinRules);
        var joinRule = new JoinRule(this.joinRules[ruleKeys[0]], "=", this.joinRules[ruleKeys[1]]);
        this.joinRulesList.push(joinRule);
        var htmlContent = '<code class="window_container"><span class="rule">' + joinRule.toString() + '</span><img class="icon24 window_container_remove" src="./public/icons/delete.png" title="Remove rule" onclick="app.joinDlg.removeRule(this)"></code>';
        $("#join_rules").append(htmlContent);
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
        this.app.typeDialog.init("merged", this.startOver);
    };
    JoinDialog.prototype.backClicked = function () {
        this.winMgr.closeWindow("join");
        this.app.openDialog.startOver = false;
        $("#open").show();
    };
    JoinDialog.prototype.init = function (selectedTables, startOver) {
        if (selectedTables.length == 1) {
            console.log("skip to column types");
            this.app.schema = this.app.getSchema(selectedTables[0]);
            this.app.typeDialog.init(selectedTables[0], startOver);
            return;
        }
        if (startOver) {
            var htmlContent = '';
            this.schemasJSON = {};
            this.defineRules = false;
            this.joinRules = {};
            this.joinRulesList = [];
            this.tableNames = [];
            this.lastJoinResult = [];
            this.tableNames = selectedTables;
            console.log("init join");
            if (selectedTables.length == 0) {
                console.error("none");
                return;
            }
            else if (selectedTables.length == 1) {
                console.log("skip to column types");
                this.app.schema = this.app.getSchema(selectedTables[0]);
                this.app.typeDialog.init(selectedTables[0], startOver);
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
            $("#new_join_rule").prop("disabled", false);
            $("#schema_list").html(htmlContent);
            $('#schema_list .preview_table th').css("color", "#555");
            $("#joinNext").prop("disabled", true);
            $("#join_rules").html("");
            this.showResult();
            this.finishRuleVisuals();
        }
        $("#join").show();
        this.startOver = false;
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
        this.startOver = true;
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
/* 7 */
/***/ function(module, exports) {

"use strict";
"use strict";
var OpenDialog = (function () {
    function OpenDialog(app, winMgr) {
        this.startOver = true;
        this.app = app;
        this.winMgr = winMgr;
    }
    OpenDialog.prototype.init = function () {
        this.startOver = true;
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
        $(".method").html($("#anonymization_method option:selected").text());
        this.winMgr.closeWindow('open');
        this.app.joinDialog.init(selected, this.startOver);
    };
    OpenDialog.prototype.methodChanged = function () {
        this.startOver = true;
        if ($("#anonymization_method").val() == "none") {
            $("#open_next").prop("disabled", true);
        }
        else {
            $("#open_next").prop("disabled", false);
        }
    };
    OpenDialog.prototype.checkboxesChanged = function () {
        this.startOver = true;
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
/* 8 */
/***/ function(module, exports) {

"use strict";
"use strict";
var TypeDialog = (function () {
    function TypeDialog(app, winMgr) {
        this.startOver = true;
        this.app = app;
        this.winMgr = winMgr;
    }
    TypeDialog.prototype.buildCombo = function (name) {
        return '<select  onchange="app.typeDlg.typeChanged();" class="type_select" name="' + name + '">' +
            '   <option value="none">Not Defined</option>' +
            '   <option value="id">ID</option>' +
            '   <option value="qid">QID</option>' +
            '   <option value="sensitive">Sensitive</option>' +
            '   <option value="nonsensitive">Nonsensitive</option>' +
            '</select>';
    };
    TypeDialog.prototype.validateTypes = function () {
        var senitiveColumns = 0;
        for (var _i = 0, _a = $('select[class="type_select"]'); _i < _a.length; _i++) {
            var element = _a[_i];
            var columnName = $(element).attr('name');
            var columnType = $(element).val();
            if (columnType == "sensitive") {
                senitiveColumns++;
                if (senitiveColumns > 1) {
                    alert("Privacy preserving methods implemented in this program are designed to support only one " +
                        "sensitive attribute. You have chosen " + senitiveColumns + " columns. Please cange your " +
                        "choices before you continue.");
                    return false;
                }
            }
            if (this.app.method == "edif" && columnType == "sensitive") {
                var cells = this.app.getUniqueValueByColumn(columnName);
                for (var i in cells) {
                    if (!$.isNumeric(cells[i])) {
                        alert("In ϵ-Differential privacy sensitive attributes can only have numerical values." +
                            " Please choose some other column to be sensitive.");
                        return false;
                    }
                }
            }
        }
        return true;
    };
    TypeDialog.prototype.typeChanged = function () {
        if (this.validateTypes()) {
            $("#typesNext").prop("disabled", false);
        }
        else {
            $("#typesNext").prop("disabled", true);
        }
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
    TypeDialog.prototype.init = function (selectedTable, startOver) {
        this.startOver = startOver;
        if (startOver) {
            this.app.schemaName = selectedTable;
            var schemasJSON = "";
            var htmlContent = '';
            htmlContent += this.buildTableTypes(this.app.schema);
            $("#type_list").html(htmlContent);
        }
        this.typeChanged();
        $("#types").show();
    };
    TypeDialog.prototype.backClicked = function () {
        this.winMgr.closeWindow("types");
        if (this.app.method == "multir") {
            this.app.joinDialog.startOver = false;
            $("#join").show();
        }
        else {
            this.app.openDialog.startOver = false;
            $("#open").show();
        }
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
        app.actionDlg.init(this.startOver);
    };
    return TypeDialog;
}());
module.exports = TypeDialog;


/***/ },
/* 9 */
/***/ function(module, exports) {

"use strict";
"use strict";
var UploadDialog = (function () {
    function UploadDialog(app, winMgr) {
        this.app = app;
        this.winMgr = winMgr;
    }
    UploadDialog.prototype.init = function () {
        $("#upload").show();
    };
    UploadDialog.prototype.nextClicked = function () {
        this.winMgr.closeWindow('upload');
    };
    return UploadDialog;
}());
module.exports = UploadDialog;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by rain on 11.02.17.
 */
"use strict";
var WindowManager = __webpack_require__(3);
var GeneralizationDialog = __webpack_require__(5);
var Application = __webpack_require__(2);
var OpenDialog = __webpack_require__(7);
var JoinDialog = __webpack_require__(6);
var TypeDialog = __webpack_require__(8);
var ActionDialog = __webpack_require__(4);
var Anonymization = __webpack_require__(1);
var UploadDialog = __webpack_require__(9);
var Statistics = __webpack_require__(0);
var Main = (function () {
    function Main() {
        this.winMgr = new WindowManager();
        this.app = new Application();
        this.openDlg = new OpenDialog(this.app, this.winMgr);
        this.uploadDlg = new UploadDialog(this.app, this.winMgr);
        this.joinDlg = new JoinDialog(this.app, this.winMgr);
        this.typeDlg = new TypeDialog(this.app, this.winMgr);
        this.actionDlg = new ActionDialog(this.app, this.winMgr);
        this.generalizationDlg = new GeneralizationDialog(this.app, this.winMgr);
        this.anonymizer = new Anonymization(this.app);
        this.statistics = new Statistics(this.app);
    }
    Main.prototype.init = function () {
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
    };
    Main.prototype.getHighlightClass = function (row, highlightData, qidColumns, sensitiveColumns) {
        var highlightClass = "normal";
        if (Object.keys(highlightData).length == 0) {
            return highlightClass;
        }
        //debugger;
        if (this.app.method == "tc" || this.app.method == "ldiv") {
            var qidData = this.statistics.getRowColumns(row, qidColumns);
            var sensitiveData = this.statistics.getRowColumns(row, sensitiveColumns);
            for (var key in highlightData["fails"]) {
                if (JSON.stringify(qidData) == key) {
                    highlightClass = "warn-group";
                    if (this.app.method == "tc" && highlightData["fails"][key].indexOf(sensitiveData[sensitiveColumns[0]]) > -1) {
                        highlightClass = "warn-row";
                    }
                }
            }
        }
        return highlightClass;
    };
    Main.prototype.jsonToTable = function (jsonData, maxLength, highlight, id, highlightData) {
        if (maxLength === void 0) { maxLength = -1; }
        if (highlight === void 0) { highlight = []; }
        if (id === void 0) { id = ""; }
        if (highlightData === void 0) { highlightData = {}; }
        var qidColumns = this.app.getColumnNamesByType("qid");
        var sensitiveColumns = this.app.getColumnNamesByType("sensitive");
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
            table += '<tr class="' + this.getHighlightClass(row, highlightData, qidColumns, sensitiveColumns) + '">';
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
    Main.prototype.jsonToCSV = function (jsonData) {
        var table = '';
        for (var _i = 0, _a = Object.keys(jsonData[0]); _i < _a.length; _i++) {
            var key = _a[_i];
            table += key + ",";
        }
        table = table.slice(0, -1);
        table += "\n";
        for (var _b = 0, jsonData_2 = jsonData; _b < jsonData_2.length; _b++) {
            var row = jsonData_2[_b];
            for (var cell in row) {
                table += row[cell] + ",";
            }
            table = table.slice(0, -1);
            table += "\n";
        }
        return table;
    };
    return Main;
}());
window.app = new Main();
window.statistics = new Statistics();
console.log("I am alive");


/***/ }
/******/ ]);