import { getClient as getElasticClient } from "@utils/elastic";
import { Release } from "@interfaces/release-interfaces";
import { SearchResponse } from "@interfaces/es-interfaces";

export async function suggestReleases(prefix: string): Promise<Release[]> {
  const esClient = getElasticClient();

  const {
    body: {
      hits: { hits },
    },
  } = await esClient.search<SearchResponse<Release>>({
    size: 5,
    index: "releases",
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

  const releases: Release[] = hits.map(
    (hit): Release => {
      return hit._source;
    }
  );

  return releases;
}
