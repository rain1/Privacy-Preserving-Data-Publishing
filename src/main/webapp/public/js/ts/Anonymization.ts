import Application = require("./Application");
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


    anonymizeData() {
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

        console.log(JSON.stringify(resultTable));
        var qid_cols = this.app.getColumnNamesByType("qid");
        var tableKeys = Object.keys(resultTable[0]);
        var qid_ids = [];
        for (i in tableKeys) {
            if (qid_cols.indexOf(tableKeys[i]) > -1) {
                qid_ids.push({
                    "name":tableKeys[i],
                    "values": this.app.getUniqueValueByColumn(tableKeys[i], resultTable).length,
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


        $("#finished_table").html(app.jsonToTable(resultTable, -1, [], "myTable"));
        $("#myTable").tablesorter({sortList: final_sort}); //TODO sorteerida muutuste j2gi, et saada max QID.
    }

}

export = Anonymization;