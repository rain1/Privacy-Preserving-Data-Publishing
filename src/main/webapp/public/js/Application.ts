import OpenDialog = require("./OpenDialog");
import GeneralizationDialog = require("./GeneralizationDialog");
import JoinDialog = require("./JoinDialog");
import TypeDialog = require("./TypeDialog");
import ActionDialog = require("./ActionDialog");
import Anonymization = require("./Anonymization");

class Application {
    schemaName = "";
    attributeTypes = [];
    attributeActions = [];
    schema = {};
    workingSchema = {};
    method = "";

    openDialog:OpenDialog;
    joinDialog:JoinDialog;
    typeDialog:TypeDialog;
    actionDialog:ActionDialog;
    generalizationDialog:GeneralizationDialog;
    anonymizer:Anonymization;

    getSchemas() {
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

    getSchema(schema:string) {
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

    getValuesByColumn(columnName:string, schema = {}):string[] {
        var values = [];
        if(this.equals(schema, {})) {
            schema = this.schema;
        }
        for (var i in schema) {
            values.push(schema[i][columnName]);
        }
        return values;
    };

    getUniqueValueByColumn(columnName:string, schema = {}):string[] {
        return unique(this.getValuesByColumn(columnName, schema));
    };

    getColumnNamesByType(search:string) {
        var columns = [];
        for (var c in this.attributeTypes) {
            if (this.attributeTypes[c].type == search) {
                columns.push(c);
            }
        }
        return columns;
    };

    equals(a, b) {
        return JSON.stringify(a) == JSON.stringify(b);
    };

    hasDuplicateKeys() {
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

export = Application;