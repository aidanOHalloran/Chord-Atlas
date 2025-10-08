import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>🎸 Welcome to ChordAtlas</h1>
      <p>Build your personal song library and visualize chords instantly.</p>
      <Link to="/songs">
        <button>Go to Song Library →</button>
      </Link>
    </div>
  );
}
