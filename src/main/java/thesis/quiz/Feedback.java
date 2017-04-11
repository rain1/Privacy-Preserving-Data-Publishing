package thesis.quiz;

import lombok.Getter;

@Getter
public class Feedback {
    int taskId;
    int questionId;
    String userAnswer;
    String actualAnswer;
    Boolean correct;
}
