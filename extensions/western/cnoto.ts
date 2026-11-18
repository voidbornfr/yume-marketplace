/**
 * Cno.to Stream Resolver
 */
import { defineExtension } from "@yume/sdk";

export const handlers = defineExtension({
  async resolve({ media, episodeId }) {
    const isMovie = media.kind === "movie" || media.kind === "anime_movie";
    const tmdbId = media.externalIds?.find((x) => x.provider === "tmdb")?.external_id || media.id.replace(/^med_/, "");

    return [
      {
        id: `cnoto-main-${media.id}`,
        title: `${media.title} - Cno.to Fast Stream`,
        url: `https://cno.to/watch/${isMovie ? "movie" : "tv"}/${tmdbId}`,
        quality: "1080p",
        format: "hls",
        playable: true,
      }
    ];
  },
});
