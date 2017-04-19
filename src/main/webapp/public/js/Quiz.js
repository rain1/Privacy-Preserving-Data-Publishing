var Quiz = (function () {
    function Quiz() {
        this.lastAnswers = [];
    }
    Quiz.prototype.answersToJson = function () {
        var answers = [];
        for (var _i = 0, _a = $('input:checked'); _i < _a.length; _i++) {
            var answer = _a[_i];
            var element = $(answer);
            var parts = element.attr("name").split("-");
            var answerStruct = {
                "taskId": parts[0],
                "questionId": parts[1],
                "answer": element.attr("value")
            };
            answers.push(answerStruct);
        }
        return answers;
    };
    Quiz.prototype.answersFromJson = function (feedback) {
        $("#score_label").show();
        $(".task input[type='radio']").parent().attr("class", "");
        $('input:checked').parent().attr("class", "incorrect");
        var max = feedback.length;
        var current = 0;
        for (var _i = 0, feedback_1 = feedback; _i < feedback_1.length; _i++) {
            var question = feedback_1[_i];
            var elemnt = $("#t_" + question.taskId + "-q_" + question.questionId + " input[value='" + question.actualAnswer + "']").parent();
            elemnt.attr("class", "correct");
            if (question.correct) {
                current++;
            }
        }
        $("#score_number").html(current + " out of " + max);
    };
    Quiz.prototype.postJson = function (dataJson, dataUrl) {
        var response = "";
        if (typeof dataJson != 'string') {
            dataJson = JSON.stringify(dataJson);
        }
        $.ajax({
            url: dataUrl,
            type: 'POST',
            data: dataJson,
            contentType: "application/json",
            dataType: "json",
            success: function (result) {
                response = result;
                console.log(result);
            },
            async: false
        });
        return response;
    };
    Quiz.prototype.getFile = function (dataUrl) {
        var response = "";
        $.ajax({
            url: dataUrl,
            type: 'GET',
            success: function (result) {
                response = result;
            },
            async: false
        });
        return response;
    };
    Quiz.prototype.answer = function () {
        var answers = this.answersToJson();
        this.lastAnswers = answers;
        if (answers.length == 9) {
            console.log("success");
            var response = this.postJson(answers, './rest/quiz/');
            $("#save").show();
        }
        else {
            console.log("fail");
        }
        this.answersFromJson(response);
        $("#submit").attr("value", "Try again");
        $("#submit").attr("onclick", "quiz.tryAgain();");
        console.log(answers);
    };
    Quiz.prototype.tryAgain = function () {
        if (confirm('Are you sure you want to take this test again? You will receive new questions.')) {
            location.reload(true);
        }
    };
    Quiz.prototype.toHtml = function () {
        var htmlContent = '<!DOCTYPE html>' +
            '<html>' +
            '<head>' +
            '<meta charset="UTF-8">' +
            '<style>' +
            '{STYLE}' +
            '</style>' +
            '</head>' +
            '<body>' +
            '{BODY}' +
            '</body>' +
            '</html>';
        debugger;
        htmlContent = htmlContent.replace("{STYLE}", this.getFile("/public/css/quiz.css"));
        htmlContent = htmlContent.replace("{BODY}", $("#quiz_container").html());
        return htmlContent;
    };
    Quiz.prototype.save = function () {
        var results = this.lastAnswers;
        //var resultsString = JSON.stringify(results);
        var downloadLink = $("#result_download");
        downloadLink.attr("href", "data:text/plain," + encodeURIComponent(this.toHtml()));
        downloadLink[0].click();
    };
    Quiz.prototype.grader = function () {
        var file = document.getElementById("fileForUpload").files[0];
        var quizFeedback;
        var quizQuestions;
        var answersData;
        var toQuiz = this.jsonToQuiz;
        var mark = this.markAnswers;
        var fromJson = this.answersFromJson;
        if (file) {
            var poster = this.postJson;
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {
                answersData = JSON.parse(evt.target.result);
                document.getElementById("fileContents").innerHTML = evt.target.result;
                quizFeedback = poster(evt.target.result, './rest/quiz/');
                quizQuestions = poster(evt.target.result, './rest/getquiz/');
                toQuiz(quizQuestions);
                mark(answersData);
                fromJson(quizFeedback);
            };
            reader.onerror = function (evt) {
                document.getElementById("fileContents").innerHTML = "error reading file";
            };
        }
    };
    Quiz.prototype.markAnswers = function (answers) {
        for (var _i = 0, answers_1 = answers; _i < answers_1.length; _i++) {
            var answer = answers_1[_i];
            $("input[name='" + answer.taskId + "-" + answer.questionId + "'][value='" + answer["answer"] + "']").prop('checked', true);
        }
    };
    Quiz.prototype.jsonToQuiz = function (quiz) {
        var htmlContent = '<div id="score_label">Your score is: <span id="score_number"></span></div>';
        for (var _i = 0, quiz_1 = quiz; _i < quiz_1.length; _i++) {
            var task = quiz_1[_i];
            htmlContent += '<div class="task" id="t_' + task.question["task"] + '-q_' + task.question.id + '">';
            htmlContent += '<div>' + task.text + '</div>';
            htmlContent += '<div>' + task.question["question"] + '</div>';
            for (var _a = 0, _b = task.question.options; _a < _b.length; _a++) {
                var option = _b[_a];
                htmlContent += '<div>';
                htmlContent += '<input type="radio" name="' + task.question["task"] + "-" + task.question.id + '" value="' + option + '"> <span>' + option + '</span><br>';
                htmlContent += '</div>';
            }
            htmlContent += '</div>';
        }
        $("#quiz_target").html(htmlContent);
    };
    return Quiz;
}());
window.quiz = new Quiz();
