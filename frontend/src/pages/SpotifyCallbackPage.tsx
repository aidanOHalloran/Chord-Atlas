import { useEffect } from "react";
import { exchangeToken } from "../services/spotifyAuth";

export default function SpotifyCallbackPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    console.log("[Callback] code param:", code);

    if (!code) {
      console.warn("[Callback] No code param found in URL.");
      return;
    }

    // Check for missing verifier before calling exchangeToken
    const verifier =
      sessionStorage.getItem("spotify_verifier") ||
      localStorage.getItem("spotify_verifier");

    if (!verifier) {
      console.warn(
        "[Callback] Missing verifier! Possibly different container/browser context."
      );

      // Attempt recovery: user logged in on host, not container.
      // We redirect to /login to reinitiate PKCE if needed.
      alert(
        "Spotify login session expired or lost due to Docker redirect.\nPlease log in again."
      );
      window.location.href = "/";
      return;
    }

    console.log("[Callback] Found verifier in storage, proceeding to token exchange.");

    exchangeToken(code)
      .then((token) => {
        console.log("[Callback] exchangeToken returned:", token.slice(0, 20) + "...");
        console.log(
          "[Callback] localStorage now has token:",
          localStorage.getItem("spotify_access_token")?.slice(0, 20) + "..."
        );
        window.location.href = "/songs";
      })
      .catch((err) => {
        console.error("[Callback] Spotify auth failed:", err);

        // Optional recovery fallback
        if (
          err.message?.includes("Missing verifier") ||
          err.message?.includes("invalid_grant")
        ) {
          alert(
            "Spotify authorization failed (verifier mismatch).\nPlease try logging in again."
          );
          window.location.href = "/";
        }
      });
  }, []);

  return (
    <div className="text-center text-gray-400 mt-20">
      <p>Finishing Spotify login...</p>
      <p className="text-xs text-gray-500 mt-2">
        (If this page doesn't redirect automatically, return to home and log in again.)
      </p>
    </div>
  );
}
