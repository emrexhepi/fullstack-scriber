import { getClient as getElasticClient } from "@utils/elastic";
import { Track } from "@interfaces/release-interfaces";
import { SearchResponse } from "@interfaces/es-interfaces";

export async function suggestTracks(prefix: string): Promise<Track[]> {
  const esClient = getElasticClient();

  const {
    body: {
      hits: { hits },
    },
  } = await esClient.search<SearchResponse<Track>>({
    size: 5,
    index: "tracks",
    body: {
      query: {
        prefix: {
          title: {
            value: prefix.toLocaleLowerCase(),
          },
        },
      },
    },
  });

  const tracks: Track[] = hits.map(
    (hit): Track => {
      return hit._source;
    }
  );

  return tracks;
}
