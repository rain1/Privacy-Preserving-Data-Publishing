package thesis.ppdp;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.io.File;
import java.io.IOException;
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

    public List<Map<String, String>> addSchema(String name, File content) throws IOException {
        SchemaReader schemaReader = new SchemaReader();
        List<Map<String, String>> schema = schemaReader.readSchema(content);
        schemaManager.add(name, schema);
        return schemaManager.getSchema(name);
    }
}
