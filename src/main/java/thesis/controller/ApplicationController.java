package thesis.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import thesis.ppdp.PPDPController;

import java.util.List;
import java.util.Map;


@RestController
public class ApplicationController {
    private static final Logger LOG = LoggerFactory.getLogger(ApplicationController.class);

    public PPDPController app;

    ApplicationController(){
        app = new PPDPController();
    }

    @RequestMapping("/rest/schema/{schema}")
    public List<Map<String, String>> getStats(@PathVariable("schema") String schema) {
        LOG.info("Requested schema for {}", schema);

        return app.getSchema(schema);
    }

    @RequestMapping("/rest/schemas")
    public String[] getSchemas() {
        return app.getSchemas();
    }
}
