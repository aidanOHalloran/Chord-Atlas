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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
-- CHORD_TIMELINE (NEW)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chord_timeline (
  id INT AUTO_INCREMENT PRIMARY KEY,
  song_id INT NOT NULL,
  chord_name VARCHAR(10) NOT NULL,
  start_time DECIMAL(6,2) NOT NULL,
  end_time DECIMAL(6,2) NOT NULL,
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- SEED DATA
-- ---------------------------------------------------------------------

-- CHORDS ---------------------------------------------------------------
INSERT INTO chords (name, frets, fingers, position, variation)
VALUES
('C',  JSON_ARRAY(0,3,2,0,1,0),   JSON_ARRAY(0,3,2,0,1,0),   1, 1),
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
INSERT INTO songs (title, artist, capo_fret, song_key, notes)
VALUES
('Wonderwall', 'Oasis', 2, 'Em', 'Classic 90s acoustic progression: Em–G–D–A7sus4'),
('Hotel California', 'Eagles', 0, 'Bm', 'Iconic intro: Bm–F#–A–E–G–D–Em–F#'),
('Let It Be', 'The Beatles', 0, 'C', 'Simple piano/guitar sequence: C–G–Am–F'),
('Tennessee Whiskey', 'Chris Stapleton', 2, 'A', 'Two-chord soul groove: A–Bm (G-shape with capo 2)'),
('Hallelujah', 'Leonard Cohen', 0, 'C', 'Gentle arpeggiated pattern: C–Am–F–G–C');

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

-- ---------------------------------------------------------------------
-- CHORD_TIMELINE SEED EXAMPLES
-- ---------------------------------------------------------------------
-- Wonderwall progression (4 chords repeating)
INSERT INTO chord_timeline (song_id, chord_name, start_time, end_time)
VALUES
(1, 'Em', 0.00, 4.00),
(1, 'G', 4.00, 8.00),
(1, 'D', 8.00, 12.00),
(1, 'A7sus4', 12.00, 16.00),
(1, 'Em', 16.00, 20.00),
(1, 'G', 20.00, 24.00),
(1, 'D', 24.00, 28.00),
(1, 'A7sus4', 28.00, 32.00);

-- Hotel California intro (approximate 2-bar per chord)
INSERT INTO chord_timeline (song_id, chord_name, start_time, end_time)
VALUES
(2, 'Bm', 0.00, 4.00),
(2, 'F#m', 4.00, 8.00),
(2, 'A', 8.00, 12.00),
(2, 'E', 12.00, 16.00),
(2, 'G', 16.00, 20.00),
(2, 'D', 20.00, 24.00),
(2, 'Em', 24.00, 28.00),
(2, 'F#m', 28.00, 32.00);

-- =====================================================================
-- END OF SEED FILE
-- =====================================================================
