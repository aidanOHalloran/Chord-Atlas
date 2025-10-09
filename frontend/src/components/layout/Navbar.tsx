import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-neutral-900 border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold text-blue-400">
          🎸 ChordAtlas
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-blue-300">Home</Link>
          <Link to="/songs" className="hover:text-blue-300">Library</Link>
        </div>
      </div>
    </nav>
  );
}
