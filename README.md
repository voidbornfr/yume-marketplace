# YUME Extensions Marketplace Repository 🌌

Welcome to the official **YUME Marketplace** repository. This repository hosts verified, community-tested extension providers and plugins for Movies, Series, Anime, Manga, Light Novels, and BitTorrent streaming.

Inspired by the community-driven Seanime ecosystem ([Bas1874/Seanime-Marketplace](https://github.com/Bas1874/Seanime-Marketplace)), this repository enables 1-click extension installations directly from inside the YUME desktop and web app.

---

## 🚀 Adding This Marketplace to YUME

1. Open **YUME** and click on **Marketplace & Extensions** (`Store` icon) in the left sidebar.
2. Go to the **Marketplace** or **Import** tab.
3. Paste the repository or manifest URL:
   ```text
   https://raw.githubusercontent.com/yume-media/yume-marketplace/main/marketplace/Main.json
   ```
   *(Or add any Seanime community repository like `https://raw.githubusercontent.com/Bas1874/Seanime-Marketplace/refs/heads/main/Marketplace/Main.json`)*
4. Click **Install / Sync Repository** to browse and enable extensions with 1 click.

---

## 📦 Directory Structure

```tree
marketplace/
├── Main.json                    # Master repository manifest index (Seanime & Yume dual-compatible)
├── README.md                    # This guide
├── DEVELOPER_GUIDE.md           # Complete extension authoring guide
└── extensions/
    ├── western/                 # Western movies and series providers (ShuttleTV, HydraHD, Bingr, Cno.to, etc.)
    ├── anime/                   # Anime streaming providers (Reanime, KickAssAnime, AnimeAV1, AnimeHeaven, MegaPlay, etc.)
    ├── manga/                   # Manga & webtoon providers (MangaDex, MangaFire, MangaFreak, Atsumaru, Webtoons, etc.)
    ├── torrents/                # Torrent & tracker indexers (Torrentio, AnimeTosho, NekoBT, The Pirate Bay, SubsPlease)
    └── novels/                  # Light novel providers
```

---

## 🛠️ How to Create Your Own Extension

Each extension in the marketplace has two files:
1. `manifest.json` — Describes the name, id, author, version, capabilities, and permissions.
2. `provider.ts` (or `index.js`) — Sandboxed runtime code executing provider resolution.

### 1. Minimal `manifest.json` (Movies / TV / Streaming)
```json
{
  "id": "western-shuttletv",
  "name": "ShuttleTV",
  "version": "1.0.0",
  "author": "Yume Community",
  "description": "High-speed western movies and TV series streaming provider with auto-embed fallback.",
  "type": "onlinestream-provider",
  "language": "typescript",
  "lang": "en",
  "category": "movies",
  "capabilities": ["SourceProvider", "PlaybackProvider"],
  "permissions": {
    "network": ["shuttletv.pk", "vidsrc.to", "embed.su"],
    "filesystem": "none",
    "storage": true,
    "serverSide": true
  },
  "manifestURI": "https://raw.githubusercontent.com/yume-media/yume-marketplace/main/marketplace/extensions/western/shuttletv.json",
  "payloadURI": "https://raw.githubusercontent.com/yume-media/yume-marketplace/main/marketplace/extensions/western/shuttletv.ts"
}
```

### 2. Provider Implementation (`provider.ts`)
```typescript
import { defineExtension } from "@yume/sdk";

export const handlers = defineExtension({
  async resolve({ media, episode }) {
    // 1. Target URL
    const query = encodeURIComponent(media.title);
    
    // 2. Fetch playable streams or direct HLS/MP4 streams
    return [
      {
        id: `shuttletv-${media.id}-1080p`,
        title: `${media.title} ${episode ? `E${episode.number}` : "Movie"} [1080p Stream]`,
        url: `https://vidsrc.to/embed/${media.kind === "movie" ? "movie" : "tv"}/${media.id}`,
        quality: "1080p",
        format: "hls",
        playable: true
      }
    ];
  }
});
```

---

## 🛡️ Sandboxing & Permissions
YUME strictly sandboxes all community extensions:
- **Zero Local Host Access**: Cannot access private user credentials, local disks, or operating system processes.
- **Explicit Network Whitelisting**: Can only make HTTP requests to domains declared under `permissions.network`.
