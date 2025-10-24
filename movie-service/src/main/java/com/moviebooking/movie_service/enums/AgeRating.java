package com.moviebooking.movie_service.enums;

import lombok.Getter;

@Getter
public enum AgeRating {
    P("Phim được phép phổ biến đến mọi lứa tuổi"),
    K("Phim được phổ biến dưới 13 tuổi (K) nhưng cần cha mẹ hoặc người giám hộ xem cùng"),
    T13("Phim cấm phổ biến đến khán giả dưới 13 tuổi (T13)"),
    T16("Phim cấm phổ biến đến khán giả dưới 16 tuổi (T16)"),
    T18("Phim cấm phổ biến đến khán giả dưới 18 tuổi (T18)");

    private final String description;

    AgeRating(String description){
        this.description = description;
    }


}
