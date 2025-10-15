CREATE TABLE movie
(
    id            VARCHAR(255) NOT NULL,
    title         VARCHAR(255) NULL,
    `description` VARCHAR(255) NULL,
    duration      INT          NULL,
    rating        DOUBLE       NULL,
    release_date  date         NULL,
    poster_url    VARCHAR(255) NULL,
    trailer_url   VARCHAR(255) NULL,
    CONSTRAINT pk_movie PRIMARY KEY (id)
);