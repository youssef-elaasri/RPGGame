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


-- Create the completed stages table
CREATE TABLE completed_stages (
                      user_id INT,
                      map_id INT,
                      PRIMARY KEY (user_id, map_id),
                      FOREIGN KEY (user_id) REFERENCES users(user_id),
                      FOREIGN KEY (map_id) REFERENCES maps(map_id),
                      completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the savings table
CREATE TABLE saved_games (
                     user_id INT,
                     map_id INT,
                     player_x INT,
                     player_y INT,
                     FOREIGN KEY (user_id) REFERENCES users(user_id),
                     FOREIGN KEY (map_id) REFERENCES maps(map_id),
                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                     primary key(user_id, created_at)
);

