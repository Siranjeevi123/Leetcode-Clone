import axios from "axios";
import type { Submission } from "../types/submission.types";
import extractAxiosError from "./extractAxiosError";
import { encodeJudgeSubmission } from "./judge0Codec";

const submitBatch = async (submissions: Submission[]) => {
  try {
    const response = await axios.post(
      `${process.env.JUDGE0_KEY}/submissions/batch?base64_encoded=true`,
      {
        submissions: submissions.map(encodeJudgeSubmission),
      }
    );
    return response.data;
  } catch (err: unknown) {
    throw new Error(extractAxiosError(err));
  }
};

export default submitBatch;
