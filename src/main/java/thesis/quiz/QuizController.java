package thesis.quiz;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Controller
public class QuizController {
    Quiz quiz = new Quiz();

    @RequestMapping("/quiz")
    public String messages(Model model) {
        model.addAttribute("quiz", quiz.composeQuiz());
        return "quiz";
    }
}
