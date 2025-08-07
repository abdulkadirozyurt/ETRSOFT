import axios from "axios";
import { agent } from "../utils/https.agent.js";

export const getToken = async () => {
  try {
    const response = await axios.post(
      process.env.TOKEN_ADDRESS,
      {},
      {
        auth: {
          username: "apitest",
          password: "test123",
        },
        headers: {
          "Content-Type": "application/json",
        },
        httpsAgent: agent,
      }
    );

    return response.data.response.token;
  } catch (error) {
    console.error("Error fetching token:", error);
  }
};
