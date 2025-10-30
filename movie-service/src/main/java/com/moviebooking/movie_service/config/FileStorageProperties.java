package com.moviebooking.movie_service.config;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties(prefix = "file.upload")
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FileStorageProperties {
    String dir;
    Long maxSize;
    List<String> allowedTypes;
}
