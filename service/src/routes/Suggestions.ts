/* eslint-disable @typescript-eslint/no-misused-promises */
import StatusCodes from "http-status-codes";
import { Request, Response, Router } from "express";
import { Artist, Release, Track } from "@interfaces/release-interfaces";
import logger from "@shared/Logger";

import { suggestArtists } from "@services/artist-service";
import { suggestTracks } from "@services/tracks-service";
import { suggestReleases } from "@services/releases-service";

const router = Router();
const { OK, SERVICE_UNAVAILABLE } = StatusCodes;

router.get("/artists", async (req: Request, res: Response) => {
  const prefix = req.query.prefix as string;

  try {
    const artists: Artist[] = await suggestArtists(prefix);
    return res.status(OK).json({
      suggestions: artists,
    });
  } catch (error) {
    logger.err("Error:", error);
    return res.status(SERVICE_UNAVAILABLE).json({
      error: error.code,
    });
  }
});

router.get("/tracks", async (req: Request, res: Response) => {
  const prefix = req.query.prefix as string;

  try {
    const tracks: Track[] = await suggestTracks(prefix);
    return res.status(OK).json({
      suggestions: tracks,
    });
  } catch (error) {
    logger.err("Error:", error);
    return res.status(SERVICE_UNAVAILABLE).json({
      error: error.code,
    });
  }
});

router.get("/releases", async (req: Request, res: Response) => {
  const prefix = req.query.prefix as string;

  try {
    const releases: Release[] = await suggestReleases(prefix);
    return res.status(OK).json({
      suggestions: releases,
    });
  } catch (error) {
    logger.err("Error:", error);
    return res.status(SERVICE_UNAVAILABLE).json({
      error: error.code,
    });
  }
});

router.get("/all", async (req: Request, res: Response) => {
  const prefix = req.query.prefix as string;

  try {
    const [artists, tracks, releases] = await Promise.all([
      suggestArtists(prefix),
      suggestTracks(prefix),
      suggestReleases(prefix),
    ]);

    return res.status(OK).json({
      artists,
      tracks,
      releases,
    });
  } catch (error) {
    logger.err("Error:", error);
    return res.status(SERVICE_UNAVAILABLE).json({
      error: error.code,
    });
  }
});

export default router;
