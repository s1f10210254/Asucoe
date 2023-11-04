import { countAtom, emotionalSevenTotalAtom, showModelAtom } from '@/utils/jotai';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import styles from './ShowModel.module.css'
import Image from 'next/image';
import { useEffect } from 'react';

export const ShowModel = () => {
    const [showModel] = useAtom(showModelAtom)

    const [count, setCount] = useAtom(countAtom);

    //7になったら数がでる。それ以外は０になる。なので０以外だったら処理すればおｋ
    const [emotinalSevenTotal] = useAtom(emotionalSevenTotalAtom)

    console.log("count", count)

    //これでパス設定
    // const imagePath = `/icon/kyoryu${count}.png`;
    const imagePath = `/icon/egg${count}.png`;


    return (
        <div className={styles.container}>
            <div className={styles.kyoryu} >
            {/* <Image src={imagePath} width={1550} height={1550} alt={`kyoryu ${count}`} /> */}
            <Image src={imagePath} width={1550} height={1550} alt={`egg ${count}`} />

            </div>
        </div>
    )
}