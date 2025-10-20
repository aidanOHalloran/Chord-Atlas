import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="text-center text-gray-200 mt-24 px-4">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-5xl font-bold text-blue-400 mb-4"
      >
        ChordAtlas
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-gray-400 max-w-md mx-auto text-lg mb-10 leading-relaxed"
      >
        Manage your songs and chord progressions in one organized place.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="flex flex-col sm:flex-row justify-center gap-4"
      >
        <Link
          to="/songs"
          className="px-8 py-3 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition"
        >
          Song Library
        </Link>

        <Link
          to="/chords"
          className="px-8 py-3 text-lg font-medium text-white bg-neutral-700 hover:bg-neutral-600 rounded-lg shadow-md transition"
        >
          Chord Library
        </Link>
      </motion.div>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-gray-600 text-xs mt-12 tracking-wide uppercase"
      >
        © {new Date().getFullYear()} ChordAtlas
      </motion.p>
    </div>
  );
}
