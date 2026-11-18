/**
 * PressPlayX Stream Resolver
 */
import { defineExtension } from "@yume/sdk";

export const handlers = defineExtension({
  async resolve({ media, episodeId }) {
    const isMovie = media.kind === "movie" || media.kind === "anime_movie";
    const tmdbId = media.externalIds?.find((x) => x.provider === "tmdb")?.external_id || media.id.replace(/^med_/, "");

    return [
      {
        id: `pressplayx-hd-${media.id}`,
        title: `${media.title} - PressPlayX HD Stream`,
        url: `https://pressplayx.com/embed/${isMovie ? "movie" : "tv"}/${tmdbId}`,
        quality: "1080p",
        format: "hls",
        playable: true,
      }
    ];
  },
});
