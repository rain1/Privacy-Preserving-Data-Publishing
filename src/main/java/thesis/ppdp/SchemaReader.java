package thesis.ppdp;

import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import lombok.SneakyThrows;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class SchemaReader {
    List<File> schemas = new ArrayList<File>();

    //http://stackoverflow.com/questions/3923129/get-a-list-of-resources-from-classpath-directory
    @SneakyThrows
    private List<String> getResourceFiles(String path){
        List<String> filenames = new ArrayList<>();

            InputStream in = getResourceAsStream(path);
            BufferedReader br = new BufferedReader(new InputStreamReader(in));
            String resource;

            while ((resource = br.readLine()) != null) {
                filenames.add(resource);
            }

        return filenames;
    }

    private InputStream getResourceAsStream(String resource) {
        final InputStream in = getContextClassLoader().getResourceAsStream(resource);

        return in == null ? getClass().getResourceAsStream(resource) : in;
    }

    private ClassLoader getContextClassLoader() {
        return Thread.currentThread().getContextClassLoader();
    }

    SchemaReader() {
        List<String> resources = getResourceFiles("schema");
        ClassLoader classLoader = getClass().getClassLoader();
        for (String resource : resources) {
            if(resource.substring(resource.length() - 4).equals(".csv")) {
                File file = new File(classLoader.getResource("schema/" + resource).getFile());
                schemas.add(file);
            }
        }
    }

    public List<Map<String, String>> readSchema(File file) throws IOException {
        CsvSchema bootstrap = CsvSchema.emptySchema().withHeader();
        CsvMapper csvMapper = new CsvMapper();
        MappingIterator<Map<String, String>> mappingIterator = csvMapper.reader(Map.class).with(bootstrap).readValues(file);
        return mappingIterator.readAll();
    }

    public List<File> getSchemas() {
        return this.schemas;
    }


}
