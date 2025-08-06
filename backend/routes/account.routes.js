import express from "express";
import { getAccountsFromDb, getAccountsFromDbTest, getAccountsHierarchical } from "../controllers/accounts.controller.js";

const router = express.Router();

router.get("/get-data", getAccountsFromDb);
router.get("/test", getAccountsFromDbTest);
router.get("/hierarchical", getAccountsHierarchical);

export default router;
