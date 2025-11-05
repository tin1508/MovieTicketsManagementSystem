create database if not exists cinema;

use cinema;

-- create table booking-- 
create table bookings(
	id varchar(255) not null,
    user_id varchar(255) default null,
    showtime_id varchar(255) default null,
    booking_code varchar(100) default null,
    booking_date datetime default null,
    org_price decimal(10, 2) default null,
    total_price decimal(10, 2) default null,
    status enum('PENDING', 'CONFIRMED', 'CANCELLED') not null default 'PENDING',
    
    constraint pk_bookings primary key(id)
);
-- create table payments--
create table payments( 
	id varchar(255) not null,
    booking_id varchar(255) not null,
    transaction_id varchar(255) unique not null,
    payment_method enum('BANK_TRANSFER') default null,
    payment_status enum('PENDING', 'SUCCESSFUL', 'FAILED') default null,
    amount decimal(10, 2) default null, #số tiền thử thanh toán
    created_at datetime default null, #thời gian tạo thanh toán
    process_at datetime default null, #thời gian thanh toán thành hoặc thất bại
    constraint pk_payments primary key(id),
    constraint fk_booking_id foreign key(booking_id)
    references bookings(id)
);
-- create table showtime_seats --
create table showtime_seats(
	id varchar(255) not null,
    showtime_id varchar(255) default null,
    seat_id varchar(255) default null,
    status enum('AVAILABLE', 'HELD', 'BOOKED') default null,
    constraint pk_showtime_seats primary key(id)
);
-- create table booking_details --
create table booking_details(
	id varchar(255) not null,
    booking_id varchar(255) not null,
    showtime_seat_id varchar(255) not null,
    constraint pk_booking_details primary key(id),
    constraint fk_booking_id_details foreign key(booking_id)
    references bookings(id)
);
-- edit --
alter table bookings add unique (booking_code);
alter table bookings drop column org_price;
alter table bookings add ticket_quantity int;
alter table bookings add expire_at datetime default null;
alter table bookings modify column status enum('PENDING', 'CONFIRMED', 'CANCELLED') default 'PENDING';
alter table showtime_seats modify status enum('AVAILABLE', 'HOLD', 'BOOKED') default null;
alter table payments add qr_bank_url varchar(255) default null;
alter table payments add payment_method enum('BANK_TRANSFER') default null;




