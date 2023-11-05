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
    
    useEffect(() => {
        if (count === 0) {
            // 一時的にegg6を表示
            // console.log('count is currently 0, setting to 6');
            setCount(6);

            // 1秒後にegg0を表示
            const timerId = setTimeout(() => {
                // console.log('Setting count to 0 after timeout');
                setCount(0);
            }, 2000);

            return () => {
                // console.log('Clearing timeout');
                clearTimeout(timerId)
            }

        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    
    

    const imagePath = `/icon/egg${count}.png`;


    return (
        <div className={styles.container}>
            <div className={styles.kyoryu} >
            {/* <Image src={imagePath} width={1550} height={1550} alt={`kyoryu ${count}`} /> */}
            <Image key={imagePath} src={imagePath} width={500} height={500} alt={`egg ${count}`} />

            </div>
        </div>
    )
}