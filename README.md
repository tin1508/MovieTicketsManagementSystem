# MovieTicketsManagementSystem 🎬
A website will serve users in booking movie ticket the most conveniently. 

## 📌 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Usage](#-usage)
- [Contributing](#-contributing)

## ✨ Features
- Admin Dashboard:
  + Full CRUD operations for movies, showtimes, rooms, genres.
  + Vieww users' list (lock and unlock user account), bookings' list.
  + View total booking ticket and revenue(filter top 5 hottest movies based on their revenue).
- User Authentication:
  + Secure login/signup for both Customers and Administrators
  + Customers can also view their paid booking.
  + Enhance security by changing password through verifying customers' email.
- Ticket Booking:
  + Secure booking flow with automated price calculation.
  + Hold seats help users not worry about losing their desired seats.
- Payment:
  + Integrate SePay to confirm payment automatically. It reduces waitting time of customers when they're booking.
  + Receive online tickets after booking by users' email to avoid checking in at the theater.

## 🛠 Tech Stack
- Frontend: ReactJS + Vite
- Backend: Java Spring Boot 
- Database: MySQL
- Integration: SePay API, SMTP (Email Service)
- Tools: Maven, Git, Docker
