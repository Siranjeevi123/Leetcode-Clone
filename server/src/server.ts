import express from "express";
import main from "./config/db.config";
import redis_client from "./config/redis.config";
import authRouter from "./router/auth.router";
import SubmissionRouter from "./router/submission.router";
import ProblemRouter from "./router/problem.router";
const app = express();

app.use(express.json());

app.use('/auth',authRouter);
app.use('/problem',ProblemRouter);
app.use('/submission',SubmissionRouter)

const initialization = async () => {
  try {
    await Promise.all([main(),redis_client.connect()]);
    console.log("DB and redis is connected...");
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening at ${process.env.PORT}...`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    
  }
};

initialization();

