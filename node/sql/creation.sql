/*
    Created : 25/03/2024
    Description : This file contains the commands that help create the tables. It is mainly used for local programming.
*/

-- Choose DataBase
USE INP_Legends;

-- Create the users table
CREATE TABLE users (
                       user_id INT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(255) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the maps table
CREATE TABLE maps (
                      map_id INT AUTO_INCREMENT PRIMARY KEY,
                      map_name VARCHAR(255) NOT NULL UNIQUE,
                      description TEXT
);

-- Insert TestRoom map
INSERT INTO maps (map_name) VALUES ('TestRoom');

-- Insert kitchen map
INSERT INTO maps (map_name) VALUES ('kitchen');


-- Create the savings table
CREATE TABLE completed_stages (
                     user_id INT,
                     flag VARCHAR(50),
                     primary key(user_id, flag)
);

