"use client";

import { IRequestBodyStack } from "@/app/(backend)/api/start-stack/route";
import { api } from "@/lib/api";

export async function startStack({ id }: IRequestBodyStack) {
    try {
        const { data } = await api.post("/start-stack", { id });
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}