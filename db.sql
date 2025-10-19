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

alter table bookings add unique (booking_code);
alter table bookings modify column status enum('PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED') default 'PENDING';

