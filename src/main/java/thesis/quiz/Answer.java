package thesis.quiz;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Answer {
    int taskId;
    int questionId;
    String answer;
}
