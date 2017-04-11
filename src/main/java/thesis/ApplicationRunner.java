package thesis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import thesis.quiz.QuizController;

@SpringBootApplication
@PropertySources({
        @PropertySource(value = "classpath:application.properties")
})
public class ApplicationRunner {

    public static void main(String[] args) {
        new QuizController();
        ConfigurableApplicationContext ctx = SpringApplication.run(ApplicationRunner.class, args);
    }
}
