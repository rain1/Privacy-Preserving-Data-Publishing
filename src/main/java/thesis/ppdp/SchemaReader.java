package thesis.ppdp;

import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import lombok.SneakyThrows;

import java.io.*;
import java.net.URL;
import java.security.CodeSource;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class SchemaReader {
    List<String> schemas = new ArrayList<String>();

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


    @SneakyThrows
    void getSchemasFromJar(){
        CodeSource codeSource = SchemaReader.class.getProtectionDomain().getCodeSource();
        if (codeSource != null) {
            URL jar = codeSource.getLocation();
            ZipInputStream zip = new ZipInputStream(jar.openStream());
            while(true) {
                ZipEntry e = zip.getNextEntry();
                if (e == null)
                    break;
                String name = e.getName();
                if(name.contains("schema") && name.substring(name.length() - 4).equals(".csv")) {
                    File file = new File(name);
                    String fileName = file.getName();
                    System.out.println(fileName);
                    schemas.add(fileName);
                }
            }
        }
    }

    void getSchemasFromDir(){
        List<String> resources = getResourceFiles("schema");
        for (String resource : resources) {
            System.out.println(resource);
            if(resource.substring(resource.length() - 4).equals(".csv")) {
                schemas.add(resource);
            }
        }
    }

    SchemaReader() {
        URL dirURL = SchemaReader.class.getResource("/");
        if(dirURL.getProtocol().equals("jar")){
            getSchemasFromJar();
        }else{
            getSchemasFromDir();
        }
    }


    public List<Map<String, String>> readSchema(String fileName) throws IOException {
        CsvSchema bootstrap = CsvSchema.emptySchema().withHeader();
        CsvMapper csvMapper = new CsvMapper();
        InputStream stream=getClass().getClassLoader().getResourceAsStream("schema/"+fileName);
        MappingIterator<Map<String, String>> mappingIterator = csvMapper.reader(Map.class).with(bootstrap).readValues(stream);
        return mappingIterator.readAll();
    }

    public List<Map<String, String>> readSchema(InputStream content) throws IOException {
        CsvSchema bootstrap = CsvSchema.emptySchema().withHeader();
        CsvMapper csvMapper = new CsvMapper();
        MappingIterator<Map<String, String>> mappingIterator = csvMapper.reader(Map.class).with(bootstrap).readValues(content);
        return mappingIterator.readAll();
    }

    public List<String> getSchemas() {
        return this.schemas;
    }


}
