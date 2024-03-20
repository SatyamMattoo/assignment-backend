import { PrismaClient } from "@prisma/client";
import { createRedisInstance } from "../utils/redis.js";

const prisma = new PrismaClient();
const redisClient = createRedisInstance();

export const cacheMiddleware = async (req, res, next) => {
  try {
    const cacheKey = `allSubmissions`;
    const cachedData = await redisClient.get(cacheKey);

    // If data is found in cache, return it
    if (cachedData !== null) {
      console.log("Data found in cache");
      const data = JSON.parse(cachedData);
      res.json({ submissions: data });
    } else {
      // If data is not found in cache, fetch it from the database
      next();
    }
  } catch (error) {
    console.error("Cache middleware error:", error);
    next();
  }
};
