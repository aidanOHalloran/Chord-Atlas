import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="text-center mt-20 space-y-6">
      <h1 className="text-4xl font-bold text-blue-400">🎸 Welcome to ChordAtlas</h1>
      <p className="text-gray-400 max-w-md mx-auto">
        Build your personal song library, visualize chords, and jam smarter — all in one place.
      </p>
      <Link to="/songs">
        <button className="px-6 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition">
          Go to Song Library →
        </button>
      </Link>
    </div>
  );
}
