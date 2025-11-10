-- =====================================================================
-- CHORD ATLAS: INITIAL DATABASE SEED (with chord timeline support)
-- =====================================================================

CREATE DATABASE IF NOT EXISTS chordatlas;
USE chordatlas;

-- ---------------------------------------------------------------------
-- DROP & RECREATE TABLES
-- ---------------------------------------------------------------------

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS chord_timeline;
DROP TABLE IF EXISTS song_chords;
DROP TABLE IF EXISTS chords;
DROP TABLE IF EXISTS songs;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- SONGS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS songs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  capo_fret INT DEFAULT 0,
  song_key VARCHAR(10),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  spotify_uri VARCHAR(100);
);

-- ---------------------------------------------------------------------
-- CHORDS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chords (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  frets JSON,
  fingers JSON,
  position INT DEFAULT 0,
  variation INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- SONG_CHORDS (link table)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS song_chords (
  id INT AUTO_INCREMENT PRIMARY KEY,
  song_id INT NOT NULL,
  chord_id INT NOT NULL,
  position INT DEFAULT 0,
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
  FOREIGN KEY (chord_id) REFERENCES chords(id) ON DELETE CASCADE
);


-- ---------------------------------------------------------------------
-- SONG_CHORD_PROGRESSIONS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS song_chord_progressions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  song_id INT NOT NULL,
  progression_name VARCHAR(100) NOT NULL,
  chord_ids JSON NOT NULL,     -- just array of chord IDs in order
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- CHORD_TIMELINE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chord_timeline (
  id INT AUTO_INCREMENT PRIMARY KEY,
  song_id INT NOT NULL,
  chord_name VARCHAR(10) NOT NULL,
  start_time DECIMAL(6,2) NOT NULL, -- in seconds, from start of song
  end_time DECIMAL(6,2) NOT NULL, -- in seconds, from start of song
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- SEED DATA
-- ---------------------------------------------------------------------

-- CHORDS ---------------------------------------------------------------
INSERT INTO chords (name, frets, fingers, position, variation)
VALUES
('C',  JSON_ARRAY(0,3,2,0,1,0),   JSON_ARRAY(0,3,2,0,3,0),   1, 1),
('G',  JSON_ARRAY(3,2,0,0,3,3),   JSON_ARRAY(2,1,0,0,3,4),   1, 1),
('D',  JSON_ARRAY(0,0,0,2,3,2),   JSON_ARRAY(0,0,0,1,3,2),   1, 1),
('A',  JSON_ARRAY(0,0,2,2,2,0),   JSON_ARRAY(0,0,1,2,3,0),   1, 1),
('E',  JSON_ARRAY(0,2,2,1,0,0),   JSON_ARRAY(0,2,3,1,0,0),   1, 1),
('F',  JSON_ARRAY(1,3,3,2,1,1),   JSON_ARRAY(1,3,4,2,1,1),   1, 2),
('Bm', JSON_ARRAY(NULL,2,4,4,3,2),JSON_ARRAY(NULL,1,3,4,2,1),2, 1),
('Cm', JSON_ARRAY(NULL,3,5,5,4,3),JSON_ARRAY(NULL,1,3,4,2,1),3, 1),
('Em', JSON_ARRAY(0,2,2,0,0,0),   JSON_ARRAY(0,2,3,0,0,0),   1, 1),
('Am', JSON_ARRAY(0,0,2,2,1,0),   JSON_ARRAY(0,0,2,3,1,0),   1, 1),
('A7sus4', JSON_ARRAY(0,0,2,0,3,0), JSON_ARRAY(0,0,2,0,3,0), 1, 1),
('F#m', JSON_ARRAY(2,4,4,2,2,2), JSON_ARRAY(1,3,4,1,1,1), 2, 1);

-- SONGS ---------------------------------------------------------------
INSERT INTO songs (title, artist, capo_fret, song_key, notes, spotify_uri)
VALUES
('Wonderwall', 'Oasis', 2, 'Em', 'Classic 90s acoustic progression: Em-G-D-A7sus4', 'spotify:track:1qPbGZqppFwLwcBC1JQ6Vr'),
('Hotel California', 'Eagles', 0, 'Bm', 'Iconic intro: Bm-F#-A-E-G-D-Em-F#', 'spotify:track:40riOy7x9W7GXjyGp4pjAv'),
('Let It Be', 'The Beatles', 0, 'C', 'Simple piano/guitar sequence: C-G-Am-F', 'spotify:track:7iN1s7xHE4ifF5povM6A48'),
('Tennessee Whiskey', 'Chris Stapleton', 2, 'A', 'Two-chord soul groove: A-Bm (G-shape with capo 2)', 'spotify:track:3fqwjXwUGN6vbzIwvyFMhx'),
('Hallelujah', 'Leonard Cohen', 0, 'C', 'Gentle arpeggiated pattern: C-Am-F-G-C', 'spotify:track:7yzbimr8WVyAtBX3Eg6UL9');


-- SONG_CHORDS ---------------------------------------------------------
INSERT INTO song_chords (song_id, chord_id, position)
VALUES
-- Wonderwall (Em–G–D–A7sus4)
(1, (SELECT id FROM chords WHERE name='Em'), 1),
(1, (SELECT id FROM chords WHERE name='G'), 2),
(1, (SELECT id FROM chords WHERE name='D'), 3),
(1, (SELECT id FROM chords WHERE name='A7sus4'), 4),

-- Hotel California (Bm–F#m–A–E–G–D–Em–F#m)
(2, (SELECT id FROM chords WHERE name='Bm'), 1),
(2, (SELECT id FROM chords WHERE name='F#m'), 2),
(2, (SELECT id FROM chords WHERE name='A'), 3),
(2, (SELECT id FROM chords WHERE name='E'), 4),
(2, (SELECT id FROM chords WHERE name='G'), 5),
(2, (SELECT id FROM chords WHERE name='D'), 6),
(2, (SELECT id FROM chords WHERE name='Em'), 7),
(2, (SELECT id FROM chords WHERE name='F#m'), 8),

-- Let It Be (C–G–Am–F)
(3, (SELECT id FROM chords WHERE name='C'), 1),
(3, (SELECT id FROM chords WHERE name='G'), 2),
(3, (SELECT id FROM chords WHERE name='Am'), 3),
(3, (SELECT id FROM chords WHERE name='F'), 4),

-- Tennessee Whiskey (A–Bm)
(4, (SELECT id FROM chords WHERE name='A'), 1),
(4, (SELECT id FROM chords WHERE name='Bm'), 2),

-- Hallelujah (C–Am–F–G–C)
(5, (SELECT id FROM chords WHERE name='C'), 1),
(5, (SELECT id FROM chords WHERE name='Am'), 2),
(5, (SELECT id FROM chords WHERE name='F'), 3),
(5, (SELECT id FROM chords WHERE name='G'), 4),
(5, (SELECT id FROM chords WHERE name='C'), 5);


-- SONG_CHORD_PROGRESSIONS ----------------------------------------------
INSERT INTO song_chord_progressions (song_id, progression_name, chord_ids, order_index)
VALUES
-- WONDERWALL (Oasis)
(1, 'Intro', JSON_ARRAY(9, 2, 3, 11), 1),
(1, 'Verse', JSON_ARRAY(9, 2, 3, 11), 2),
(1, 'Chorus', JSON_ARRAY(9, 2, 3, 11, 6), 3), -- sometimes adds F on last pass
(1, 'Bridge', JSON_ARRAY(3, 9, 2, 11), 4),

-- HOTEL CALIFORNIA (Eagles)
(2, 'Intro', JSON_ARRAY(7, 12, 4, 5, 2, 3, 9, 12), 1),
(2, 'Verse', JSON_ARRAY(7, 12, 4, 5, 2, 3, 9, 12), 2),
(2, 'Chorus', JSON_ARRAY(7, 12, 4, 5, 2, 3, 9, 12), 3),
(2, 'Solo', JSON_ARRAY(7, 12, 4, 5, 2, 3, 9, 12), 4),

-- LET IT BE (The Beatles)
(3, 'Intro', JSON_ARRAY(1, 2, 10, 6), 1),
(3, 'Verse', JSON_ARRAY(1, 2, 10, 6), 2),
(3, 'Chorus', JSON_ARRAY(1, 2, 10, 6, 1), 3),
(3, 'Bridge', JSON_ARRAY(5, 6, 1, 2), 4),

-- TENNESSEE WHISKEY (Chris Stapleton)
(4, 'Intro', JSON_ARRAY(4, 7), 1),
(4, 'Verse', JSON_ARRAY(4, 7), 2),
(4, 'Chorus', JSON_ARRAY(4, 7), 3),
(4, 'Outro', JSON_ARRAY(4, 7), 4),

-- HALLELUJAH (Leonard Cohen)
(5, 'Intro', JSON_ARRAY(1, 10, 6, 2, 1), 1),
(5, 'Verse', JSON_ARRAY(1, 10, 6, 2, 1), 2),
(5, 'Refrain', JSON_ARRAY(1, 10, 6, 2, 1), 3),
(5, 'Outro', JSON_ARRAY(1, 10, 6, 2, 1), 4);


-- =====================================================================
-- END OF SEED FILE
-- =====================================================================
