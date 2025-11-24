import React from 'react';
// Import CSS (chúng ta sẽ tạo ở Bước 3)
import '../../styles/AboutPage.css'; 

const AboutPage = () => {
  return (
    // 1. Tái sử dụng class .homepage-container (từ UserLayout.css)
    //    để căn giữa nội dung và có nền tối
    <div className="homepage-container">
      
      {/* 2. Tái sử dụng class .movie-section (từ UserLayout.css) 
          để có tiêu đề gạch chân vàng */}
      <section className="movie-section">
        <h2>Về Ú-Film</h2>
      </section>

      {/* 3. Đây là nội dung mới của trang "Giới thiệu" */}
      <div className="about-content">
        <p>Chào mừng bạn đến với Ú-Film, nơi trải nghiệm điện ảnh của bạn được đưa lên hàng đầu. Sứ mệnh của chúng tôi là mang đến cho bạn cách thức đơn giản, nhanh chóng và tiện lợi nhất để khám phá và đặt vé những bộ phim hot nhất.</p>
        
        <h3>Sứ mệnh của chúng tôi</h3>
        <p>Chúng tôi tin rằng điện ảnh là một nghệ thuật kỳ diệu có khả năng kết nối mọi người. Ú-Film được xây dựng trên nền tảng đam mê, với mong muốn loại bỏ mọi rào cản giúp bạn tiếp cận với những tác phẩm tuyệt vời.</p>

        <h3>Đội ngũ (Our Team)</h3>
        <div className="team-grid">
          <div className="team-member">
            {/* Bạn có thể thêm ảnh sau */}
            <h4>Chu Hồng Anh</h4>
            <p>Nhà sáng lập & CEO</p>
          </div>
          <div className="team-member">
            <h4>Đồng đội A</h4>
            <p>Trưởng phòng Phát triển</p>
          </div>
          <div className="team-member">
            <h4>Đồng đội B</h4>
            <p>Trưởng phòng Marketing</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;