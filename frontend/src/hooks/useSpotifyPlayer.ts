import { useEffect, useState } from "react";

export function useSpotifyPlayer(accessToken: string | null) {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    console.log("[Player Hook] useSpotifyPlayer triggered. accessToken:", accessToken);

    if (!accessToken) {
      console.warn("[Player Hook] No access token available yet — skipping initialization.");
      return;
    }

    // Load SDK only once
    if (!document.querySelector("#spotify-sdk")) {
      const script = document.createElement("script");
      script.id = "spotify-sdk";
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
      console.log("[Player Hook] Injected Spotify SDK script tag.");
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log("[SDK] Spotify Web Playback SDK is ready.");

      const spotifyPlayer = new window.Spotify.Player({
        name: "ChordAtlas Player",
        getOAuthToken: cb => {
          const storedToken = localStorage.getItem("spotify_access_token");
          console.log("[SDK] getOAuthToken called — storedToken:", storedToken ? storedToken.slice(0, 15) + "..." : "null");
          cb(storedToken || "");
        },
        volume: 0.8,
      });

      spotifyPlayer.addListener("initialization_error", ({ message }) =>
        console.error("[SDK] Initialization error:", message)
      );
      spotifyPlayer.addListener("authentication_error", ({ message }) =>
        console.error("[SDK] Authentication error:", message)
      );
      spotifyPlayer.addListener("account_error", ({ message }) =>
        console.error("[SDK] Account error:", message)
      );
      spotifyPlayer.addListener("playback_error", ({ message }) =>
        console.error("[SDK] Playback error:", message)
      );

      spotifyPlayer.addListener("ready", ({ device_id }) => {
        console.log("✅ [SDK] Player Ready — Device ID:", device_id);
        setDeviceId(device_id);
        setReady(true);
      });

      spotifyPlayer.addListener("not_ready", ({ device_id }) =>
        console.warn("⚠️ [SDK] Device ID went offline:", device_id)
      );

      console.log("[SDK] Connecting player...");
      spotifyPlayer.connect().then(success => {
        console.log(success ? "✅ [SDK] Player connected!" : "❌ [SDK] Player failed to connect.");
      });

      setPlayer(spotifyPlayer);
    };
  }, [accessToken]);

  return { player, deviceId, ready };
}
