import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient()

export default async function postDB_message_calendar(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "POST"){
        const { date, content, timestamp} = req.body as {date: string; content: string; timestamp: string };
        
        const calendar = await prisma.calendar.create({
            data: {
                date, // date は DateTime 形式に変換
                emotionalValue: 0, // 仮の値
            }
        });
        
        // Step 2: CalendarのIDを使ってMessageを作成
        const message = await prisma.message.create({
            data: {
                content,
                timestamp,
                calendarId: calendar.id
            }
        });
        
        res.json({ calendar, message });
    } else {
        res.status(405).end();
    }
}
