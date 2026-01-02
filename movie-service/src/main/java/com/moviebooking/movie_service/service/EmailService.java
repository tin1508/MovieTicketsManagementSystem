package com.moviebooking.movie_service.service;

import com.moviebooking.movie_service.entity.Booking;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Service
public class EmailService {
    @Autowired
    JavaMailSender mailSender;

    @Async
    public void sendBookingConfirmation(String toEmail, Booking booking){
        String subject = "Xác nhận đặt vé thành công - Mã: " + booking.getBookingCode();

        String seatNames = getSeatList(booking);

        String htmlContent = "<h3>Cảm ơn bạn đã đặt vé tại HcmusBooking!</h3>"
                + "<p>Xin chào <b> " + booking.getUser().getLastName() + "</b>, </p>"
                + "<p>Vé của bạn đã được xác nhận thành công.</p>"
                + "<ul>"
                + "<li><b>Phim: </b>" + booking.getShowtimes().getMovie().getTitle() + "</li>"
                + "<li><b>Rạp: </b>" + booking.getShowtimes().getRoom().getCinema().getName() + "</li>"
                + "<li><b>Phòng: </b>" + booking.getShowtimes().getRoom().getName() + "</li>"
                + "<li><b> Ngày chiếu: </b>" + booking.getShowtimes().getShowtimesDate() + "</li>"
                + "<li><b>Suất chiếu: </b>" + booking.getShowtimes().getStartTime() + "</li>"

                + "<li><b>Ghế:" + seatNames + "</li>"
                + "<li><b>Tổng tiền:" + String.format("%,.0f", booking.getTotalPrice()) + " đ</li>"
                + "<p>Vui lòng đưa mã vé <b>" + booking.getBookingCode() + "</b> cho nhân viên khi đến rạp.<p>"
                + "<p>Chúc các bạn xem phim vui vẻ!<p>";

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("Email sent successfully to " + toEmail);

        } catch (MessagingException exception){
            exception.printStackTrace();
        }
    }

    private String getSeatList(Booking booking){
        if(booking.getBookingDetails() == null) return "N/A";
        return booking.getBookingDetails().stream()
                .map(detail -> {
                    return detail.getShowtimeSeat().getSeat().getSeatName();
                })
                .reduce((a, b) -> a + ", " + b)
                .orElse("N/A");
    }

}
