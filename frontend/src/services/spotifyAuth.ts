// frontend/src/services/spotifyAuth.ts

// ────────────────────────────────────────────────
// Spotify OAuth (PKCE) Auth Helper
// Docker-safe implementation for Chord Atlas
// ────────────────────────────────────────────────

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const scopes =
  import.meta.env.VITE_SPOTIFY_SCOPES ||
  "user-read-playback-state user-modify-playback-state streaming user-read-currently-playing";

console.log("[Auth Config] Client ID:", clientId);
console.log("[Auth Config] Redirect URI:", redirectUri);
console.log("[Auth Config] Scopes:", scopes);

// ────────────────────────────────────────────────
// PKCE Helpers
// ────────────────────────────────────────────────

function generateCodeVerifier(length = 128): string {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((x) => possible[x % possible.length])
    .join("");
}

// ────────────────────────────────────────────────
// PKCE Verifier Persistence (Docker-safe)
// ────────────────────────────────────────────────

function storeVerifier(verifier: string) {
  try {
    localStorage.setItem("spotify_verifier", verifier);
    document.cookie = `spotify_verifier=${verifier}; path=/; max-age=300; SameSite=Lax`;
  } catch (err) {
    console.warn("[Auth] Failed to write verifier to storage:", err);
  }
}

function loadVerifier(): string | null {
  try {
    return (
      localStorage.getItem("spotify_verifier") ||
      document.cookie
        .split("; ")
        .find((r) => r.startsWith("spotify_verifier="))
        ?.split("=")[1] ||
      null
    );
  } catch (err) {
    console.warn("[Auth] Failed to read verifier from storage:", err);
    return null;
  }
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// ────────────────────────────────────────────────
// Step 1: Redirect to Spotify Login (PKCE)
// ────────────────────────────────────────────────

export async function redirectToSpotifyAuth() {
  // 🧩 Try to load from cookie/localStorage first
  let verifier = loadVerifier();

  // 🧭 If missing (Docker redirect cleared it), decode from URL state
  if (!verifier) {
    const stateParam = new URLSearchParams(window.location.search).get("state");
    if (stateParam) {
      try {
        verifier = atob(stateParam);
        console.log(
          "[Auth] Recovered verifier from state param:",
          verifier.slice(0, 15)
        );
        storeVerifier(verifier); // save again for next time
      } catch {
        console.warn("[Auth] Could not decode state param verifier.");
      }
    }
  }

  if (!verifier) {
    alert(
      "Spotify login session expired or lost due to Docker redirect. Please log in again."
    );
    throw new Error("Missing PKCE verifier");
  }

  const challenge = await generateCodeChallenge(verifier);
  console.log("[Auth Debug] Generated challenge:", challenge.slice(0, 25));

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: scopes,
    redirect_uri: redirectUri,
    code_challenge_method: "S256",
    code_challenge: challenge,
  });

  // ✅ Include the verifier in the state param as a fallback
  params.set("state", btoa(verifier));

  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  console.log("[Auth] Redirecting to Spotify...");
  window.location.href = authUrl;
}

// ────────────────────────────────────────────────
// Step 2: Exchange Auth Code → Access Token
// ────────────────────────────────────────────────

export async function exchangeToken(code: string): Promise<string> {
  console.log("[Auth] Exchanging code for access token...");

  const verifier = loadVerifier();
  if (!verifier) {
    alert(
      "Spotify login session expired or lost due to Docker redirect. Please log in again."
    );
    console.warn(
      "[Auth] Missing PKCE verifier — possibly different container or browser context."
    );
    throw new Error("Missing PKCE verifier for token exchange");
  }

  console.log(
    "[Auth Debug] Using stored PKCE verifier:",
    verifier.slice(0, 25)
  );
  console.log("[Auth Debug] verifier used for token exchange:", verifier);

  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    code_verifier: verifier,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await response.json();
  console.log("[Auth] Token response:", data);

  if (!response.ok || !data.access_token) {
    console.error("❌ Spotify token exchange failed:", data);
    throw new Error(data.error_description || "Token exchange failed");
  }

  // Store tokens for the session (access + optional refresh)
  sessionStorage.setItem("spotify_access_token", data.access_token);
  if (data.refresh_token)
    sessionStorage.setItem("spotify_refresh_token", data.refresh_token);

  // Mirror access token to localStorage (so player survives reload)
  localStorage.setItem("spotify_access_token", data.access_token);

  console.log(
    "[Auth] Stored Spotify access token:",
    data.access_token.slice(0, 20) + "..."
  );
  return data.access_token;
}

// ────────────────────────────────────────────────
// Step 3: Token Utilities
// ────────────────────────────────────────────────

export function getStoredAccessToken(): string | null {
  return (
    sessionStorage.getItem("spotify_access_token") ||
    localStorage.getItem("spotify_access_token")
  );
}

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = sessionStorage.getItem("spotify_refresh_token");
  if (!refreshToken) {
    console.warn("[Auth] No refresh token found; manual login required.");
    return null;
  }

  console.log("[Auth] Attempting token refresh...");

  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await res.json();
  if (!res.ok || !data.access_token) {
    console.error("[Auth] Token refresh failed:", data);
    return null;
  }

  sessionStorage.setItem("spotify_access_token", data.access_token);
  localStorage.setItem("spotify_access_token", data.access_token);

  console.log("[Auth] Token refreshed successfully!");
  return data.access_token;
}
