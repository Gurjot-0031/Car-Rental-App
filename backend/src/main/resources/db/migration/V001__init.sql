# noinspection SqlNoDataSourceInspectionForFile

CREATE TABLE user (
    pkid INT(11) NOT NULL auto_increment,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255),
    role VARCHAR(255) NOT NULL,
    PRIMARY KEY (pkid),
    CONSTRAINT UC_username UNIQUE (username)
);

CREATE TABLE vehicle (
    pkid INT(11) NOT NULL auto_increment,
    type VARCHAR(255) NOT NULL,
    make VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    year YEAR NOT NULL,
    color VARCHAR(255) NOT NULL,
    license VARCHAR(7) NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (pkid),
    CONSTRAINT VC_license UNIQUE (license)
);

CREATE TABLE client (
    pkid INT(11) NOT NULL auto_increment,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    driver_license VARCHAR(16) NOT NULL,
    expiration_date DATE NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (pkid),
    CONSTRAINT CC_driver_license UNIQUE (driver_license)
);
