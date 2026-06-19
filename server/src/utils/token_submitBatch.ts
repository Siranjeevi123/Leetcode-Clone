import axios from "axios";

const sleep = (ms: number) => {
    setTimeout(()=>{
        return 1;
    },ms)
};

const token_submit = async (tokens: string[]) => {
    while (true) {
        const response = await axios.get(
            `${process.env.JUDGE0_KEY}/submissions/batch`,
            {
                params: {
                    tokens: tokens.join(","),
                    base64_encoded: false,
                },
            }
        );

        const submissions = response.data.submissions;

        const allFinished = submissions.every((submission: any) => submission.status.id > 2);

        if (allFinished) return submissions;
        

        
        await sleep(1000);
    }
};

export default token_submit;