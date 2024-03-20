// Import PrismaClient for database operations
import { PrismaClient } from "@prisma/client";

import { submissionSchema } from "../schemas/submissionSchema.js";
import { createRedisInstance } from "../utils/redis.js";

const prisma = new PrismaClient();
const redisClient = createRedisInstance();

export const postSubmission = async (req, res) => {
  const { username, codeLanguage, sourceCode, stdIn, stdOut } = req.body.data;

  try {
    // Check if the user already exists
    const submissionData = submissionSchema.parse({
      username,
      codeLanguage,
      sourceCode,
      stdIn,
    });

    let user = await prisma.user.findFirst({
      where: { username: username },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          username,
        },
      });
    }

    const submission = await prisma.submission.create({
      data: {
        language: codeLanguage,
        stdin: stdIn,
        sourceCode,
        stdout: stdOut,
        userId: user.id,
      },
    });

    const allSubmissions = await prisma.submission.findMany({
      include: { user: true },
    });

    // Set cache for all submissions
    const submissionsCacheKey = `allSubmissions`;
    await redisClient.setex(
      submissionsCacheKey,
      3600,
      JSON.stringify(allSubmissions)
    );

    res
      .status(201)
      .json({ message: "Submission created successfully!", submission });
  } catch (error) {
    console.error("Error creating submission:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSubmission = async (req, res) => {
  try {
    const allSubmissions = await prisma.submission.findMany({
      include: { user: true },
    });

    if (!allSubmissions.length) {
      return res.status(404).json({ error: "No submissions found" });
    }

    // Set cache for all submissions
    const submissionsCacheKey = `allSubmissions`;
    await redisClient.setex(
      submissionsCacheKey,
      3600,
      JSON.stringify(allSubmissions)
    );

    res.status(200).json({ submissions: allSubmissions });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
