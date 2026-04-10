package com.moviebooking.movie_service.controller;

import com.moviebooking.movie_service.dto.request.BannerCreationRequest;
import com.moviebooking.movie_service.dto.response.ApiResponse;
import com.moviebooking.movie_service.entity.Banner;
import com.moviebooking.movie_service.service.BannerService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/banners")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BannerController {
    BannerService bannerService;

    @GetMapping
    public ApiResponse<List<Banner>> getAllBanners(){
        return ApiResponse.<List<Banner>>builder()
                .result(bannerService.getAllBanners())
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteBanners(@PathVariable Long id){
        bannerService.deleteBanner(id);
        return ApiResponse.<String>builder()
                .result("Banner has been deleted")
                .build();
    }

    @PostMapping
    public ApiResponse<Banner> createBanne(
            @ModelAttribute @Valid BannerCreationRequest request,
            @RequestParam("file")MultipartFile file
            ) {
        Banner banner = bannerService.createBanner(request, file);
        return ApiResponse.<Banner>builder()
                .result(banner)
                .build();
    }

}
