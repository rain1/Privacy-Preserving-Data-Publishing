package thesis.controller;

import lombok.SneakyThrows;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import thesis.ppdp.PPDPController;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.List;
import java.util.Map;


@RestController
public class ApplicationController {
    private static final Logger LOG = LoggerFactory.getLogger(ApplicationController.class);

    public PPDPController app;

    ApplicationController() {
        app = new PPDPController();
    }

    @RequestMapping("/rest/schema/{schema:.+}")
    public List<Map<String, String>> getStats(@PathVariable("schema") String schema) {
        LOG.info("Requested schema for {}", schema);
        return app.getSchema(schema);
    }

    @RequestMapping("/rest/schemas")
    public String[] getSchemas() {
        return app.getSchemas();
    }

    //http://stackoverflow.com/questions/24339990/how-to-convert-a-multipart-file-to-file
    @SneakyThrows
    public File convert(MultipartFile file)
    {
        File convFile = new File(file.getOriginalFilename());
        convFile.createNewFile();
        FileOutputStream fileOutputStream = new FileOutputStream(convFile);
        fileOutputStream.write(file.getBytes());
        fileOutputStream.close();
        return convFile;
    }

    @SneakyThrows
    public List<Map<String, String>> handleUploadedFile(@RequestParam("file") MultipartFile multipartFile) {
        String name = multipartFile.getOriginalFilename();
        if(!FilenameUtils.getExtension(name).toLowerCase().equals("csv")){
            LOG.warn("Non-CSV file was uploaded");
            return null;
        }
        List<Map<String, String>> addedSchema = null;
        File file = convert(multipartFile);
        InputStream targetStream = new FileInputStream(file);
        try {
            addedSchema = app.addSchema(name, targetStream);
        } catch (Exception e) {
            LOG.error("Upload failed", e);
        }
        return addedSchema;
    }

    @SneakyThrows
    @PostMapping("/rest/schema/add")
    public List<Map<String, String>> addFile(@RequestParam("file") MultipartFile multipartFile) {
        return handleUploadedFile(multipartFile);
    }

    @SneakyThrows
    @PostMapping("/rest/schema/addfallback")
    public String addFileFallback(@RequestParam("file") MultipartFile multipartFile) {
        if(handleUploadedFile(multipartFile) == null) {
            return "Upload failed.";
        }else{
            return "Upload succeeded.<br>Click <a href='/'>here</a> to go back";
        }
    }
}
