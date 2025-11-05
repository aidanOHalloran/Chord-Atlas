// Global types for Spotify Web Playback SDK
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: typeof Spotify;
  }

  namespace Spotify {
    interface PlayerInit {
      name: string;
      getOAuthToken: (callback: (token: string) => void) => void;
      volume?: number;
    }

    interface Player {
      connect(): Promise<boolean>;
      addListener(
        event: string,
        callback: (data: any) => void
      ): boolean;
    }

    class Player {
      constructor(options: PlayerInit);
    }
  }
}

export {};
