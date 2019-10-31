CREATE TABLE transaction (
    pkid INT(11) NOT NULL auto_increment,
    vehicle_id INT NOT NULL,
    client_id INT NOT NULL,
    type ENUM('rental', 'reservation'),
    timestamp DATE NOT NULL,
    start_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    cancel_date DATE,
    PRIMARY KEY (pkid),
    FOREIGN KEY (vehicle_id) REFERENCES vehicle(pkid),
    FOREIGN KEY (client_id) REFERENCES client(pkid)
);

INSERT INTO client (firstname, lastname, driver_license, expiration_date, phone_number) VALUES
("Alice", "Allisson", "A-1111-111111-11", "2021-11-11", "514-555-1111"),
("Bob", "Bissonnette", "B-1111-111111-22", "2022-12-12", "514-555-2222"),
("Carl", "Carlson", "C-1111-111111-33", "2022-02-02", "514-555-3333"),
("Denis", "Drolet", "D-1111-111111-44", "2021-11-11", "514-555-4444"),
("Emma", "Emerson", "E-1111-111111-55", "2025-05-05", "514-555-5555"),
("Frank", "Fitzpatrick", "F-1111-111111-66", "2023-02-22", "514-555-6666"),
("Gina", "Gallagher", "G-1111-111111-77", "2027-11-11", "514-555-7777"),
("Hector", "Henderson", "H-1111-111111-88", "2020-11-18", "514-555-8888"),
("Ian", "Isco", "I-1111-111111-99", "2020-11-18", "514-555-9999"),
("Janice", "Joplin", "J-2222-111111-00", "2022-05-18", "514-444-1111"),
("Kevin", "Klein", "K-3333-111111-33", "2027-08-13", "514-444-2222");

INSERT INTO transaction
(vehicle_id, client_id, type, timestamp, start_date, due_date, return_date, cancel_date)
VALUES
(1, 1, "rental", '2019-10-20', '2019-10-20', '2019-10-30', '2019-10-30', null),
(2, 2, "rental", '2019-10-21', '2019-10-21', '2019-10-31', '2019-10-31', null),
(3, 3, "rental", '2019-10-22', '2019-10-22', '2019-10-31', '2019-10-31', null),
(4, 4, "rental", '2019-10-23', '2019-10-23', '2019-10-30', null, null),
(5, 5, "rental", '2019-10-23', '2019-10-23', '2019-10-27', null, null),
(6, 6, "rental", '2019-10-23', '2019-10-23', '2019-10-25', null, null),
(7, 7, "rental", '2019-10-23', '2019-10-23', '2019-10-28', null, null),
(8, 8, "rental", '2019-10-25', '2019-10-25', '2019-10-31', null, null),
(9, 9, "rental", '2019-10-25', '2019-10-25', '2019-11-03', null, null),
(10, 10, "rental", '2019-10-25', '2019-10-25', '2019-11-04', null, null),
(11, 11, "rental", '2019-10-25', '2019-10-25', '2019-11-05', null, null),
(10, 1, "reservation", '2019-11-11', '2019-11-16', '2019-11-20', '2019-11-20', null),
(11, 2, "reservation", '2019-11-12', '2019-11-16', '2019-11-20', '2019-11-20', null),
(12, 3, "reservation", '2019-11-13', '2019-11-16', '2019-11-20', null, null),
(13, 4, "reservation", '2019-11-14', '2019-11-16', '2019-11-20', null, null),
(14, 5, "reservation", '2019-11-15', '2019-11-16', '2019-11-20', null, null),
(15, 6, "reservation", '2019-11-16', '2019-11-20', '2019-11-25', null, null),
(16, 7, "reservation", '2019-11-17', '2019-11-20', '2019-11-25', null, '2019-11-18'),
(17, 8, "reservation", '2019-11-18', '2019-11-20', '2019-11-25', null, null),
(18, 9, "reservation", '2019-11-19', '2019-11-30', '2019-12-05', null, '2019-11-25'),
(19, 10, "reservation", '2019-11-20', '2019-11-30', '2019-12-20', null, null),
(20, 11, "reservation", '2019-11-21', '2019-11-30', '2019-12-20', null, null);
