/**
 * Chuyển đổi một link YouTube (watch, youtu.be)
 * thành link "embed" (nhúng) có thể dùng trong iframe.
 * @param {string} url - Đường dẫn YouTube.
 * @returns {string | null} - Đường dẫn embed hoặc null nếu không hợp lệ.
 */
export const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;

    let videoId = null;

    try {
        // 1. Link chuẩn (ví dụ: https://www.youtube.com/watch?v=dQw4w9WgXcQ)
        if (url.includes('watch?v=')) {
            const urlParams = new URL(url).searchParams;
            videoId = urlParams.get('v');
        } 
        // 2. Link rút gọn (ví dụ: https://youtu.be/dQw4w9WgXcQ)
        else if (url.includes('youtu.be/')) {
            const urlPath = new URL(url).pathname;
            videoId = urlPath.split('/')[1];
        } 
        // 3. Link đã là link nhúng (ví dụ: .../embed/dQw4w9WgXcQ)
        else if (url.includes('/embed/')) {
            const urlPath = new URL(url).pathname;
            videoId = urlPath.split('/embed/')[1];
        }

        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
        
        // Nếu không phải link YouTube hợp lệ
        console.warn("Không thể nhận diện URL YouTube:", url);
        return null;

    } catch (error) {
        console.error("Lỗi khi xử lý URL:", error);
        return null;
    }
};