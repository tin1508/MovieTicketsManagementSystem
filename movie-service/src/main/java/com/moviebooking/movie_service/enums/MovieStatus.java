package com.moviebooking.movie_service.enums;

import lombok.Getter;

@Getter
public enum MovieStatus {
    COMING_SOON("Sắp chiếu"),
    NOW_SHOWING("Đang chiếu"),
    ENDED("Đã kết thúc");

    // 4. Thêm field
    private final String displayName;

    // 5. Thêm constructor
    MovieStatus(String displayName) {
        this.displayName = displayName;
    }
}
