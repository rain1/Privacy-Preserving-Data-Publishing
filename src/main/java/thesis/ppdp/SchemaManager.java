package thesis.ppdp;

import lombok.SneakyThrows;
import org.apache.commons.io.FilenameUtils;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class SchemaManager {
    public Map<String, List<Map<String, String>>> schemas = new HashMap<String, List<Map<String, String>>>();

    @SneakyThrows
    SchemaManager(){
        SchemaReader schemaReader = new SchemaReader();
        for (File schema : schemaReader.getSchemas()) {
            String fileName = schema.getName();
            fileName = FilenameUtils.removeExtension(fileName);
            List<Map<String, String>> content = schemaReader.readSchema(schema);
            schemas.put(fileName, content);
        }
    }

    public void add(String name, List<Map<String, String>> content){
        schemas.put(name, content);
    }

    public String[] getSchemaNames(){
        Set<String> keys = schemas.keySet();
        return keys.toArray(new String[keys.size()]);
    }

    public List<Map<String, String>> getSchema(String name) {
        return schemas.get(name);
    }


}
