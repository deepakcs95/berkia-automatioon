import { cache } from "react";
import { db } from "./prisma";


export const getChatbotUserId = cache(async (id: string) => {
    return await db.chatbot.findUnique({ where: { id } });
});