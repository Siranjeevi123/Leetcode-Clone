import redis_client from "../config/redis.config";
import type { Request,Response,NextFunction } from "express";
const slidingWindow = (windowSize: number,maxRequests: number) => {
  return async (req: Request,res: Response,next: NextFunction) => {
    try {
      const key = `rate_limit:${req.ip}:${req.path}`;

      const currentTime = Date.now() / 1000;
      const windowStart = currentTime - windowSize;

      await redis_client.zRemRangeByScore(key, 0, windowStart);

      const requestCount = await redis_client.zCard(key);

      if (requestCount >= maxRequests) {
        return res.status(429).json({
          success: false,
          message: "Too many requests",
        });
      }

      await redis_client.zAdd(key, [
        {
          score: currentTime,
          value: `${currentTime}:${Math.random()}`,
        },
      ]);

      await redis_client.expire(key, windowSize);

      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Rate limiter error",
      });
    }
  };
};

export default slidingWindow;