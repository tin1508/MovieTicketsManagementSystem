# MovieTicketsManagementSystem 🎬
A movie ticket booking management website is designed to handle high-traffic ticket booking, automated scheduling, and real-time payment processing.

## 📌 Table of Contents
- [Key Features](#-features)
- [Tech Stack](#-tech-stack)
- [Technical Deep Dive](#-technical-deep-dive)
- [Getting Started](#-getting-started)
- [License](#-license)

## 🚀 Key Features
* **Real-time Ticket Booking:** Dynamic seat selection with specialized concurrency handling.
* **Automated Scheduling:** Advanced algorithm to map varied movie durations into optimized theater time blocks.
* **Secure Payments:** Integrated automated payment gateway with real-time transaction verification via webhooks.
* **Password Recovery:** Secure "Forgot Password" flow via email using time-sensitive UUID tokens.
* **Role-Based Access Control (RBAC):** Distinct management dashboards for Administrators and a streamlined booking experience for Customers.
* **Performance Optimized:** Efficient data persistence and query optimization for large-scale showtime management.
## 🛠 Tech Stack
### Backend
* **Framework:** Java Spring Boot
* **Security:** Spring Security & JWT (JSON Web Token)
* **Persistence:** Spring Data JPA (Hibernate)
* **Database:** MySQL
### Frontend
* **Framework:** ReactJS + Vite
* **State Management:** React Hooks / Context API
* **Styling:** Tailwind CSS
## 🧠 Technical Deep Dive: Problem Solving

This project serves as a practical application of algorithmic logic and system design principles.

### 1. Seat Holding Algorithm
To solve the "double-booking" problem in high-concurrency environments, the system utilizes a specialized `showtimes_seat` management logic.

#### **State Management via `showtimes_seat` Table**
The system tracks the real-time status of every physical seat per showtime using the following schema:
* **`status`**: Transitions through `AVAILABLE` → `HELD` → `BOOKED`.
* **`hold_by`**: Identifies the user currently reserving the seat to ensure session-exclusive access.
* **`hold_expired_at`**: A timestamp used to implement a "soft-lock" mechanism.

#### **Implementation Logic**
1. **Atomic Check-and-Set**: When a user selects a seat, the backend executes a transaction to update the status to `HELD` only if the current status is `AVAILABLE`. This prevents race conditions.
2. **Temporary Reservations**: Upon holding a seat, the `hold_expired_at` is set (e.g., Current Time + 10m). If the user does not complete the payment, the seat remains locked to others but is not yet sold.
3. **Automated Cleanup**: A background worker (Spring `@Scheduled` task) identifies rows where `hold_expired_at` is in the past and resets the `status` to `AVAILABLE`, releasing the inventory automatically.
4. **Finalization**: On successful webhook notification from the payment gateway, the state is atomically updated to `BOOKED`.

### 2. Ceiling-Based Scheduling System
To maximize theater turnover and maintain a professional screening schedule, I engineered a deterministic scheduling algorithm that standardizes the end time of every movie session.
#### **The Problem: Variable Durations**
Movies have unpredictable lengths (e.g., 112 mins, 137 mins). Without standardization, this leads to "fragmented" gaps between screenings, making it difficult for staff to coordinate cleaning and for customers to predict showtime patterns.
#### **The Solution:**
The system automatically calculates the end time of a showtime using a two-step optimization process:
1. **Intermission & Cleaning Buffer**: The algorithm automatically injects a mandatory 30-minute buffer (duration + 30) after every movie. This ensures guaranteed time for theater cleaning and audience transition.
2. **Standardized 10-Minute Intervals**: To ensure a clean "grid" for the daily schedule, the system applies a Ceiling Rounding logic.
   * If a movie with its buffer ends at a non-standard time (e.g., 14:43), the algorithm rounds it up to the next 10-minute mark (14:50).
   * **Implementation**: Calculated via remainder = minute % 10, then adding 10 - remainder to the time.
  

### 3. Webhook-Based Payment Integration
Integrated the **SePay** payment gateway to automate the confirmation process.
* **Workflow:** The backend exposes a secure REST endpoint (Webhook) to receive real-time notifications from the gateway. Upon a successful "Paid" status, the system instantly upgrades the "Seat Hold" to a "Confirmed Ticket."
## 📋 Getting Started

### Prerequisites
* JDK 17+
* Node.js (v18+)
* MySQL 8.0+
* Maven

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/tin1508/MovieTicketsManagementSystem.git](https://github.com/tin1508/MovieTicketsManagementSystem.git)
    ```

2.  **Backend Configuration**
    * Update `src/main/resources/application.properties` with your MySQL credentials and JWT secret key.
    * Run the application:
        ```bash
        mvn spring-boot:run
        ```

3.  **Frontend Configuration**
    ```bash
    cd [your storage project frontend path on you computer]
    npm install
    npm run dev
    ```

## 👥 Contributors
This project was a collaborative effort by:
* **Nguyen Minh Hoang** 
* **Chu Hong Anh** 
