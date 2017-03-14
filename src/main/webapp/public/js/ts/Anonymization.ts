import Application = require("./Application");
import Statistics = require("./Statistics");
class Anonymization {

    app:Application;

    constructor(app:Application) {
        this.app = app;
    }


    anonymizeCell(cell, rule) {
        switch (rule.action) {
            case "keep":
                return cell;
            case "remove":
                //specificationEnded = true;
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
                //setupSuppression(columName);
                $("#suppression").show();
                break;
            default:
                //specificationEnded = true;
                break;
        }
    }

    getPreservedColumns(){
        var columns = [];
        debugger;
        for(let column in this.app.attributeActions){
            if(this.app.attributeActions[column]["action"] != "remove"){
                columns.push(column);
            }
        }
        return columns;
    }

    anonymizeData() {
        this.app.workingSchema = jQuery.extend(true, {}, this.app.schema);

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

        var preservedColumns =  this.getPreservedColumns();
        var subSet = statistics.selectColumns(resultTable,preservedColumns);
        this.app.anonymizedSchema = subSet;
        this.app.anonymizedSchemaFull = resultTable;

        var qid_cols = this.app.getColumnNamesByType("qid");
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

        $("#finished_table").html(app.jsonToTable(this.app.anonymizedSchema, -1, [], "myTable"));
        $("#export_schema").prop("disabled", false);
        $("#myTable").tablesorter({sortList: final_sort});
        var statistics = new Statistics(this.app);
        $("#statistics").html(statistics.build());
        for(let chart of statistics.charts){
            statistics.drawChart(chart);
        }
    }

}

export = Anonymization;