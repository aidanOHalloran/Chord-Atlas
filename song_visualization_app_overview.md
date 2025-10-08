# Song Visualization App — v1 Documentation

## 1. Project Overview

**App Name:** ChordAtlas *(placeholder)*  
**Purpose:** ChordAtlas allows users to build a personal database of songs and instantly visualize how to play each chord on their instrument.  
**Target Audience:** Guitar learners, hobbyists, and musicians seeking an interactive, visual way to manage and practice their song repertoire.  
**Core Focus:** Simplicity and clarity. The user can quickly add, browse, and visualize songs in an intuitive interface.

---

## 2. Functional Requirements

| ID | Feature | Description | Priority |
|----|----------|--------------|-----------|
| FR-01 | Add Song | User can create a song entry with title, artist, key, and chords | High |
| FR-02 | View Songs | User can view all songs in a searchable list | High |
| FR-03 | Edit/Delete Song | User can update or remove existing songs | High |
| FR-04 | Chord Visualization | Display each chord as a fretboard diagram | High |
| FR-05 | Key Transpose | Change key and update chord names and diagrams | Medium |
| FR-06 | Auto-Detect New Chords | Highlight chords not previously used by the user | Low |

---

## 3. Non-Functional Requirements

| Category | Requirement |
|-----------|-------------|
| Performance | App should load within 2 seconds for up to 100 stored songs |
| UX | Responsive and touch-friendly UI for desktop and mobile |
| Reliability | CRUD operations must persist correctly and handle errors gracefully |
| Scalability | Architecture must allow for future features (authentication, sharing) |
| Maintainability | Modular React components and well-documented API endpoints |

---

## 4. System Architecture

**High-Level Design:**

```
Frontend (React)
  ├── Song Library
  ├── Song Details Page
  ├── Chord Renderer (SVG Component)
  └── API Layer (Axios or Fetch)
        ↓
Backend (Node.js / Express)
  ├── Routes (Songs CRUD)
  ├── Controllers
  └── Models (Song, Chord)
        ↓
Database (MySQL)
```

---

## 5. Database Schema

**Table: `songs`**

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK, AUTO_INCREMENT) | Unique identifier |
| title | VARCHAR(255) | Song title |
| artist | VARCHAR(255) | Artist name |
| song_key | VARCHAR(10) | Key signature (e.g., "C", "G", "A♭") |
| chords | JSON | Array of chord symbols |
| notes | TEXT | Optional song notes |
| created_at | TIMESTAMP | Auto-filled on creation |

---

## 6. API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/songs` | Retrieve all songs |
| GET | `/songs/:id` | Retrieve a single song by ID |
| POST | `/songs` | Add a new song |
| PUT | `/songs/:id` | Update an existing song |
| DELETE | `/songs/:id` | Remove a song |

**Example Payload:**
```json
{
  "title": "Let It Be",
  "artist": "The Beatles",
  "song_key": "C",
  "chords": ["C", "G", "Am", "F"]
}
```

---

## 7. Chord Visualization Specification

**Chord Object Example:**
```json
{
  "name": "C",
  "frets": [0, 1, 0, 2, 3, "x"],
  "fingers": [0, 1, 0, 2, 3, 0]
}
```

**Renderer Behavior:**
- 6 strings (E–A–D–G–B–e) represented as vertical lines.
- Horizontal fret lines (5 visible at a time).
- Circles drawn where fingered frets occur.
- Optionally label fingers (1–4) and muted/open strings.

**Display Options:**
- View all song chords at once (grid view).  
- Tap/hover to show chord name and fingering.  
- Optional key transposition: automatically adjust chord names and diagrams.

---

## 8. UI Wireframes (Text Summary)

### Home / Library View
- Header with app name and search bar.
- List or grid of songs (title + artist + preview of chords).
- Floating “+ Add Song” button.

### Add Song Modal
- Inputs: Title, Artist, Key, Chords (comma-separated).
- Validation: no empty title, chords must be valid symbols.
- "Save" button.

### Song Detail View
- Displays title, artist, and key.
- Shows chord progression visually as a scrollable row of fretboard diagrams.
- Transpose dropdown to change key (optional for v1).

---

## 9. Future Enhancements

- User authentication and profiles.
- Practice mode with auto-scroll and metronome.
- Piano chord visualization.
- Audio playback of chords.
- Community song sharing and discovery.
- Import/export song data (JSON or CSV).

---

## 10. Project Setup Notes

**Suggested Stack:**

- **Frontend:** React + Vite + TypeScript  
- **Backend:** Node.js (Express)  
- **Database:** MySQL (using Sequelize)  
- **Hosting:** Docker

**Development Notes:**
- Environment variables managed via `.env` files.
- API tested using Postman or Hoppscotch.
- Database migrations handled with Prisma Migrate or Sequelize CLI.
- ESLint + Prettier configured for code style consistency.

---

### End of v1 Documentation

