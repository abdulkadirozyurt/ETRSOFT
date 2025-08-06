import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const { DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, PROD_DB_URL, NODE_ENV } = process.env;

// Production ortamında DATABASE_URL kullan, development'ta ayrı parametreler
const isProduction = NODE_ENV === 'production';

export const sequelize = isProduction 
  ? new Sequelize(PROD_DB_URL, {
      dialect: "postgres",
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    })
  : new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, {
      host: "localhost",
      dialect: "postgres",
      logging: false,
    });

export const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    // Sadece development ortamında veritabanı oluşturmaya çalış
    if (!isProduction && error.original && error.original.code === "3D000") {
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

  await sequelize.sync({ force: false });
};
