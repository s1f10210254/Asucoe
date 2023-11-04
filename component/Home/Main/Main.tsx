import { commentBoxShowAtom, emotionalSixListAtom, messageListAtom } from "@/utils/jotai";
import { baseURL } from "@/utils/url";
import { useAtom } from "jotai";
import styles from "./Main.module.css"
import { useEffect, useRef, useState } from "react";

export function Main(){
    const [messageList, setMessageList] = useAtom(messageListAtom);
    const [commentBoxShow, setCommentBoxShow] = useAtom(commentBoxShowAtom);
    const containerRef = useRef<HTMLDivElement>(null); 

    const getMessages= async()=>{
        const response = await fetch(`${baseURL}/api/getDB`,{
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
            },
        })
        const data = await response.json()
        const DB_calendar = data.calendar;
        const DB_messages = data.messages;
        // console.log('DB_calendar',DB_calendar)
        // console.log('DB_messages',DB_messages)

        const combinedData = DB_messages.map((item:any)=>({
            content : item.content,
            timestamp:item.timestamp,
            calendarId: item.calendarId
        }))

        const combinedDataCalendar = DB_calendar.map((item : any)=>({
            date: item.date,
            emotionalValue: item.emotionalValue,
            id: item.id
        }))
        return {combinedData, combinedDataCalendar};
    }

    const [emotionalSixList, setEmotionalSixList] = useAtom(emotionalSixListAtom);
    
    interface Message {
        calendarId: number;
        content: string;
        timestamp: string;
        date?:string
        // 他にもメッセージに関するプロパティがあればここに追加
      }
      
      interface CalendarItem {
        id: number;
        date: string;
        // 他にもカレンダーアイテムに関するプロパティがあればここに追加
      }
    useEffect(()=>{
        const fetchMessages=async()=>{
            // const DB_message = (await getMessages()).combinedData;
            // setMessageList(DB_message)
            const { combinedData, combinedDataCalendar } = await getMessages();
    
            // カレンダーIDに基づいて日付を見つけるヘルパー関数
            const findDateByCalendarId = (calendarId: number): string | null => {
                const calendarItem = combinedDataCalendar.find((item: CalendarItem) => item.id === calendarId);
                return calendarItem ? calendarItem.date : null;
            };

            const sortedMessages = combinedData
                .map((message: Message) => ({
                    ...message,
                    date: findDateByCalendarId(message.calendarId), // date が undefined の可能性がある
                }))
                .sort((a: Message, b: Message) => {
                // date の値があることを確認する
                const dateA = a.date ? new Date(a.date).getTime() : 0;
                const dateB = b.date ? new Date(b.date).getTime() : 0;
                return dateA - dateB; // 0 はデフォルト値として使う（または他のロジックを適用）
                });
        
        

            setMessageList(sortedMessages);
        }
        // console.log(messageList)

        //DBからemotional6個もってくるために使用
        const fetchCalendar = async()=>{
            const DB_calendar = await getMessages();
            // console.log(DB_calendar.combinedDataCalendar)
            const EmotionalArray: number[]= DB_calendar.combinedDataCalendar.map((item:any)=>item.emotionalValue)
            const EmotionalCatLatestSix = EmotionalArray.reverse().slice(0,6).reverse();
            if(EmotionalCatLatestSix.length > 5){
                setEmotionalSixList(EmotionalCatLatestSix)
            }
        }
        
        
        fetchMessages();
        
        fetchCalendar();
    },[setMessageList, setEmotionalSixList]);


    useEffect(() => {
        // 2. メッセージリストが変更されるたびにスクロール位置を最下部に設定
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messageList]);
    
    return (
        <div className={commentBoxShow ? styles.container : styles.container1} ref={containerRef}>
            <div style={{ width: '80vw', display: 'flex',flexDirection:'column'}}>
            {messageList.map((message,index)=>(
                <div
                    key={message.calendarId}
                >
                    <div className={styles.timestamp}>{message.timestamp}</div>
                        <div className={index % 2 === 0 ? styles.leftMessage : styles.rightMessage}>
                            {message.content}
                        </div>
                    
                    </div>
            ))}
            </div>
            
        </div>
    )
}