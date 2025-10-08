CREATE DATABASE IF NOT EXISTS chordatlas;
USE chordatlas;

-- SONGS TABLE
CREATE TABLE IF NOT EXISTS songs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
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

-- INITIAL CHORDS
INSERT INTO chords (name, frets, fingers) VALUES
('C', JSON_ARRAY(0,1,0,2,3,'x'), JSON_ARRAY(0,1,0,2,3,0)),
('G', JSON_ARRAY(3,3,0,0,2,3), JSON_ARRAY(4,3,0,0,1,2)),
('Am', JSON_ARRAY(0,1,2,2,0,'x'), JSON_ARRAY(0,1,2,3,0,0)),
('F', JSON_ARRAY(1,1,2,3,3,1), JSON_ARRAY(1,1,2,3,4,1));

-- INITIAL SONGS
INSERT INTO songs (title, artist, song_key, notes)
VALUES
('Let It Be', 'The Beatles', 'C', 'Classic progression, great for beginners.'),
('Wonderwall', 'Oasis', 'Em', 'Capo 2; very popular acoustic song.');

-- SONG-CHORD LINKS
INSERT INTO song_chords (song_id, chord_id, position)
VALUES
(1, 1, 1), -- C
(1, 2, 2), -- G
(1, 3, 3), -- Am
(1, 4, 4), -- F
(2, 3, 1), -- Am
(2, 2, 2), -- G
(2, 4, 3); -- F