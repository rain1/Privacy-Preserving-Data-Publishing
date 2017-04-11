package thesis.quiz;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TaskDTO {
    int id;
    int task;
    String question;
    List<String> options;
    String answer;
}
