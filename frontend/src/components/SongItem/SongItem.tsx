import type { Song } from "../../types/models";
import ChordList from "../ChordList/ChordList";

interface SongItemProps {
    song: Song;
}

export default function SongItem({ song }: SongItemProps){
    return(
        <li>
            {/* Show song name and details */}
            <strong>
                {song.title} – {song.artist} ({song.song_key})
            </strong>

            {/* Render the ChordList component */}
            {song.Chords && song.Chords.length > 0 && (
                <ChordList chords={song.Chords} />
            )}
        </li>
    )
}