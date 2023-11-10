// pages/api/getGlobalState.ts
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function getGlobalState(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const globalState = await prisma.globalState.findUnique({
            where: { id: 1 } // グローバルステートのID
        });

        if (globalState) {
            res.json(globalState);
        } else {
            res.status(404).json({ message: "Global state not found" });
        }
    } else {
        res.status(405).end();
    }
}
