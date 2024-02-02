"use client";
import { api } from "@/lib/api";

export async function getStatus_C({ id }: { id: string }) {
    try {
        const { data } = await api.get(`/${id}/get-status`);
        return data as { status: string };
    } catch (error) {
        console.error(error);
        return null;
    }
}