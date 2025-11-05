import { useEffect, useState } from "react";
import { useSpotifyPlayer } from "../../../hooks/useSpotifyPlayer";
import { redirectToSpotifyAuth, exchangeToken } from "../../../services/spotifyAuth";

interface SpotifyPlayerProps {
  spotifyUri?: string | null;
}

export default function SpotifyPlayer({ spotifyUri }: SpotifyPlayerProps) {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("spotify_access_token")
  );
  const { deviceId, ready } = useSpotifyPlayer(accessToken);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code && !accessToken) {
      exchangeToken(code).then((token) => {
        setAccessToken(token);
        window.history.replaceState({}, document.title, "/");
      });
    }
  }, []);

  async function handlePlaySong() {
    if (!accessToken || !deviceId) {
      console.warn("Spotify not ready yet.");
      return;
    }
    if (!spotifyUri) {
      alert("⚠️ No Spotify track linked for this song.");
      return;
    }

    try {
      const res = await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uris: [spotifyUri] }),
        }
      );

      if (!res.ok) throw new Error(`Spotify play failed: ${res.status}`);
      setIsPlaying(true);
    } catch (err) {
      console.error("❌ Error starting playback:", err);
    }
  }

  if (!accessToken) {
    return (
      <div className="text-center mt-6">
        <button
          onClick={redirectToSpotifyAuth}
          className="bg-green-600 hover:bg-green-500 text-white font-medium px-5 py-2 rounded-lg shadow"
        >
          Connect Spotify
        </button>
      </div>
    );
  }

  if (!ready) {
    return <p className="text-gray-400 mt-6">Connecting Spotify player...</p>;
  }

  return (
    <div className="mt-6 bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-center text-gray-300">
      <p className="text-lg font-semibold text-green-400 mb-2">Spotify Connected 🎧</p>
      {spotifyUri ? (
        <>
          <p className="text-sm text-gray-400 mb-4">
            Playing linked Spotify track for this song.
          </p>
          <button
            onClick={handlePlaySong}
            disabled={isPlaying}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {isPlaying ? "▶️ Playing..." : "Play Song on Spotify"}
          </button>
        </>
      ) : (
        <p className="text-gray-500 italic">
          This song does not yet have a Spotify link.
        </p>
      )}
    </div>
  );
}
