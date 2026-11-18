/**
 * M4uHD Stream Resolver
 */
import { defineExtension } from "@yume/sdk";

export const handlers = defineExtension({
  async resolve({ media, episodeId }) {
    const isMovie = media.kind === "movie" || media.kind === "anime_movie";
    const tmdbId = media.externalIds?.find((x) => x.provider === "tmdb")?.external_id || media.id.replace(/^med_/, "");

    return [
      {
        id: `m4uhd-stream-${media.id}`,
        title: `${media.title} - M4uHD Direct`,
        url: `https://m4uhd.tv/embed/${isMovie ? "movie" : "tv"}/${tmdbId}`,
        quality: "1080p",
        format: "hls",
        playable: true,
      }
    ];
  },
});
