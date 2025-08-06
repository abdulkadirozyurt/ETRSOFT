import axios from "axios";
import { getToken } from "./token.service.js";
import { agent } from "../utils/https.agent.js";

export const getDataFromApi = async () => {
  const token = await getToken();

  if (!process.env.DATA_API_ADDRESS) {
    throw new Error("DATA_API_ADDRESS environment variable is not defined");
  }

  try {
    const response = await axios.patch(
      process.env.DATA_API_ADDRESS,
      {
        fieldData: {},
        script: "getData",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        httpsAgent: agent,
      }
    );
    let result = response.data.response.scriptResult;

    if (typeof result === "string") {
      try {
        result = JSON.parse(result);
      } catch (e) {
        console.error("Failed to parse data as JSON:", e);
      }
    }

    return result;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
};
