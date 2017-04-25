class Quiz {
    lastAnswers = [];

    answersToJson() {
        var answers = [];
        for (let answer of $('input:checked')) {
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
    }

    answersFromJson(feedback) {
        $("#score_label").show();
        $(".task input[type='radio']").parent().attr("class", "");
        $('input:checked').parent().attr("class", "incorrect");
        var max = feedback.length;
        var current = 0;
        for (let question of feedback) {
            var elemnt = $("#t_" + question.taskId + "-q_" + question.questionId + " input[value='" + question.actualAnswer + "']").parent();
            elemnt.attr("class", "correct");
            if (question.correct) {
                current++;
            }
        }
        $("#score_number").html(current + " out of " + max);
    }

    postJson(dataJson, dataUrl) {
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
    }

    getFile(dataUrl) {
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
    }

    answer() {
        var answers = this.answersToJson();
        this.lastAnswers = answers;
        if (answers.length == 9) {
            console.log("success");
            var response = this.postJson(answers, './rest/quiz/');
            $("#save").show();
        } else {
            console.log("fail");
            alert("You must complete all tasks before you can submit answers.");
            return;
        }
        this.answersFromJson(response);
        $("#submit").attr("value", "Try again");
        $("#submit").attr("onclick", "quiz.tryAgain();");
        console.log(answers)
    }

    tryAgain() {
        if (confirm('Are you sure you want to take this test again? You will receive new questions.')) {
            location.reload(true);
        }
    }

    toHtml() {
        var htmlContent =  '<!DOCTYPE html>' +
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
        htmlContent =  htmlContent.replace("{STYLE}", this.getFile("/public/css/quiz.css"))
        htmlContent = htmlContent.replace("{BODY}", $("#quiz_container").html());
        return htmlContent;
    }

    save() {
        var results = this.lastAnswers;
        //var resultsString = JSON.stringify(results);
        var downloadLink = $("#result_download");
        downloadLink.attr("href", "data:text/plain," + encodeURIComponent(this.toHtml()));
        downloadLink[0].click();
    }

    grader() {
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
            }
        }
    }

    markAnswers(answers) {
        for (let answer of answers) {
            $("input[name='" + answer.taskId + "-" + answer.questionId + "'][value='" + answer["answer"] + "']").prop('checked', true);
        }
    }

    jsonToQuiz(quiz) {
        var htmlContent = '<div id="score_label">Your score is: <span id="score_number"></span></div>';
        for (let task of quiz) {
            htmlContent += '<div class="task" id="t_' + task.question["task"] + '-q_' + task.question.id + '">';
            htmlContent += '<div>' + task.text + '</div>';
            htmlContent += '<div>' + task.question["question"] + '</div>';
            for (let option of task.question.options) {
                htmlContent += '<div>';
                htmlContent += '<input type="radio" name="' + task.question["task"] + "-" + task.question.id + '" value="' + option + '"> <span>' + option + '</span><br>';
                htmlContent += '</div>';
            }
            htmlContent += '</div>';
        }
        $("#quiz_target").html(htmlContent);
    }


}

window.quiz = new Quiz();