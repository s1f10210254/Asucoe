import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function saveGlobalStateDBAPI(req: NextApiRequest, res:NextApiResponse) {
    if(req.method === 'POST'){
        const { key , value} = req.body;
        try{
            const globalState = await prisma.globalState.upsert({
                where: { key:key},
                update:{ value:value},
                create :{key:key, value:value},
            });
            res.json({globalState})

        }catch(error){
            console.error('Error saving global state:', error)
        }
    }
    
}