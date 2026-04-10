package com.moviebooking.movie_service.service;

import com.moviebooking.movie_service.config.FileStorageProperties;
import com.moviebooking.movie_service.exception.AppException;
import com.moviebooking.movie_service.exception.ErrorCode;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FileStorageService {
    FileStorageProperties fileStorageProperties;

    public String uploadFile(MultipartFile file, String category){
        // Kiểm tra đầu vào
        // Tạo tên file mới
        // Lấy đường dẫn lưu trữ vật lý
        // Đảm bảo thư mục tồn tại, tạo thư mục nếu chưa có
        // Sao chép (lưu) file vào ổ đĩa server
        // Trả về URL công khai
        validateFile(file);

        String filename = generateFileName(file);
        Path uploadPath = getUploadPath(category);

        try {
            Files.createDirectories(uploadPath);

            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            log.info("File uploaded successfully: {}", filename);

            return buildFileUrl(category, filename);
        } catch (IOException exception){
            log.error("Could not store file: {}", filename, exception);
            throw new AppException(ErrorCode.FILE_STORAGE_FAILED, exception);
        }
    }

    public void deleteFile(String fileUrl){
        if (fileUrl == null || fileUrl.isEmpty()){
            return;
        }

        try {
            String fileName = extractFileNameFormUrl(fileUrl);
            String category = extractCategoryFromUrl(fileUrl);

            if (fileName == null || category == null ){
                log.warn("Could not extract filename or category from URL: {}", fileUrl);
                return;
            }

            // getUploadPath(category): Lấy đường dẫn gốc của category (ví dụ: C:/project/uploads/movies)
            // .resolve(fileName): Nối tên file vào đường dẫn để dẫn đến file cần xóa (ví dụ: C:/.../hinhdep.png)
            Path filePath = getUploadPath(category).resolve(fileName);
            boolean deleted = Files.deleteIfExists(filePath);

            if (deleted){
                log.info("File deleted successfullt: {}", fileName);
            }
        } catch (IOException exception) {
            log.error("Could not delete file: {}", fileUrl, exception);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_FILE_TYPE);
        }

        String originalFileName = file.getOriginalFilename();
        if (originalFileName != null && originalFileName.contains("..")) {
            throw new AppException(ErrorCode.INVALID_FILE_PATH);
        }

        if (file.getSize() > fileStorageProperties.getMaxSize()) {
            throw new AppException(ErrorCode.FILE_TOO_LARGE);
        }

        String contentType = file.getContentType();
        if (contentType != null && contentType.equals("image/jpg")) {
            contentType = "image/jpeg";
        }

        if (contentType == null || !fileStorageProperties.getAllowedTypes().contains(contentType)) {
            throw new AppException(ErrorCode.INVALID_FILE_TYPE);
        }
    }


    // Tạo tên file dưới dạng UUID + đuôi của file gốc (ví dụ .png)
    private String generateFileName(MultipartFile file){
        // Lấy file gốc từ máy, sau đó "làm sạch" tên file, rồi trả lại một chuỗi an toàn
        // Nhận vào tên file đã clean, sau đó trích xuất phần đuôi
        // Trả về chuỗi UUID + đuôi
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = getFileExtension(originalFileName);
        return UUID.randomUUID().toString() + fileExtension;
    }


    // Hàm lấy phần đuôi của file gốc
    private String getFileExtension(String fileName){
        if (fileName == null){
            return "";
        }

        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex > 0){
            return fileName.substring(dotIndex);
        }
        return "";
    }

    private Path getUploadPath(String category){
        // Lấy thư mục gốc được cấu hình trong file yaml, sau đó nối với thư mục con (categoty)
        // .toAbsolutePath(): chuyển đường dẫn tương đối (như uploads/movies) thành đường dẫn tuyệt đối (C:\MyProject\...)
        // .normalize(): Rất quan trọng cho bảo mật, làm sạch đường dẫn.
        return Paths.get(fileStorageProperties.getDir(), category)
                .toAbsolutePath().normalize();
    }

    private String buildFileUrl(String category, String fileName){
        // ServletUriComponentsBuilder.fromCurrentContextPath(): là công cụ mạnh của Spring để xây dựng URL,
        // nó tự động lấy phần gốc của ứng dụng (ví dụ: http://localhost:8080/api/v1 - bao gồm cả context-path đã cấu hình)
        // .path("/uploads"): nối thêm chỗi uploads, tương tự với category, filename.
        // Cuối cùng .toUristring() là để nối tất cả lại thành một chuỗi URL.
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/" + category + "/" + fileName).toUriString();

    }

    private String extractFileNameFormUrl(String fileUrl){
        // Kiểm tra xem URL có rỗng hay không
        // Tìm vị trí dấu / cuối cùng trong chuỗi URL
        // Kiểm tra xem có dấu / và dấu / không phải là ký tự cuối cùng (nghĩa là sau nó có tên file)
        // Trả về chuỗi con bắt đầu từ vị trí ngay sau dấu / cuối cùng cho đến hết chuỗi
        if (fileUrl == null || fileUrl.isEmpty()){
            return null;
        }
        int lastSlashIndex = fileUrl.lastIndexOf('/');
        if (lastSlashIndex >= 0 && lastSlashIndex < fileUrl.length() - 1){
            return fileUrl.substring(lastSlashIndex + 1);
        }
        return null;
    }

    // Tương tự extractFileNameFormUrl
    private String extractCategoryFromUrl(String fileUrl){
        if (fileUrl == null || !fileUrl.contains("/uploads")){
            return null;
        }

        try {
            String[] parts = fileUrl.split("/uploads");
            if (parts.length > 1){
                String[] categoryParts = parts[1].split("/");
                if (categoryParts.length > 0){
                    return categoryParts[0];
                }
            }
        } catch (Exception e){
            log.error("Error extracting category from URL: {}", fileUrl, e);
        }

        return null;
    }
}
