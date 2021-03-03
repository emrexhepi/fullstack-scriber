import { Router } from "express";
import SuggestionsRouter from "./Suggestions";

// Init router and path
const router = Router();

// Add sub-routes
router.use("/suggest", SuggestionsRouter);

// Export the base-router
export default router;
