import express from "express";
import { getAccountsFromDb, getAccountsHierarchical, getRawDataFromApi } from "../controllers/accounts.controller.js";

const router = express.Router();

router.get("/get-from-api", getRawDataFromApi);
router.get("/get-data", getAccountsFromDb);
router.get("/hierarchical", getAccountsHierarchical);

export default router;
