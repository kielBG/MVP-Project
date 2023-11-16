CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    password VARCHAR(20) NOT NULL CHECK (LENGTH(password) > 4 AND LENGTH(password) <= 20),
    edit_all_permission BOOLEAN
);


CREATE TABLE songs (
    id SERIAL PRIMARY KEY,
    song_title VARCHAR(100) NOT NULL,
    band_name VARCHAR(50) NOT NULL,
    genre VARCHAR(50) NOT NULL,
    song_quote VARCHAR(150),
    recommend_why VARCHAR(200) NOT NULL,
    user_id INT REFERENCES users(id)
);