import { getClient as getElasticClient } from "@utils/elastic";
import { Artist } from "@interfaces/release-interfaces";
import { SearchResponse } from "@interfaces/es-interfaces";

export async function suggestArtists(prefix: string): Promise<Artist[]> {
  const esClient = getElasticClient();

  const result = await esClient.search<SearchResponse<Artist>>({
    size: 5,
    index: "artists",
    body: {
      query: {
        prefix: {
          name: {
            value: prefix.toLocaleLowerCase(),
          },
        },
      },
    },
  });

  const {
    body: {
      hits: { hits },
    },
  } = result;

  const artists: Artist[] = hits.map(
    (hit): Artist => {
      return hit._source;
    }
  );

  return artists;
}
