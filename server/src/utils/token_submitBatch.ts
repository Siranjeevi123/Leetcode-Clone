import axios from "axios";
import extractAxiosError from "./extractAxiosError";
import { decodeJudgeResult } from "./judge0Codec";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const token_submit = async (tokens: string[]) => {
  while (true) {
    try {
      const response = await axios.get(
        `${process.env.JUDGE0_KEY}/submissions/batch`,
        {
          params: {
            tokens: tokens.join(","),
            base64_encoded: true,
          },
        }
      );

      const submissions = response.data.submissions.map(decodeJudgeResult);
      const allFinished = submissions.every(
        (submission: { status: { id: number } }) => submission.status.id > 2
      );

      if (allFinished) return submissions;

      await sleep(1000);
    } catch (err: unknown) {
      throw new Error(extractAxiosError(err));
    }
  }
};

export default token_submit;
