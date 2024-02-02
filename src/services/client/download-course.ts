"use client";
import axios, { AxiosRequestConfig } from "axios";

export const downloadCourse_C = async ({ id }: { id: string }) => {
    const url = 'https://api.pdfshift.io/v3/convert/pdf/';
    const data = {
        source: `https://mgtk-ai-course.vercel.app/${id}`,
        landscape: false,
        use_print: false
    };

    const config: AxiosRequestConfig = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${Buffer.from('api:sk_eb79ffe89794390b6a39f92b89af38fa7e57be3f').toString('base64')}`
        },
        responseType: 'blob'
    };

    return axios.post(url, data, config)
}