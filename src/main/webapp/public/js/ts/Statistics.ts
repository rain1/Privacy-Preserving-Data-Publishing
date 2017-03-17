import Application = require("./Application");
class Statistics {
    app:Application;
    charts = [];

    constructor(app:Application) {
        Chart.defaults.global.legend.display = false;
        this.app = app;
    }

    pushId(qidMap, qid:string, id:string) {
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
        for(let key in Object.keys(row)) {
            if(columns.indexOf(row[key]) == -1){
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

    getQIDIDMap(qidColumns:string[], idColumns:string[]) {
        var qidIdMap = {};
        for (let row of this.app.anonymizedSchemaFull) {
            var qid = this.getRowColumns(row, qidColumns);
            var id = this.getRowColumns(row, idColumns);
            this.pushId(qidIdMap, JSON.stringify(qid), JSON.stringify(id));
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

    build() {
        var statistics = "<b>Statistics:</b><br>";
        var qidColumns = this.app.getColumnNamesByType("qid");
        var idColumns = this.app.getColumnNamesByType("id");
        var qidMap = this.getQIDSizeMap(qidColumns);
        var frequencyMap = this.qidMapToFrequencyMap(qidMap);
        var smallestQID = this.findSmallestMapValue(qidMap);
        var largestQID = this.findLargestMapValue(qidMap);
        var qidIdSet = this.getQIDIDMap(qidColumns, idColumns);
        var qidIdSetSizeMap = this.qidIdSetToSizeMap(qidIdSet);
        var smallestQIDXY = this.findSmallestMapKey(qidIdSetSizeMap);
        var largestQIDXY = this.findLargestMapKey(qidIdSetSizeMap);
        debugger;
        if (qidColumns.length == 0) {
            statistics += "Warning: QID not defined<br>";
        } else {
            statistics += "Unique QIDs: " + Object.keys(qidMap).length + "<br>";
            switch (this.app.method) {
                case "kanonymity":
                case "multir":
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
                        statistics += "There are " + frequencyMap[value] + " QID groups that represent " + value + " different persons<br>";
                    }
                    break;
                case "xy":
                    statistics += "Smallest QID group: " + smallestQIDXY + "<br>";
                    statistics += "Largest QID group: " + largestQIDXY + "<br>";
                    statistics += this.buildCanvas("qidid");
                    this.charts.push({
                        elementId: "qidid",
                        dataMap: qidIdSetSizeMap,
                        xLabel: 'Unique persons in QID group',
                        yLabel: 'Num groups',
                        title: 'Number of unique persons represented by QID group'

                    });
                    for (let value in qidIdSetSizeMap) {
                        statistics += "There are " + qidIdSetSizeMap[value] + " QID groups that represent " + value + " different persons<br>";
                    }
                    break;
                default:
                    break;
            }
        }
        return statistics;
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