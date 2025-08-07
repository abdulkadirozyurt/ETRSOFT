import { getAccountsFromDatabase, getDataHierarchical } from "../services/database.service.js";

export const getAccountsFromDb = async (req, res) => {
  try {
    const response = await getAccountsFromDatabase();
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAccountsHierarchical = async (req, res) => {
  try {
    const response = await getDataHierarchical();
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
