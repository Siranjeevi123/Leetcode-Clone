import axios from "axios";
import type { Submission } from "../types/submission.types";

const submitBatch = async (submissions: Submission[]) => {
  try {
    console.log(process.env.JUDGE0_KEY);

    const response = await axios.post(
      `${process.env.JUDGE0_KEY}/submissions/batch?base64_encoded=false`,
      {
        submissions,
      }
    );
    return response.data;
  } catch (err: any) {
    
    throw err;
  }
};

export default submitBatch;