interface IEnv {
    GOOGLE_API_KEY: string;
}

export const Env: IEnv = {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
}