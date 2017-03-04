package thesis.ppdp;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;
import java.util.Map;

@ConfigurationProperties
public class PPDPController {
    SchemaManager schemaManager;

    public PPDPController() {
        this.schemaManager = new SchemaManager();
    }

    public String[] getSchemas() {
        return schemaManager.getSchemaNames();
    }


    public List<Map<String, String>> getSchema(String name) {
        return schemaManager.getSchema(name);
    }
}
