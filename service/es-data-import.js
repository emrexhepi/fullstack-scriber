const { Client } = require("@elastic/elasticsearch");
const fs = require("fs");
const data = require("./data.json");

const esClient = new Client({ node: "http://localhost:9200" });

console.log("Indexing Releases");

const bulkIndex = async (data) => {
  let trackCount = 0;

  console.log("Bulk indexing!");

  while (data.length) {
    let releases = [];
    let tracks = [];
    let artists = [];

    const dataChunk = data.splice(0, 1000);
    dataChunk.forEach((release) => {
      const tmpRelease = {
        id: release.Id,
        title: release.Title,
        notes: release.Notes,
      };

      release.TrackList.forEach((track) => {
        const id = trackCount++;
        tracks.push({
          index: {
            _index: "tracks",
            _type: "track",
            _id: id,
          },
        });
        tracks.push({
          id,
          title: track.Title,
          duration: track.Duration,
          release: tmpRelease,
        });
      });

      release.Artists.forEach((artist) => {
        artists.push({
          index: {
            _index: "artists",
            _type: "artist",
            _id: artist.Id,
          },
        });
        artists.push({
          id: artist.Id,
          name: `${artist.Name}`,
        });
      });

      releases.push({
        index: {
          _index: "releases",
          _type: "release",
          _id: tmpRelease.id,
        },
      });

      releases.push({
        ...tmpRelease,
        artist: release.Artists,
      });
    });

    try {
      await esClient.bulk({ body: releases });
      await esClient.bulk({ body: tracks });
      await esClient.bulk({ body: artists });
    } catch (error) {
      console.error("ERROR", error);
    }
  }

  console.log("Indexing Finished!");
};

const deleteIndicies = async () => {
  console.log("Delete Indicies!");
  try {
    await esClient.indices.delete({
      index: "artists",
    });
  } catch {}

  try {
    await esClient.indices.delete({
      index: "tracks",
    });
  } catch {}

  try {
    await esClient.indices.delete({
      index: "releases",
    });
  } catch {}
};

const createIndicies = async () => {
  console.log("Creating Indicies!");
  try {
    await esClient.indices.create({
      index: "releases",
      // type: "release",
      body: {
        settings: {
          index: {
            analysis: {
              analyzer: {
                analyzer_startswith: {
                  tokenizer: "keyword",
                  filter: ["lowercase"],
                },
              },
            },
          },
        },
      },
    });

    await esClient.indices.create({
      index: "tracks",
      // type: "track",
      body: {
        settings: {
          index: {
            analysis: {
              analyzer: {
                analyzer_startswith: {
                  tokenizer: "keyword",
                  filter: "lowercase",
                },
              },
            },
          },
        },
      },
    });

    await esClient.indices.create({
      index: "artists",
      // type: "artist",
      body: {
        settings: {
          analysis: {
            analyzer: {
              analyzer_startswith: {
                tokenizer: "keyword",
                filter: "lowercase",
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.log("Error:", JSON.stringify(error));
    process.exit(1);
  }
};

const putMappings = async () => {
  console.log("Put Mappings!");
  try {
    await esClient.indices.putMapping({
      index: "artists",
      // type: "artist",
      body: {
        properties: {
          name: {
            analyzer: "analyzer_startswith",
            search_analyzer: "analyzer_startswith",
            type: "text",
          },
        },
      },
    });
  } catch (error) {
    console.log("Error", JSON.stringify(error));
  }
};

const indexData = async () => {
  await deleteIndicies();
  // await createIndicies();
  // await putMappings();
  bulkIndex(data.releases);
};

indexData();
