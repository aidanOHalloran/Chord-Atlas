import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      
      <h1 className="text-4xl font-bold text-blue-400">🎸 Welcome to ChordAtlas</h1>

      <h3 className="text-gray-400 max-w-md mx-auto">
        Build your personal song library, visualize chords, and jam smarter — all in one place.
      </h3>

      <Link
        to="/songs"
        className="inline-block px-6 py-3 text-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition"
      >
        Go to Song Library →
      </Link>

      <Link
        to="/chords"
        className="inline-block px-6 py-3 text-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition"
      >
        Go to Chord Library →
      </Link>
    </div>

  );
}
