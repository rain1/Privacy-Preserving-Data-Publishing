package thesis.quiz;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class Quiz {
    List<Task> tasks = null;

    public Quiz() {
        ObjectMapper mapper = new ObjectMapper();
        InputStream inputStream = getClass().getClassLoader().getResourceAsStream("questions.json");
        try {
            tasks = mapper.readValue(inputStream, mapper.getTypeFactory().constructCollectionType(List.class, Task.class));
        } catch (IOException e) {
            System.out.println("There was problem with reading json file.");
            e.printStackTrace();
        }
    }

    public List<TaskDTO> composeQuiz() {
        List<TaskDTO> taskDTOs = new ArrayList<TaskDTO>();
        for (Task task : tasks) {
            taskDTOs.add(new TaskDTO(task.getText(), task.getRandomQuestion()));
        }
        return taskDTOs;
    }

    public List<TaskDTO> ofAnswers(List<Answer> answers) {
        List<TaskDTO> taskDTOs = new ArrayList<TaskDTO>();
        for (int i = 0; i < tasks.size(); i++) {
            String task = tasks.get(i).getText();
            Question question = tasks.get(i).findQuestionById(answers.get(i).questionId);
            taskDTOs.add(new TaskDTO(task, question));
        }
        return taskDTOs;
    }

    public Task findTaskById(int taskId) {
        for (Task task : tasks) {
            if (task.id == taskId) {
                return task;
            }
        }
        return null;
    }

    public Feedback checkAnswer(Answer answer) {
        Task task = findTaskById(answer.taskId);
        Question question = task.findQuestionById(answer.questionId);
        Feedback feedback = new Feedback();
        feedback.actualAnswer = question.answer;
        feedback.userAnswer = answer.answer;
        feedback.correct = question.check(answer.answer);
        feedback.taskId = question.task;
        feedback.questionId = question.id;
        return feedback;
    }

    public List<Feedback> cehckQuiz(List<Answer> answers) {
        List<Feedback> feedback = new ArrayList<Feedback>();
        for (Answer answer : answers) {
            Feedback result = checkAnswer(answer);
            feedback.add(result);
        }
        return feedback;
    }

}
