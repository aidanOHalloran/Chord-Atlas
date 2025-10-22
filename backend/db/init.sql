CREATE DATABASE IF NOT EXISTS chordatlas;
USE chordatlas;

-- SONGS TABLE
CREATE TABLE IF NOT EXISTS songs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  capo_fret INT DEFAULT 0,
  song_key VARCHAR(10),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- CHORDS TABLE
CREATE TABLE IF NOT EXISTS chords (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  frets JSON,
  fingers JSON,
  position INT DEFAULT 0,
  variation INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- LINK TABLE
CREATE TABLE IF NOT EXISTS song_chords (
  id INT AUTO_INCREMENT PRIMARY KEY,
  song_id INT NOT NULL,
  chord_id INT NOT NULL,
  position INT DEFAULT 0,
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
  FOREIGN KEY (chord_id) REFERENCES chords(id) ON DELETE CASCADE
);

-- -- INITIAL CHORDS
-- INSERT INTO chords (name, frets, fingers) VALUES
-- ('C', CAST(JSON_ARRAY(0, 1, 0, 2, 3, "x") AS JSON), CAST(JSON_ARRAY(0, 1, 0, 2, 3, 0) AS JSON)),
-- ('G', CAST(JSON_ARRAY(3, 3, 0, 0, 2, 3) AS JSON), CAST(JSON_ARRAY(4, 3, 0, 0, 1, 2) AS JSON)),
-- ('Am', CAST(JSON_ARRAY(0, 1, 2, 2, 0, "x") AS JSON), CAST(JSON_ARRAY(0, 1, 2, 3, 0, 0) AS JSON)),
-- ('F', CAST(JSON_ARRAY(1, 1, 2, 3, 3, 1) AS JSON), CAST(JSON_ARRAY(1, 1, 2, 3, 4, 1) AS JSON));


-- -- INITIAL SONGS
-- INSERT INTO songs (title, artist, capo_fret, song_key, notes)
-- VALUES
-- ('Let It Be', 'The Beatles', 0, 'C', 'Classic progression, great for beginners.'),
-- ('The Joker', 'Steve Miller Band', 0, 'E Major', 'Very popular acoustic song.');

-- -- SONG-CHORD LINKS
-- INSERT INTO song_chords (song_id, chord_id, position)
-- VALUES
-- (1, 1, 1), -- C
-- (1, 2, 2), -- G
-- (1, 3, 3), -- Am
-- (1, 4, 4), -- F
-- (2, 3, 1), -- Am
-- (2, 2, 2), -- G
-- (2, 4, 3); -- F