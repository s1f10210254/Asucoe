// pages/api/updateGlobalState.ts
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function updateGlobalState(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { count, showModel } = req.body;
        let updatedState;

        // カウント値またはショーモデル値を更新
        if (count !== undefined) {
            updatedState = await prisma.globalState.upsert({
                where: { id: 1 }, 
                update: { count },
                create: { count, showModel: false } // 新しいレコード作成時のデフォルト値
            });
        } else if (showModel !== undefined) {
            updatedState = await prisma.globalState.upsert({
                where: { id: 1 },
                update: { showModel },
                create: { count: 0, showModel } // 新しいレコード作成時のデフォルト値
            });
        } else {
            return res.status(400).json({ error: "Invalid data" });
        }

        res.json(updatedState);
    } else {
        res.status(405).end();
    }
}
