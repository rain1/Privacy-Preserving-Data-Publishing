import OpenDialog = require("./dialogs/OpenDialog");
import GeneralizationDialog = require("./dialogs/GeneralizationDialog");
import JoinDialog = require("./dialogs/JoinDialog");
import TypeDialog = require("./dialogs/TypeDialog");
import ActionDialog = require("./dialogs/ActionDialog");
import Anonymization = require("./Anonymization");
import UploadDialog = require("./dialogs/UploadDialog");

class Application {
    schemaName = "";
    attributeTypes = [];
    attributeActions = [];
    schema = {};
    workingSchema = {};
    method = "";
    methodParam = 10;
    anonymizedSchema = {};
    anonymizedSchemaFull = {};

    uploadDialog:UploadDialog;
    openDialog:OpenDialog;
    joinDialog:JoinDialog;
    typeDialog:TypeDialog;
    actionDialog:ActionDialog;
    generalizationDialog:GeneralizationDialog;
    anonymizer:Anonymization;

    downloadResult() {
        var csv = app.jsonToCSV(this.anonymizedSchema);
        var downloadLink = $("#result_download");
        downloadLink.attr("href", "data:text/plain,"+encodeURIComponent(csv));
        downloadLink[0].click();
    }

    downloadResultFull() {
        var csv = app.jsonToString();
        var downloadLink = $("#result_download");
        downloadLink.attr("href", "data:text/plain,"+encodeURIComponent(csv));
        downloadLink[0].click();
    }

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

    unique(arr) {
        var u = {};
        var a = [];
        for (let element of arr) {
            if (!u.hasOwnProperty(element)) {
                a.push(element);
                u[element] = 1;
            }
        }
        return a;
    }

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
        return this.unique(this.getValuesByColumn(columnName, schema));
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

    getColumnNames() {
        var columns = [];
        for (var c in this.attributeTypes) {
            columns.push(c);
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