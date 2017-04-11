package thesis.quiz;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;
import java.util.Random;

@ToString
@Getter
@Setter
public class Task {
    int id;
    String text;
    List<Question> questions;

    Question findQuestionById(int id){
        for (Question question : questions) {
            if (question.id == id){
                return question;
            }
        }
        return null;
    }

    int getQuestionCount(){
        return questions.size();
    }

    private int randInt(int min, int max){
        Random random = new Random();
        return random.nextInt(max) + min;
    }

    private int randQuestionId(int max){
        return randInt(0,max);
    }

    public Question getRandomQuestion(){
        int numQuestions = questions.size();
        return questions.get(randQuestionId(numQuestions));
    }
}
