import {GoogleGenerativeAI} from "@google/generative-ai";


const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
});

async function fileToGenerativePart(file) {
    const based64EncodedDataPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inline_data: {data:await based64EncodedDataPromise, mime_type: file.type},
    };
}

export async function generativeContentStream(prompt, imageFile){
    if(!prompt && !imageFile){
        throw new Error("Mohon berikan prompt atau gambar.");
    }
    const parts = [];
    if (imageFile) {
        const imagePart = await fileToGenerativePart(imageFile);
        parts.push(imagePart);
    }
    if (prompt) {
        parts.push({text:prompt});
    }
    const contents = [{role: 'user', parts}];
    const result = await model.generateContentStream({contents});
    return result;
}