/**
 * HydraHD Scraper & Stream Resolver
 */
import { defineExtension } from "@yume/sdk";

export const handlers = defineExtension({
  async resolve({ media, episodeId }) {
    const isMovie = media.kind === "movie" || media.kind === "anime_movie";
    const tmdbId = media.externalIds?.find((x) => x.provider === "tmdb")?.external_id || media.id.replace(/^med_/, "");

    return [
      {
        id: `hydrahd-stream-${media.id}`,
        title: `${media.title} - HydraHD 1080p Stream`,
        url: `https://hydrahd.com/watch/${isMovie ? "movie" : "tv"}/${tmdbId}`,
        quality: "1080p",
        format: "hls",
        playable: true,
      },
      {
        id: `hydrahd-fast-${media.id}`,
        title: `${media.title} - HydraHD Fast Mirror`,
        url: `https://vidsrc.me/embed/${isMovie ? "movie" : "tv"}?tmdb=${tmdbId}`,
        quality: "Auto",
        format: "hls",
        playable: true,
      }
    ];
  },
});
