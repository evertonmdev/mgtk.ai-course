interface IEnv {
    GOOGLE_API_KEY: string;
    MODEL_GOOGLE: string;
}

export const Env: IEnv = {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
    MODEL_GOOGLE: process.env.MODEL_GOOGLE || ""
}