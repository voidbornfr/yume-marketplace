/**
 * Bingr Scraper & Stream Resolver
 */
import { defineExtension } from "@yume/sdk";

export const handlers = defineExtension({
  async resolve({ media, episodeId }) {
    const isMovie = media.kind === "movie" || media.kind === "anime_movie";
    const tmdbId = media.externalIds?.find((x) => x.provider === "tmdb")?.external_id || media.id.replace(/^med_/, "");

    return [
      {
        id: `bingr-source-${media.id}`,
        title: `${media.title} - Bingr Boxset Stream`,
        url: `https://bingr.stream/watch/${isMovie ? "movie" : "tv"}/${tmdbId}`,
        quality: "1080p",
        format: "hls",
        playable: true,
      },
      {
        id: `bingr-superembed-${media.id}`,
        title: `${media.title} - Bingr SuperEmbed`,
        url: `https://superembed.stream/embed/${isMovie ? "movie" : "tv"}?id=${tmdbId}`,
        quality: "Auto",
        format: "hls",
        playable: true,
      }
    ];
  },
});
