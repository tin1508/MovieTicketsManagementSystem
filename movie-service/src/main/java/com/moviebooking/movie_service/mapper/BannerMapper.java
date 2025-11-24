package com.moviebooking.movie_service.mapper;

import com.moviebooking.movie_service.dto.request.BannerCreationRequest;
import com.moviebooking.movie_service.entity.Banner;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BannerMapper {
    Banner toBanner(BannerCreationRequest request);
}
