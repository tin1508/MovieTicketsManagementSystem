// pages/user/HomePage.jsx
import '../../styles/UserLayout.css';
import React, { useState, useEffect } from 'react';
import * as movieService from '../../services/movieService';
import MovieCard from '../../components/movies/MovieCard';
import { Link } from 'react-router-dom';
import HeroBanner from '../../components/common/layout/HeroBanner';
import QuickBookingBar from '../../components/common/QuickBookingBar';

const HomePage = () => {
    const [nowShowingMovies, setNowShowingMovies] = useState([]);
    const [comingSoonMovies, setComingSoonMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Dummy data cho khuyến mãi (Sau này bạn có thể gọi API)
    const promotions = [
        { id: 1, title: "Happy Wednesday - Đồng giá 50k", img: "/logo/t5.jpg" },
        { id: 2, title: "Combo Bắp Nước Khổng Lồ", img: "/logo/uudai.jpg" },
        { id: 3, title: "Ưu đãi thành viên U22", img: "/logo/u22.jpg" }
    ];

    useEffect(() => {
        const fetchAllMovies = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const nowShowingData = await movieService.getAllMovies(0, 10, { movieStatus: 'NOW_SHOWING' });
                setNowShowingMovies(nowShowingData.content || []);

                const comingSoonData = await movieService.getAllMovies(0, 10, { movieStatus: 'COMING_SOON' });
                setComingSoonMovies(comingSoonData.content || []);
            } catch (err) {
                setError('Lỗi khi tải danh sách phim.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllMovies();
    }, []);

    if (isLoading) return (
        // Skeleton Loading đơn giản hoặc Spinner
        <div style={{color: 'white', textAlign: 'center', padding: '50px'}}>Đang tải dữ liệu phim...</div>
    );
    if (error) return <p className="page-error-message">{error}</p>;

    return (
        <div className="homepage-container">
            <HeroBanner />
            
            {/* --- 1. THANH ĐẶT VÉ NHANH (MỚI) --- */}
            <QuickBookingBar /> 
            {/* ---------------------------------- */}

            <section className="movie-section">
                <div className="section-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                    <h2 className="section-title" style={{color: '#ffc107', textTransform: 'uppercase', borderLeft: '5px solid #ffc107', paddingLeft: '10px'}}>
                        Phim Đang Chiếu
                    </h2>
                    <Link to="/phim/dang-chieu" className="view-all-link">
                        Xem tất cả <span>&rarr;</span>
                    </Link>
                </div>
                
                <div className="movie-grid">
                    {nowShowingMovies.slice(0, 4).map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </section>

            <section className="movie-section">
                <div className="section-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', marginTop: '40px'}}>
                    <h2 className="section-title" style={{color: '#ffc107', textTransform: 'uppercase', borderLeft: '5px solid #ffc107', paddingLeft: '10px'}}>
                        Phim Sắp Chiếu
                    </h2>
                    <Link to="/phim/sap-chieu" className="view-all-link">
                        Xem tất cả <span>&rarr;</span>
                    </Link>
                </div>
                <div className="movie-grid">
                    {comingSoonMovies.slice(0, 4).map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </section> 

            {/* --- 2. TIN TỨC & KHUYẾN MÃI (MỚI) --- */}
            {/* --- 2. TIN TỨC & KHUYẾN MÃI --- */}
            <section className="promo-section">
                <h2 style={{color: 'white', marginBottom: '20px', textAlign: 'center'}}>TIN TỨC & ƯU ĐÃI</h2>
                
                <div className="promo-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '25px',
                    padding: '20px 0'
                }}>
                    {promotions.map(promo => (
                        <div key={promo.id} className="promo-card" style={{
                            height: '220px',           
                            borderRadius: '15px',      
                            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                            position: 'relative',      /* Thêm dòng này để giữ layout */
                            overflow: 'hidden'         /* Cắt phần thừa */
                        }}>
                            <img 
                                src={promo.img} 
                                alt={promo.title} 
                                style={{
                                    width: '100% ',
                                    height: '100% ', /* Ép chiều cao */
                                    objectFit: 'cover',   /* Giữ ảnh đẹp không méo */
                                    borderRadius: '15px', /* Bo góc trực tiếp cho ảnh */
                                    display: 'block'
                                }}
                            />
                        </div>
                    ))}
                </div>
            </section>
            
            {/* --- 3. BANNER THÀNH VIÊN (MỚI) --- */}
            <div className="membership-banner">
                <div className="membership-content">
                    <h3>ĐĂNG KÝ THÀNH VIÊN</h3>
                    <p>Tích điểm đổi quà, nhận ưu đãi vé 49k và bắp nước miễn phí!</p>
                </div>
                <Link to="/register">
                    <button className="btn-join">THAM GIA NGAY</button>
                </Link>
            </div>

        </div>
    );
};

export default HomePage;