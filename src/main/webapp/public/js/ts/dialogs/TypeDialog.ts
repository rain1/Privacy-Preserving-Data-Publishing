import Application = require("./../Application");
import WindowManager = require("./../WindowManager");
class TypeDialog {
    app:Application;
    winMgr:WindowManager;
    startOver = true;

    constructor(app:Application, winMgr:WindowManager) {
        this.app = app;
        this.winMgr = winMgr;
    }

    buildCombo(name:string) {
        return '<select  onchange="app.typeDlg.typeChanged();" class="type_select" name="' + name + '">' +
            '   <option value="none">Not Defined</option>' +
            '   <option value="id">ID</option>' +
            '   <option value="qid">QID</option>' +
            '   <option value="sensitive">Sensitive</option>' +
            '   <option value="nonsensitive">Nonsensitive</option>' +
            '</select>';
    }

    validateTypes() {
        var senitiveColumns = 0;
        for (let element of $('select[class="type_select"]')) {
            var columnName = $(element).attr('name');
            var columnType = $(element).val();

            if (columnType == "sensitive") {
                senitiveColumns++;
                if (senitiveColumns > 1) {
                    alert("Privacy preserving methods implemented in this program are designed to support only one " +
                        "sensitive attribute. You have chosen " + senitiveColumns + " columns. Please cange your " +
                        "choices before you continue.");
                    return false;
                }
            }

            if (this.app.method == "edif" && columnType == "sensitive") {
                var cells = this.app.getUniqueValueByColumn(columnName);
                for (var i in cells) {
                    if (!$.isNumeric(cells[i])) {
                        alert("In ϵ-Differential privacy sensitive attributes can only have numerical values." +
                            " Please choose some other column to be sensitive.");
                        return false;
                    }
                }

            }
        }
        return true;
    }

    typeChanged() {
        if (this.validateTypes()) {
            $("#typesNext").prop("disabled", false);
        } else {
            $("#typesNext").prop("disabled", true);
        }
    }

    buildTableTypes(tableJson) {
        console.log("building....");
        var keys = [];
        for (var k in tableJson[0]) keys.push(k);
        var content = "<table class='preview_table'><tr>";
        for (let e of keys) {
            console.log(e);
            content += "<th>" + e + " " + this.buildCombo(e) + "</th>";
        }
        content += "</tr>";

        var cellContent = "";
        var rowcount = 0;
        tableJson.forEach(
            function (row) {
                content += "<tr>";
                for (var cell in row) {
                    cellContent = row[cell] == "" ? "e" : row[cell];
                    content += "<td>" + cellContent + "</td>";
                }
                content += "</tr>";
                rowcount++;
                if (rowcount == 5) {
                    return;
                }
            }
        );

        content += "</table>";

        return content;

    }

    init(selectedTable:string, startOver:boolean) {
        this.startOver = startOver;
        if (startOver) {
            this.app.schemaName = selectedTable;
            var schemasJSON = "";
            var htmlContent = '';

            htmlContent += this.buildTableTypes(this.app.schema);
            $("#type_list").html(htmlContent);
        }
        this.typeChanged();
        $("#types").show();
    }

    backClicked() {
        this.winMgr.closeWindow("types");
        if (this.app.method == "multir") {
            this.app.joinDialog.startOver = false;
            $("#join").show();
        } else {
            this.app.openDialog.startOver = false;
            $("#open").show();
        }
    }

    nextClicked() {
        this.app.attributeTypes = {};
        console.log("sadfsd");
        for (let element of $('select[class="type_select"]')) {
            var key = $(element).attr('name');
            var jsonVariable = {
                type: $(element).val()
            };
            this.app.attributeTypes[key] = jsonVariable;
        }

        if (this.app.hasDuplicateKeys()) {
            if (this.app.method == "kanonymity") {
                alert("Your table contains duplicate identifiers.\nYou should either add more coulmns as ID or choose (X, Y)-Anonymity instead.");
                return;
            }
        }

        this.winMgr.closeWindow('types');
        app.actionDlg.init(this.startOver);
    }
}

export = TypeDialog;