DROP DATABASE IF EXISTS soundcloud;
CREATE DATABASE soundcloud;

\c soundcloud;

CREATE TABLE IF NOT EXISTS song(
  song_id SERIAL PRIMARY KEY,
  band_id SERIAL,
  band_name VARCHAR(255),
  band_description VARCHAR(2555)
);

-- psql -U postgres < database/schema.sql
