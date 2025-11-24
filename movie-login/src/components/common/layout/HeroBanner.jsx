// components/layout/HeroBanner.jsx
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import * as bannerService from '../../../services/bannerService'; // 1. Import service
import '../../../styles/HeroBanner.css';

// Component con: Tự động chọn loại Link (Nội bộ hoặc Link ngoài)
const SlideItem = ({ slide }) => {
    const isExternalLink = slide.targetUrl.startsWith('http');

    const content = (
        <img 
            src={slide.imageUrl} 
            alt={slide.title} 
            // Thêm xử lý lỗi nếu ảnh không tải được
            onError={(e) => {e.target.src = 'https://placehold.co/1920x800?text=No+Image'}}
        />
    );

    if (isExternalLink) {
        // Nếu là link ngoài (Facebook, Youtube...), mở tab mới
        return (
            <a href={slide.targetUrl} target="_blank" rel="noopener noreferrer">
                {content}
            </a>
        );
    }

    // Nếu là link nội bộ (Trang phim, Giới thiệu...)
    return (
        <Link to={slide.targetUrl}>
            {content}
        </Link>
    );
};

const HeroBanner = () => {
    const [banners, setBanners] = useState([]);

    // 2. Gọi API lấy danh sách banner thật
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const data = await bannerService.getAllBanners();
                // Sắp xếp banner theo thứ tự (displayOrder) nếu backend chưa sắp xếp
                const sortedBanners = (data || []).sort((a, b) => a.displayOrder - b.displayOrder);
                setBanners(sortedBanners);
            } catch (error) {
                console.error("Lỗi khi tải banner:", error);
            }
        };
        fetchBanners();
    }, []);

    // Cấu hình Slider
    const settings = {
        dots: true,
        infinite: true,
        speed: 800,           // Tốc độ trượt mượt hơn chút
        slidesToShow: 1,      // Hiện 1 ảnh
        slidesToScroll: 1,
        autoplay: true,       // Tự động chạy
        autoplaySpeed: 5000,  // 5 giây đổi 1 lần
        pauseOnHover: true,
        arrows: true,         // Hiện mũi tên
    };

    // Nếu không có banner nào, không hiển thị gì cả (hoặc hiển thị ảnh mặc định)
    if (banners.length === 0) {
        return null; 
    }

    return (
        <div className="hero-banner-container full-width">
            {/* Nếu chỉ có 1 banner thì không cần Slider, hiển thị luôn cho đỡ lỗi */}
            {banners.length === 1 ? (
                <div className="hero-slide full-width-slide">
                    <SlideItem slide={banners[0]} />
                </div>
            ) : (
                <Slider {...settings}>
                    {banners.map(banner => (
                        <div key={banner.id} className="hero-slide full-width-slide">
                            <SlideItem slide={banner} />
                        </div>
                    ))}
                </Slider>
            )}
        </div>
    );
};

export default HeroBanner;