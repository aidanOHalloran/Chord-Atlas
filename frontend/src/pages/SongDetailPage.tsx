import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { SongService } from "../services/api";
import type { Song, SongChordProgression } from "../types/models";
import EditSongModal from "../components/Songs/EditSongModal/EditSongModal";
import ChordCard from "../components/Chords/ChordCard/ChordCard";
import SongHeader from "../components/Songs/SongHeader/SongHeader";
import ChordTimelineSection from "../components/Songs/ChordTimeline/ChordTimelineSection";
import SpotifyPlayer from "../components/Songs/SpotifyPlayer/SpotifyPlayer";
import SongChordProgressions from "../components/Songs/SongChordProgressions/SongChordProgressions";
import ManageProgressionsModal from "../components/Songs/SongChordProgressions/ManageProgressionsModal";
import {
  SectionNavProvider,
  SectionNavBar,
  Section,
} from "../components/layout/section-nav";



export default function SongDetailPage() {
  const { id } = useParams();
  const [song, setSong] = useState<Song | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [progressions, setProgressions] = useState<SongChordProgression[]>([]);
  const [showManageProgressionsModal, setShowManageProgressionsModal] = useState(false);



  useEffect(() => {
    if (id) {
      SongService.getAll().then((songs) => {
        const found = songs.find((s) => s.id === Number(id));
        setSong(found || null);
      });

      SongService.getChordProgressions(Number(id))
        .then(setProgressions)
        .catch(console.error);
    }
  }, [id]);


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
    <SectionNavProvider>

      <div className="relative">

        <SectionNavBar offsetPx={80} />

        <br />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="p-8 text-gray-200 max-w-6xl mx-auto"
        >
          {/* Back link */}
          <Link
            to="/songs"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-700 text-gray-200 bg-neutral-800 hover:bg-neutral-700 hover:text-blue-400 transition-all duration-200 mb-6"
          >
            ← Back to Song Library
          </Link>

          {/* Header */}
          <div className="flex justify-between items-start mb-10">
            <SongHeader song={song} className="leading-tight" />
            <div className="flex gap-3">
              <button
                onClick={() => setShowManageProgressionsModal(true)}
                className="bg-neutral-800 hover:bg-neutral-700 text-blue-300 px-4 py-2 rounded-lg text-sm font-medium border border-neutral-700 shadow-sm transition"
              >
                🎼 Manage Progressions
              </button>
              <button
                onClick={() => setShowEdit(true)}
                className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
              >
                ✏️ Edit
              </button>
            </div>
          </div>

          {/* Chords section */}
          <Section id="chords" label="Chords">
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
          </Section>

          {/* Chord Progressions section */}
          <Section id="progressions" label="Chord Progressions">
            <SongChordProgressions
              progressions={progressions ?? []}
              allChords={song?.Chords ?? []}
            />
          </Section>

          {/* Spotify Link section */}
          <Section id="spotify" label="Spotify Link">

            {song.spotify_uri && (
              <section className="mb-8">
                <h3 className="text-2xl font-semibold text-green-400 mb-3">Spotify Link</h3>
                <a
                  href={`https://open.spotify.com/track/${song.spotify_uri.replace("spotify:track:", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Open in Spotify
                </a>
              </section>
            )}


            <SpotifyPlayer spotifyUri={song.spotify_uri} />

          </Section>

          {/* Chord Timeline section */}
          <Section id="chord-timeline" label="Chord Timeline">
            <ChordTimelineSection songId={song.id} />
          </Section>

          {/* Notes section */}
          <Section id="notes" label="Notes">

            {song.notes && (
              <section className="mb-12">
                <h3 className="text-2xl font-semibold text-blue-300 mb-3">Notes</h3>
                <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800 shadow-inner text-gray-300 leading-relaxed">
                  {song.notes}
                </div>
              </section>
            )}

          </Section>

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

          {/* Manage Progressions Modal */}
          <ManageProgressionsModal
            isOpen={showManageProgressionsModal}
            onClose={() => setShowManageProgressionsModal(false)}
            songTitle={`${song.title} – ${song.artist}`}
            songId={song.id}
          />

        </motion.div>
      </div>

    </SectionNavProvider>
  );
}
