import WindowManager = require("./../WindowManager");
import Application = require("./../Application");

class GeneralizationDialog {
    isNum = true;
    currentColumn = "";
    currentColumnId = -1;
    lastDefinedColumn = "";
    lastDefinedColumnId = -1;
    definingInProgress = false;

    app:Application;
    winMgr:WindowManager;

    constructor(app:Application, winMgr:WindowManager) {
        this.app = app;
        this.winMgr = winMgr;
    }

    updateLastDefinedColumn(column:string){
        var columns = this.app.getColumnNames();
        if(columns.indexOf(column) >  columns.indexOf(this.lastDefinedColumn)){
            this.lastDefinedColumn = column;
            this.lastDefinedColumnId = columns.indexOf(column);
        }
        this.currentColumnId = columns.indexOf(column);
    }

    renderView(columnName:string){
        if (this.app.attributeActions[columnName].defined) {
            if (this.app.attributeActions[columnName].mode == "interval") {
                $("#interval_size").val(this.app.attributeActions[columnName]["operation"]);
                this.intervalSizeChanged();
            } else {
                var actionDict = {};
                var ruleData = "";
                for (var k in this.app.attributeActions[columnName]["operation"]) {
                    if (actionDict[this.app.attributeActions[columnName]["operation"][k]] == undefined) {
                        actionDict[this.app.attributeActions[columnName]["operation"][k]] = [k];
                    } else {
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
    }

    init(columnName:string) {
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
            //selectIntervals();
            //$("#intervals_radio").prop("checked", true);
            $("#intervals_radio").click();
            $("#min_max").html('Min:' + Math.min.apply(Math, cells) + ' Max:' + Math.max.apply(Math, cells));
        } else {
            $("#min_max").html("");
            $("#values_radio").click();
            $("#value_pool").html(elements);
            //selectValues();
        }
        $("#column_name").html(this.currentColumn);

        $("#interval_size").val("");
        $("#rules").val("");
        $("#generalization_preview").html(app.jsonToTable(this.app.schema, -1, [this.currentColumn]));
        //$("#generalization_next").prop("disabled", true);
        this.renderView(columnName);
        this.updateLastDefinedColumn(columnName);
        $("#generalization").show();
    }

    selectIntervals() {
        this.app.attributeActions[this.currentColumn].mode = "interval";
        $("#interval_desc").css("color", "inherit");
        $("#interval_size").prop("disabled", false);
        $("#rules").prop("disabled", true);
        $("#disabled").prop("disabled", true);
        $("#set_rule").prop("disabled", true);
        $("#new_rule").prop("disabled", true);
        $("#value_pool").prop("disabled", true);
        this.intervalSizeChanged();
    }

    selectValues() {
        this.app.attributeActions[this.currentColumn].mode = "values";
        $("#interval_desc").css("color", "#555");
        $("#interval_size").prop("disabled", true);
        $("#rules").prop("disabled", false);
        $("#set_rule").prop("disabled", false);
        $("#new_rule").prop("disabled", false);
        $("#value_pool").prop("disabled", false);

    }

    addWord(element) {
        $(element).hide();
        $("#rules").val($("#rules").val() + $(element).text() + ",");
    }

    addGeneralization() {
        var general = prompt("Please specify general value for these values", "");
        var currentRules = $("#rules").val();
        if (currentRules.slice(-1) == ",") {
            currentRules = currentRules.slice(0, -1);
        }
        $("#rules").val(currentRules + "->" + general);
        $("#rules").val($("#rules").val() + "\n");
    }


    isValidInterval(str) {
        var integerValue = Math.floor(Number(str));
        if (String(integerValue) == str) {
            if (integerValue == 0) {
                alert("Error: Interval with size of 0 is not usable for generalization.");
                return false;
            }
            return true;
        }
        return false;
    }

    intervalSizeChanged() {
        if (this.app.attributeActions[this.currentColumn].mode == "interval") {
            var inputValue = $("#interval_size").val();
            if (this.isValidInterval(inputValue)) {
                $("#generalization_next").prop("disabled", false);
            } else {
                $("#generalization_next").prop("disabled", true);
            }
        }
    }

    saveFormData(){
        if (this.app.attributeActions[this.currentColumn].mode == "interval") {
            this.app.attributeActions[this.currentColumn].operation = $("#interval_size").val();
        } else {
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
    }

    getPreviousColumn() {
        var columns = this.app.getColumnNames();
        var previous = columns.indexOf(this.currentColumn) -1;
        while(previous > -1){
            var previousValue = columns[previous];
            if(this.app.attributeActions[previousValue].action == "generalize"){
                return previousValue
            }
            previous--;
        }
        return "";
    }

    getNextColumn() {
        var columns = this.app.getColumnNames();
        var next = columns.indexOf(this.currentColumn) +1;
        while(next < columns.length -1){
            var nextValue = columns[next];
            if(this.app.attributeActions[nextValue].action == "generalize"){
                return nextValue
            }
            next++;
        }
        return "";
    }

    backClicked(){
        this.app.attributeActions[this.currentColumn].defined = true;
        this.saveFormData();
        var previousColumn = this.getPreviousColumn();
        if(previousColumn == ""){
            this.winMgr.closeWindow("generalization");
            $("#actions").show();
        }else{
            this.init(previousColumn);
        }

    }

    nextClicked() {
        this.saveFormData();
        this.winMgr.closeWindow("generalization");
        this.app.attributeActions[this.currentColumn].defined = true;
        if(this.currentColumnId >= this.lastDefinedColumnId){
            this.definingInProgress = false;
            this.app.actionDialog.defineNextRule();
        }else{
            this.init(this.getNextColumn());
        }
    }
}

export = GeneralizationDialog;