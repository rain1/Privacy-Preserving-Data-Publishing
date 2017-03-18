import WindowManager = require("./../WindowManager");
import Application = require("./../Application");

class GeneralizationDialog {
    isNum = true;
    currentColumn = "";

    app:Application;
    winMgr:WindowManager;

    constructor(app:Application, winMgr:WindowManager) {
        this.app = app;
        this.winMgr = winMgr;
    }

    init(columnName:string) {
        this.isNum = true;
        this.currentColumn = columnName;
        var cells = this.app.getUniqueValueByColumn(columnName);
        var elements = "";
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
        if(String(integerValue) == str){
            if(integerValue == 0){
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

    nextClicked() {
        if (this.app.attributeActions[this.currentColumn].mode == "interval") {
            this.app.attributeActions[this.currentColumn].operation = $("#interval_size").val();
        } else {
            this.app.attributeActions[this.currentColumn].operation = {};
            var inputValue = $("#rules").val();
            if(inputValue.substring(inputValue.length -1) == "\n"){ //TODO TEST
                inputValue = inputValue.substring(0, inputValue.length -1);
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
        this.winMgr.closeWindow("generalization");
        this.app.actionDialog.defineNextRule();
    }
}

export = GeneralizationDialog;