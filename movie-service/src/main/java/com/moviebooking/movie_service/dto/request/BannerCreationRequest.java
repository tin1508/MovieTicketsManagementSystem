package com.moviebooking.movie_service.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BannerCreationRequest {
    @NotEmpty
    String title;
    String targetUrl;
    Integer displayOrder;
}
