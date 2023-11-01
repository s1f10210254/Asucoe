import { commentBoxShowAtom, messageListAtom } from "@/utils/jotai";
import { baseURL } from "@/utils/url";
import { useAtom } from "jotai";
import styles from "./Main.module.css"
import { useEffect, useRef } from "react";

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
            emotinalValue: item.emotinalValue,
            id: item.id
        }))
        return combinedData;
    }

    useEffect(()=>{
        const fetchMessages=async()=>{
            const DB = await getMessages();
            setMessageList(DB)
        }
        
        fetchMessages();
    },[setMessageList]);

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
                    key={index}
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