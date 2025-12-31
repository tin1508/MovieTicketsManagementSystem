package com.moviebooking.movie_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Collections;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PageResponse<T> {
    int currentPage;    // Trang hiện tại
    int totalPages;     // Tổng số trang
    int pageSize;       // Số phần tử trên 1 trang
    long totalElements; // Tổng số phần tử trong database

    @Builder.Default
    List<T> data = Collections.emptyList(); // Danh sách dữ liệu (User, Phim...)
}