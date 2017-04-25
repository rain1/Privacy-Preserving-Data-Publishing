package thesis.quiz;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class QuizController {
    Quiz quiz = new Quiz();

    @RequestMapping("/quiz")
    public String quizPage(Model model) {
        model.addAttribute("quiz", quiz.composeQuiz());
        return "quiz";
    }
}
