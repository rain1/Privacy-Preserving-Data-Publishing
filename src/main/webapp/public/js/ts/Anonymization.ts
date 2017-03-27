import Application = require("./Application");
import Statistics = require("./Statistics");
class Anonymization {

    app:Application;

    constructor(app:Application) {
        this.app = app;
    }

    randInt(min, max){
        return Math.floor((Math.random() * max) + min);
    }

    randNoise(cell){
        return this.randInt(cell*0.9, cell*1.1);
    }


    anonymizeCell(cell, rule) {
        switch (rule.action) {
            case "keep":
                return cell;
            case "remove":
                return cell;
                break;
            case "generalize":
                if (rule.mode == "interval") {
                    var result = cell / rule.operation;
                    return "[" + Math.floor(result) * rule.operation + ", " + (Math.floor(result) + 1) * rule.operation + ")"
                } else {
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
    }

    getPreservedColumns(){
        var columns = [];
        for(let column in this.app.attributeActions){
            if(this.app.attributeActions[column]["action"] != "remove"){
                columns.push(column);
            }
        }
        return columns;
    }

    generateIdentificators(table, idColumns: string[]){
        var remember = {};
        var counter = 0;
        var statistics = new Statistics();
        for(let row in table){
            var currentIdColumns = statistics.getRowColumns(table[row], idColumns);
            var currentIdColumnsStr = JSON.stringify(currentIdColumns);
            if(remember[currentIdColumnsStr] == undefined){
                remember[currentIdColumnsStr] = ++counter;
            }
            //jQuery.extend(true, {"id": remember[currentIdColumnsStr]}, statistics.getRowColumnsNot(row, idColumns));
            table[row] = jQuery.extend(true, {"_id": remember[currentIdColumnsStr]}, table[row]);
        }


    }

    anonymizeData() {
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
                    //console.log(key, obj[key], actionData);
                //}
            }
            resultTable.push(row);
        }

        this.generateIdentificators(resultTable, id_cols);

        var preservedColumns =  this.getPreservedColumns();
        if(id_cols.length > 0){
            preservedColumns.unshift("_id");
        }
        var subSet = statistics.selectColumns(resultTable,preservedColumns);
        this.app.anonymizedSchema = subSet;
        this.app.anonymizedSchemaFull = resultTable;

        var tableKeys = Object.keys(this.app.anonymizedSchema[0]);
        var qid_ids = [];
        for (i in tableKeys) {
            if (qid_cols.indexOf(tableKeys[i]) > -1) {
                qid_ids.push({
                    "name":tableKeys[i],
                    "values": this.app.getUniqueValueByColumn(tableKeys[i], this.app.anonymizedSchema).length,
                    'id': i
                });
            }
        }

        qid_ids.sort(function(a, b) {
            return parseFloat(a.values) - parseFloat(b.values);
        });

        var final_sort = [];
        for(let sortToken of qid_ids){
            final_sort.push([sortToken.id ,0]);
        }

        var statistics = new Statistics(this.app);
        var statisticsData = statistics.build();

        $("#finished_table").html(app.jsonToTable(this.app.anonymizedSchema, -1, [], "myTable", statisticsData.highlightData));
        $("#export_schema").prop("disabled", false);
        $("#myTable").tablesorter({sortList: final_sort});
        $("#statistics").html(statisticsData.statistics);
        for(let chart of statistics.charts){
            statistics.drawChart(chart);
        }
    }

}

export = Anonymization;