import Application = require("./Application");
import WindowManager = require("./WindowManager");

class ColumnHeader {
    columnName = "";

    constructor(columnName:string) {
        this.columnName = columnName;
    }

    getTableName() {
        return this.columnName.split(".")[0];
    }

}

class JoinRule {
    left:ColumnHeader;
    operator:string;
    right:ColumnHeader;

    constructor(left:ColumnHeader, operator:string, right:ColumnHeader) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    constructor(left:string, operator:string, right:string) {
        this.left = new ColumnHeader(left);
        this.operator = operator;
        this.right = new ColumnHeader(right);
    }

    toString() {
        return this.left.columnName + this.operator + this.right.columnName;
    }

    getLeftString() {
        return this.left.columnName;
    }

    getRightString() {
        return this.right.columnName;
    }

    getOperator() {
        return this.operator;
    }

}

class JoinDialog {
    app:Application;
    winMgr:WindowManager;
    schemasJSON = {};
    defineRules = false;
    joinRules = {};
    joinRulesList:JoinRule[] = [];
    tableNames:string[];
    lastJoinResult = [];

    constructor(app:Application, winMgr:WindowManager) {
        this.app = app;
        this.winMgr = winMgr;
    }

    findRuleByString(rule:string) {
        for (let index in this.joinRulesList) {
            if (this.joinRulesList[index].toString() == rule) {
                return index;
            }
        }
        return -1;
    }

    addRule() {
        this.defineRules = true;
        var joinButton = $("#new_join_rule");
        joinButton.prop("disabled", true);
        joinButton.val("Ok");
        joinButton.prop("title", "Please select table headers left.");
        joinButton.attr("onclick", "app.joinDlg.finishRule();");
        $('#schema_list .preview_table th').css("color", "#000");
    }

    finishRule() {
        this.defineRules = false;
        var joinButton = $("#new_join_rule");
        var ruleKeys = Object.keys(this.joinRules);
        var joinRule = new JoinRule(this.joinRules[ruleKeys[0]], "=", this.joinRules[ruleKeys[1]]);
        this.joinRulesList.push(joinRule);
        var htmlContent = '<code class="window_container"><span class="rule">' + joinRule.toString() + '</span><img class="icon24 window_container_remove" src="./public/icons/delete.png" title="Remove rule" onclick="app.joinDlg.removeRule(this)"></code>';
        $("#join_rules").append(htmlContent);
        joinButton.val("Add rule");
        joinButton.attr("onclick", "app.joinDlg.addRule();");
        for (let tableName of this.tableNames) {
            for (let currrentElement of $("#" + tableName + " th")) {
                currrentElement.className = "";
            }
        }
        $('#schema_list .preview_table th').css("color", "#555");
        this.joinRules = {};
        this.showResult();
    }

    removeRule(element) {
        var parent = $(element).parent();
        var rule = $(".rule", parent).text();
        var index = this.findRuleByString(rule);
        this.joinRulesList.splice(index, 1);
        parent.remove();
        this.showResult();
    }

    toggleSelect(header:string, element) {
        if (this.defineRules) {
            if (element.classList.contains("on")) {
                console.log("toggle off: " + header);
                element.className = "";
            } else {
                console.log("toggle on: " + header);
                var tablename = header.split(".")[0];
                for (let currrentElement of $("#" + tablename + " th")) {
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
        } else {
            alert("You are not currently defining any rules. Please click on 'Add rule' first.");
        }
    }

    buildTable(tableName:string, tableJson) {
        console.log("building....");
        var keys = [];
        for (var k in tableJson[0]) keys.push(k);
        var content = "<h4>" + tableName + "</h4><table class='preview_table'><tr id='" + tableName + "'>";
        for (let key of keys) {
            content += "<th onclick='app.joinDlg.toggleSelect(\"" + tableName + "." + key + "\", this)'>" + key + "</th>";
        }
        content += "</tr>";

        var cellContent = "";
        var rowcount = 0;
        for (let row of tableJson) {
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

    }

    nextClicked() {
        this.winMgr.closeWindow("join");
        this.app.schema = this.lastJoinResult;
        this.app.typeDialog.init("merged");
    }


    init(selectedTables:string[]) {
        var htmlContent = '';
        this.schemasJSON = {};
        this.tableNames = selectedTables;
        console.log("init join");

        if (selectedTables.length == 0) {
            console.log("none");
            return;
        } else if (selectedTables.length == 1) {
            console.log("skip to column types");
            this.app.schema = this.app.getSchema(selectedTables[0]);
            this.app.typeDialog.init(selectedTables[0]);
            return;
        } else {
            console.log("merge" + selectedTables.length.toString());
            for (let schemaName of selectedTables) {
                console.log(schemaName);
                this.schemasJSON[schemaName] = this.app.getSchema(schemaName);
                htmlContent += this.buildTable(schemaName, this.schemasJSON[schemaName]);
            }
        }
        $("#join").show();

        $("#schema_list").html(htmlContent);
        $('#schema_list .preview_table th').css("color", "#555");
        $("#joinNext").prop("disabled", true);
    }

    compareRow(rows) {
        var generatedRow = {};
        var addRow = true;

        var rules = this.joinRulesList;

        for (let rule of rules) {
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

        for (let tableName of Object.keys(rows)) {
            generatedRow = jQuery.extend(true, generatedRow, rows[tableName]);
        }
        return {
            "add": addRow,
            "content": generatedRow
        };
    }

    joinTables(schemaList, rows, resultTable:any[]) {
        if (this.joinRulesList.length == 0) {
            return [];
        }

        var joinRules = {};
        var tableName = Object.keys(schemaList)[0];

        if (Object.keys(schemaList).length == 0) {
            return schemaList;
        } else if (Object.keys(schemaList).length == 1) {
            var currentJson = schemaList[tableName]; //pop
            delete schemaList[tableName]; //pop
            for (let row1 of currentJson) {
                rows[tableName] = row1;
                var compareResult = this.compareRow(rows);
                if (compareResult.add) {
                    console.log(compareResult.content);
                    resultTable.push(compareResult.content);
                }
            }
        } else {
            var currentJson = schemaList[tableName]; //pop
            delete schemaList[Object.keys(schemaList)[0]]; //pop
            for (let row1 of currentJson) {
                rows[tableName] = row1;
                this.joinTables(jQuery.extend(true, {}, schemaList), rows, resultTable);
            }
        }

        return resultTable;
    }

    showResult() {
        var result = this.joinTables(jQuery.extend(true, {}, this.schemasJSON), {}, []);
        if (result.length == 0 && this.joinRulesList.length == 0) {
            $("#join_preview").html("No rules defined.");
            $("#joinNext").prop("disabled", true);
        } else if (result.length == 0 && this.joinRulesList.length > 0) {
            $("#join_preview").html("Rules are defined but seem to be invalid. Please check your rules and remove any rules that incorrect.<br>Hint: can you expect Job to be equal to diasese");
            $("#joinNext").prop("disabled", true);
        } else {
            $("#join_preview").html(app.jsonToTable(result));
            this.lastJoinResult = result;
            $("#joinNext").prop("disabled", false);
        }

    }

}

export = JoinDialog;