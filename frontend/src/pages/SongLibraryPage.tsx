import SongList from "../components/SongList/SongList";

export default function SongLibraryPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-blue-400 mb-6">🎶 Your Song Library</h2>
      <SongList />
    </div>
  );
}
