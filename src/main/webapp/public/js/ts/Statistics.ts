import Application = require("./Application");
class Statistics {
    app:Application;
    charts = [];

    constructor(app:Application) {
        Chart.defaults.global.legend.display = false;
        this.app = app;
    }

    pushElement(qidMap, qid:string, element:string) {
        if (qidMap[qid] == undefined) {
            qidMap[qid] = [element];
        } else {
            qidMap[qid].push(element);
        }
    }

    addId(qidMap, qid:string, id:string) {
        if (qidMap[qid] == undefined) {
            qidMap[qid] = new Set([id]);
        } else {
            qidMap[qid].add(id);
        }
    }

    incrementMapCounter(qidMap, key:string) {
        if (qidMap[key] == undefined) {
            qidMap[key] = 1;
        } else {
            qidMap[key] += 1;
        }
    }

    getRowColumns(row, columns:string[]) {
        var selected = {};
        for (let column of columns) {
            selected[column] = row[column];
        }
        return selected;
    }

    getRowColumnsNot(row, columns:string[]) {
        var selected = {};
        for (let key in Object.keys(row)) {
            if (columns.indexOf(row[key]) == -1) {
                selected[key] = row[key];
            }
        }
        return selected;
    }

    selectColumns(table, columns:string[]) {
        var resultTable = [];
        for (let row of table) {
            resultTable.push(this.getRowColumns(row, columns));
        }
        return resultTable;
    }

    getQIDSizeMap(qidColumns:string[]) {
        var qidMap = {};
        for (let row of this.app.anonymizedSchema) {
            var qid = this.getRowColumns(row, qidColumns);
            this.incrementMapCounter(qidMap, JSON.stringify(qid));
        }
        return qidMap;
    }

    xyMap(qidColumns:string[], idColumns:string[]) {
        var qidIdMap = {};
        for (let row of this.app.anonymizedSchemaFull) {
            var qid = this.getRowColumns(row, qidColumns);
            var id = this.getRowColumns(row, idColumns);
            this.addId(qidIdMap, JSON.stringify(qid), JSON.stringify(id));
        }
        return qidIdMap;
    }

    max(list) {
        var maximum = -Infinity;
        for (let element of list) {
            if (element > maximum) {
                maximum = element;
            }
        }
        return maximum;
    }

    min(list) {
        var minimum = +Infinity;
        for (let element of list) {
            if (element < minimum) {
                minimum = element;
            }
        }
        return minimum;
    }

    findLargestMapValue(qidMap) {
        var valueList = Object.values(qidMap);
        return this.max(valueList);
    }

    findSmallestMapValue(qidMap) {
        var valueList = Object.values(qidMap);
        return this.min(valueList);
    }

    findLargestMapKey(qidMap) {
        var keyList = Object.keys(qidMap).map(x=>parseInt(x));
        return this.max(keyList);
    }

    findSmallestMapKey(qidMap) {
        var keyList = Object.keys(qidMap).map(x=>parseInt(x));
        return this.min(keyList);
    }

    buildCanvas(id:string) {
        return '<div class="canvas_container"><canvas id="' + id + '"></canvas></div>';
    }

    getXYStatistics(qidColumns:string[], correspondingColumns:string[]) {
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
    }

    frequencyMapToRelative(distributionMap, numElements) {
        for (let key in distributionMap) {
            distributionMap[key] = distributionMap[key] / numElements;
        }
    }

    getTableFrequencyMap(table, sensitiveColumn:string) {
        var distributionMap = {};
        var numElements = table.length;
        for (let row of table) {
            this.incrementMapCounter(distributionMap, row[sensitiveColumn]);
        }
        this.frequencyMapToRelative(distributionMap, numElements);
        return distributionMap;
    }

    getGroupFrequencyMap(values:any[]) {
        var distributionMap = {};
        var numElements = values.length;
        for (let value of values) {
            this.incrementMapCounter(distributionMap, value);
        }
        this.frequencyMapToRelative(distributionMap, numElements);
        return distributionMap;
    }

    getDistributionsSimilarity(table, qidColumns:string[], sensitiveColumns:string[]) {
        var sensitiveColumn = sensitiveColumns[0];
        var tableDistributionMap = this.getTableFrequencyMap(table, sensitiveColumn);
        var qidSensitiveMap = {};
        for (let row of table) {
            var qid = this.getRowColumns(row, qidColumns);
            var sensitive = this.getRowColumns(row, [sensitiveColumn]);
            this.pushElement(qidSensitiveMap, JSON.stringify(qid), sensitive[sensitiveColumns[0]]);
        }

        var qidFrequencies = {};
        for (let key in qidSensitiveMap) {
            qidFrequencies[key] = this.getGroupFrequencyMap(qidSensitiveMap[key]);
        }

        var qidFails = {};
        for (let qidKey in qidFrequencies) {
            for (let sensitiveKey in qidFrequencies[qidKey]) {
                if (Math.abs(qidFrequencies[qidKey][sensitiveKey] - tableDistributionMap[sensitiveKey]) > 0.1) {
                    this.pushElement(qidFails, qidKey, sensitiveKey);
                }
            }
        }

        return {
            total: Object.keys(qidFrequencies).length,
            fails: qidFails
        }
    }

    filterSetMap(qidIdMap) {
        var setMap = {};
        for (let key in qidIdMap) {
            var element = qidIdMap[key];
            if (element.size == 1) {
                setMap[key] = {};
            }
        }
        return setMap;
    }

    build() {
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
        } else {
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
                    for (let value in frequencyMap) {
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
                    for (let value in xy.map) {
                        statistics += "There are " + xy.map[value] + " QID groups that represent " + value + " different persons.<br>";
                    }
                    break;
                case "ldiv":
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
                    for (let value in ldiv.map) {
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
                    for (let value in tableDistributionMap) {
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
        }
    }

    qidMapToFrequencyMap(qidMap) {
        var frequencyMap = {};
        for (let key in qidMap) {
            this.incrementMapCounter(frequencyMap, qidMap[key]);
        }
        return frequencyMap;
    }

    qidIdSetToSizeMap(qidIdSet) {
        var sizeMap = {};
        for (let key in qidIdSet) {
            this.incrementMapCounter(sizeMap, qidIdSet[key].size);
        }
        return sizeMap;
    }

    drawChart(drawInfo) {
        var barLabels = [];
        var barValues = [];

        for (let value in drawInfo.dataMap) {
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
                    backgroundColor: "#0095FF",
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
    }

}
export = Statistics;