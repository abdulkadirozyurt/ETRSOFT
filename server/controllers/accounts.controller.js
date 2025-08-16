import express from "express";
import { getAccountsFromDatabase, getDataHierarchical } from "../services/database.service.js";
import { getDataFromApi } from "../services/external-api.service.js";

export const getRawDataFromApi = async (req, res) => {
  try {
    const response = await getDataFromApi();
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

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
