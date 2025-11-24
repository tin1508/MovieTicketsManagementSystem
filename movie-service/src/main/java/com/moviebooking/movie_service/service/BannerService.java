package com.moviebooking.movie_service.service;

import com.moviebooking.movie_service.dto.request.BannerCreationRequest;
import com.moviebooking.movie_service.entity.Banner;
import com.moviebooking.movie_service.mapper.BannerMapper;
import com.moviebooking.movie_service.repository.BannerRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BannerService {
    BannerRepository bannerRepository;
    FileStorageService fileStorageService;
    BannerMapper bannerMapper;

    public List<Banner> getAllBanners(){
        return bannerRepository.findAllByOrderByDisplayOrderAsc();
    }

    public void deleteBanner(Long id){
        bannerRepository.deleteById(id);
    }

    public Banner createBanner(BannerCreationRequest request, MultipartFile multipartFile){
        Banner banner = bannerMapper.toBanner(request);

        String fileUrl = fileStorageService.uploadFile(multipartFile, "banners");
        banner.setImageUrl(fileUrl);

        return bannerRepository.save(banner);
    }
}
