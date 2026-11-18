/**
 * ShuttleTV scraper & stream resolver (western movies and TV shows)
 * Resolves high quality streams from ShuttleTV / embed aggregators
 */
import { defineExtension } from "@yume/sdk";

export const handlers = defineExtension({
  async resolve({ media, episodeId }) {
    const isMovie = media.kind === "movie" || media.kind === "anime_movie";
    const title = media.title;
    const year = media.year || "";

    const tmdbId = media.externalIds?.find((x) => x.provider === "tmdb")?.external_id || media.id.replace(/^med_/, "");
    const imdbId = media.externalIds?.find((x) => x.provider === "imdb")?.external_id;

    const sources: Array<{
      id: string;
      title: string;
      url: string;
      quality: string;
      format: string;
      playable: boolean;
    }> = [];

    // ShuttleTV multi-server endpoints
    const embedBase = `https://vidsrc.to/embed/${isMovie ? "movie" : "tv"}/${tmdbId}`;
    sources.push({
      id: `shuttletv-main-${media.id}`,
      title: `${title} - ShuttleTV Primary (1080p)`,
      url: embedBase,
      quality: "1080p",
      format: "hls",
      playable: true,
    });

    sources.push({
      id: `shuttletv-mirror-${media.id}`,
      title: `${title} - ShuttleTV Fast CDN (Auto)`,
      url: `https://embed.su/embed/${isMovie ? "movie" : "tv"}/${tmdbId}`,
      quality: "1080p",
      format: "hls",
      playable: true,
    });

    if (imdbId) {
      sources.push({
        id: `shuttletv-imdb-${media.id}`,
        title: `${title} - ShuttleTV IMDb Direct`,
        url: `https://vidsrc.me/embed/${imdbId}`,
        quality: "720p",
        format: "hls",
        playable: true,
      });
    }

    return sources;
  },
});
