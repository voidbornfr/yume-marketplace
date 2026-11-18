# YUME Extension Developer Guide 🛠️

Build providers that plug directly into **YUME** without modifying the core codebase.

Inspired by Seanime and Tachiyomi extension specifications, YUME extensions are sandboxed TypeScript/JavaScript modules that resolve streams, torrents, manga chapters, and metadata.

---

## 🌟 Capabilities & Types

| Extension Type | Capability | Purpose |
| :--- | :--- | :--- |
| `onlinestream-provider` | `SourceProvider`, `PlaybackProvider` | Resolves playable video URLs (HLS `.m3u8`, MP4) from streaming websites. |
| `torrent-provider` | `SourceProvider`, `DownloadProvider` | Searches and returns torrent magnets or `.torrent` files for Movies, Series, Anime. |
| `manga-provider` | `ReaderProvider` | Scrapes manga, webtoon, or light novel chapters and image page URLs. |
| `metadata-provider` | `MetadataProvider`, `CatalogProvider` | Feeds media details, posters, synopsis, seasons, and episodes. |

---

## 📁 Extension Architecture

An extension consists of two files:

```tree
my-extension/
├── manifest.json   # Metadata, permissions & capabilities
└── provider.ts     # Sandboxed execution code
```

---

## 1. Creating `manifest.json`

```json
{
  "id": "western-shuttletv",
  "name": "ShuttleTV",
  "version": "1.0.0",
  "author": "Community",
  "description": "Streams HD Western movies and TV series directly into the YUME player.",
  "type": "onlinestream-provider",
  "language": "typescript",
  "lang": "en",
  "category": "movies",
  "capabilities": ["SourceProvider", "PlaybackProvider"],
  "permissions": {
    "network": [
      "shuttletv.pk",
      "vidsrc.to",
      "embed.su"
    ],
    "filesystem": "none",
    "storage": true,
    "serverSide": true,
    "userApprovalRequired": false
  },
  "license": "MIT",
  "manifestURI": "https://raw.githubusercontent.com/user/repo/main/manifest.json",
  "payloadURI": "https://raw.githubusercontent.com/user/repo/main/provider.ts"
}
```

---

## 2. Writing `provider.ts`

### A. Online Video Stream Provider (Movie / Series / Anime)
```typescript
import { defineExtension } from "@yume/sdk";

export const handlers = defineExtension({
  /**
   * Called when the user clicks 'Play' or opens the video player.
   */
  async resolve({ media, episodeId }) {
    const isMovie = media.kind === "movie";
    const title = media.title;

    // Call your target API or scrape embed sources
    // Note: network calls are restricted to declared permissions.network domains
    return [
      {
        id: `stream-1080p`,
        title: `${title} [1080p Stream]`,
        url: `https://vidsrc.to/embed/${isMovie ? "movie" : "tv"}/${media.id}`,
        quality: "1080p",
        format: "hls",
        playable: true
      }
    ];
  }
});
```

### B. Torrent & Magnet Provider
```typescript
import { defineExtension } from "@yume/sdk";

export const handlers = defineExtension({
  async resolve({ media, episode }) {
    const searchTerm = `${media.title} ${episode ? `S01E${episode.number}` : media.year || ""}`;
    
    // Example: fetch magnets from Torrentio / Torbox / Jackett
    return [
      {
        id: `torrent-1080p-hevc`,
        title: `${media.title} - 1080p WEB-DL HEVC 10bit`,
        url: `magnet:?xt=urn:btih:...&dn=${encodeURIComponent(media.title)}`,
        quality: "1080p",
        format: "torrent",
        playable: true,
        note: "Seeders: 142 · Size: 1.4 GB"
      }
    ];
  }
});
```

---

## 3. Testing & Submitting to the Marketplace

1. Open **YUME** -> Click on the **Store** icon in the sidebar -> Go to **Import & repositories**.
2. Paste your GitHub raw link or paste your `manifest.json` directly into the editor.
3. Click **Validate & install**.
4. Once tested, create a pull request to `marketplace/Main.json` in the YUME repository.
