-- SQLite

-- CREATE TABLE flights (
--     id INTEGER PRIMARY KEY,
--     origin VARCHAR(255) NOT NULL,
--     destination VARCHAR(255) NOT NULL,
--     duration_in_minutes INTEGER NOT NULL
-- );

-- INSERT INTO flights (origin, destination, duration_in_minutes) VALUES ('New York', 'London', 415);
-- INSERT INTO flights (origin, destination, duration_in_minutes) VALUES ('Shanghai', 'Paris', 415);
-- INSERT INTO flights (origin, destination, duration_in_minutes) VALUES ('Istanbul', 'Tokyo', 415);
-- INSERT INTO flights (origin, destination, duration_in_minutes) VALUES ('New York', 'Paris', 415);
-- INSERT INTO flights (origin, destination, duration_in_minutes) VALUES ('Pakistan', 'London', 415);

-- UPDATE flights
--     SET duration_in_minutes = 430
--     WHERE origin = 'New York'
--     AND destination = 'London';

-- SELECT * FROM flights;

SELECT * FROM flights;

SELECT * FROM flights ORDER BY duration_in_minutes ASC;

-- Grouping and Conditional

SELECT origin, COUNT(*) FROM flights
    GROUP BY origin
    HAVING COUNT(*) > 1;

-- CREATE TABLE passengers (
--     id INTEGER PRIMARY KEY,
--     firstname VARCHAR(255) NOT NULL,
--     surname VARCHAR(255) NOT NULL,
--     flight_id INTEGER REFERENCES flights
-- );

-- INSERT INTO passengers (firstname, surname, flight_id)
--     VALUES ('Majid', 'Hussain', 1);

-- INSERT INTO passengers (firstname, surname, flight_id)
--     VALUES ('David', 'Millan', 2);

-- INSERT INTO passengers (firstname, surname, flight_id)
--     VALUES ('Brian', 'Thr', 3);

-- INSERT INTO passengers (firstname, surname, flight_id)
--     VALUES ('David', 'Percell', 1);

SELECT * from flights;

SELECT origin, destination, duration_in_minutes, COUNT(flights.id) FROM flights LEFT JOIN passengers ON flights.id = passengers.flight_id
    GROUP BY flights.id;


SELECT * FROM passengers;

-- Nested Queries
SELECT origin, destination, id FROM flights WHERE id IN
    -- Group all passenger by flight id, then get each group which have more than 1 entry
    (SELECT flight_id FROM passengers GROUP BY flight_id HAVING COUNT(*) > 1);

-- SQL Injection

SELECT COUNT(*) FROM users WHERE username = 'x' AND password = 'y'

-- Race conditions 
-- Transactions (locking database)

-- BEGIN
-- Query Here
-- COMMIT
