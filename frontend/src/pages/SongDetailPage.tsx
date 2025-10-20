import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { SongService } from "../services/api";
import type { Song } from "../types/models";
import EditSongModal from "../components/Songs/EditSongModal/EditSongModal";
import ChordCard from "../components/Chords/ChordCard/ChordCard";
import SongHeader from "../components/Songs/SongHeader/SongHeader";

export default function SongDetailPage() {
  const { id } = useParams();
  const [song, setSong] = useState<Song | null>(null);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    if (id) {
      SongService.getAll().then((songs) => {
        const found = songs.find((s) => s.id === Number(id));
        setSong(found || null);
      });
    }
  }, [id]);

  if (!song) {
    return (
      <div className="text-center text-gray-400 mt-20 text-lg animate-pulse">
        Loading song details...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-gray-200">
      {/* Back link */}
      <Link
        to="/songs"
        className="text-sm text-gray-400 hover:text-blue-400 transition inline-block mb-6"
      >
        ← Back to Song Library
      </Link>

      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <SongHeader song={song} />
        <button
          onClick={() => setShowEdit(true)}
          className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
        >
          ✏️ Edit
        </button>
      </div>

      {/* Chords section */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold text-blue-300 mb-4">Chords</h3>
        {song.Chords && song.Chords.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {song.Chords.map((chord) => (
              <ChordCard
                key={chord.id}
                chord={chord}
                onDelete={() => { }} // disabled for detail page
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic bg-neutral-900 p-5 rounded-xl border border-neutral-800">
            No chords added for this song yet.
          </p>
        )}
      </section>

      {/* Notes section */}
      {song.notes && (
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-blue-300 mb-3">Notes</h3>
          <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800 shadow-inner text-gray-300 leading-relaxed">
            {song.notes}
          </div>
        </section>
      )}

      {/* Footer */}
      <div className="mt-12 text-sm text-gray-500 text-center border-t border-neutral-800 pt-4">
        <p>Song ID: {song.id}</p>
        <p className="text-gray-600">ChordAtlas Song Detail View</p>
      </div>

      {/* Edit modal */}
      {showEdit && (
        <EditSongModal
          song={song}
          onClose={() => setShowEdit(false)}
          onUpdated={async () => {
            const updated = await SongService.getById(song.id);
            setSong(updated);
          }}
        />
      )}
    </div>
  );
}
