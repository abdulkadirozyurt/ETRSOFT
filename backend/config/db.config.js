import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const { DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD } = process.env;

export const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

export const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    if (error.original && error.original.code === "3D000") {
      console.log(`Database '${DATABASE_NAME}' does not exist. Creating it...`);
      try {
        const tempSequelize = new Sequelize("postgres", DATABASE_USER, DATABASE_PASSWORD, {
          host: "localhost",
          dialect: "postgres",
          logging: false,
        });

        await tempSequelize.query(`CREATE DATABASE "${DATABASE_NAME}"`);
        console.log(`Database '${DATABASE_NAME}' created successfully.`);
        await tempSequelize.close();

        await sequelize.authenticate();
        console.log("Database connection established successfully.");
      } catch (creationError) {
        console.error("Failed to create or connect to the database:", creationError);
        throw creationError;
      }
    } else {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  }

  // await sequelize.sync({ force: false });
};
