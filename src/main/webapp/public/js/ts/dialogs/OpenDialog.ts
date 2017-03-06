import Application = require("./../Application");
import WindowManager = require("./../WindowManager");
class OpenDialog {
    app:Application;
    winMgr:WindowManager;

    constructor(app:Application, winMgr:WindowManager) {
        this.app = app;
        this.winMgr = winMgr;
    }

    init() {
        var schemasJSON = this.app.getSchemas();
        $("#anonymization_method").val("none");
        $("#open_table_preview").html("None selected.");
        this.methodChanged();
        var htmlContent = "";
        for (var i in schemasJSON) {
            htmlContent += '<input class="table_check" type="checkbox"  name="' + schemasJSON[i] + '" >' + schemasJSON[i] + '<br>'
        }
        $('#table_list').html(htmlContent);
        $("#open").show();

        $(".table_check").change(function () {
            app.openDlg.checkboxesChanged();
        });
    }

    buildPreviews(selectedElements:string[]) {
        var previewHtml = "None selected.";
        if (selectedElements.length > 0) {
            previewHtml = "";
            for (let schemaName of selectedElements) {
                var schemaJson = this.app.getSchema(schemaName);
                previewHtml += "<h4>" + schemaName + "</h4>";
                previewHtml += app.jsonToTable(schemaJson, 5) + "<br>";
            }
        }
        $("#open_table_preview").html(previewHtml);
        return previewHtml;
    }

    nextClicked() {
        var selected = [];

        $("#open input:checked").each(function () {
            selected.push($(this).attr('name'));
        });

        this.app.method = $("#anonymization_method").val();

        this.winMgr.closeWindow('open');
        this.app.joinDialog.init(selected);
    }

    methodChanged() {
        if ($("#anonymization_method").val() == "none") {
            $("#open_next").prop("disabled", true);
        } else {
            $("#open_next").prop("disabled", false);
        }
    }

    checkboxesChanged() {
        console.log("changed");
        var selectedCheckboxes = $("input:checked[type=checkbox]");
        var checkedInputs = selectedCheckboxes.length;
        if (checkedInputs == 0) {
            $("option[value=kanonymity]").prop("disabled", true);
            $("option[value=xy]").prop("disabled", true);
            $("option[value=multir]").prop("disabled", true);
            $("option[value=ldiv]").prop("disabled", true);
            $("option[value=tc]").prop("disabled", true);
            $("option[value=edif]").prop("disabled", true);
            $("option[value=dist]").prop("disabled", true);
        } else if (checkedInputs == 1) {
            $("option[value=kanonymity]").prop("disabled", false);
            $("option[value=xy]").prop("disabled", false);
            $("option[value=multir]").prop("disabled", true);
            $("option[value=ldiv]").prop("disabled", false);
            $("option[value=tc]").prop("disabled", false);
            $("option[value=edif]").prop("disabled", false);
            $("option[value=dist]").prop("disabled", false);
        } else {
            $("option[value=kanonymity]").prop("disabled", true);
            $("option[value=xy]").prop("disabled", true);
            $("option[value=multir]").prop("disabled", false);
            $("option[value=ldiv]").prop("disabled", true);
            $("option[value=tc]").prop("disabled", true);
            $("option[value=edif]").prop("disabled", true);
            $("option[value=dist]").prop("disabled", true);
            $("#anonymization_method").val("multir");
        }

        if (checkedInputs < 2 && ($("#anonymization_method").val() == "multir" || $("#anonymization_method").val() == null)) {
            $("#anonymization_method").val("none");
        }

        var selectedNames = [];

        if (checkedInputs == 1) {
            selectedNames.push(selectedCheckboxes.attr("name"));
        } else {
            for (let element of selectedCheckboxes) {
                selectedNames.push($(element).attr("name"));
            }
        }

        this.methodChanged();


        this.buildPreviews(selectedNames);
    }

}

export = OpenDialog;