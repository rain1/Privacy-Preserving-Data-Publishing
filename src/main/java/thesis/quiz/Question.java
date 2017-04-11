package thesis.quiz;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@ToString
@Getter @Setter
public class Question {
    int id;
    int task;
    String question;
    List<String> options;
    String answer;

    public boolean check(String answer){
        return this.answer.equals(answer);
    }
}
