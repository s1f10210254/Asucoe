import { UserAtom, commentBoxShowAtom, countAtom, emotionalSevenTotalAtom, emotionalSixListAtom, messageListAtom, showModelAtom } from "@/utils/jotai";
import { baseURL } from "@/utils/url";
import { useAtom } from "jotai";
import styles from "./CommentBox.module.css"
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { getCurrentTimestamp } from "@/utils/CurrentTime";
import { useEffect, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import React from "react";
import { motion } from "framer-motion";
import { stringify } from "querystring";
import { json } from "stream/consumers";

export function CommentBox(){

    const [messageList, setMessageList] = useAtom(messageListAtom);
    const [messageContent, setMsseageContent] = useState<string>('');

    const [showModel, setShowModel] = useAtom(showModelAtom);
    const [commentBoxShow, setCommentBoxShow] = useAtom(commentBoxShowAtom);

    type PostObject = {
        date: string;
        content: string;
        timestamp: string;
    }

    const addContent = async(postObject: PostObject)=>{
        const response = await fetch(`${baseURL}/api/postDB_message_calendar`,{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postObject),
        })

        const data = await response.json();
        const DB_calendar = data.calendar;
        // console.log("DB_calendar",DB_calendar)
        const DB_message = data.message;
        // console.log("DB_message",DB_message)
        return{
            calendar: DB_calendar,
            message: DB_message
        }
    }


    

    const scoringGPT =async(content : string) =>{
        const response= await fetch(`${baseURL}/api/scoringGPTAPI`, {
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(content),
        })
        const data = await response.json();
        // console.log(""data)
        
        return data;
    }


    type User ={
        name:string,
        gender: string,
        age: string,
        profession: string
    }
    const counselingGPT = async(user: User,content: string)=>{
        const response = await fetch(`${baseURL}/api/counselingGPTAPI`,{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: user,
                content:content,
            }),
            
        })
        const data = await response.json();
        return data;
    }

    //emotinalValueをDBに追加
    const addEmotinalValueDB =async( calendarId:number ,emotionalValue:number)=>{
        const response = await fetch(`${baseURL}/api/addEmotionalValueAPI`,{
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({ id: calendarId, emotionalValue: emotionalValue}),
        })
        const data = await response.json();
        
        return data;
    }

    const addCounselingDB =async (calendarId:number, counseling: string) => {
        const response = await fetch(`${baseURL}/api/addCounselingAPI`,{
            method: "POST",
            headers:{
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({ id: calendarId, counseling: counseling}),
        })
        const data = await response.json();
        return data;
    }
    const [emotionalSixList] = useAtom(emotionalSixListAtom);
    const [emotionalSevenTotal, setEmotionalSevenTotal] = useAtom(emotionalSevenTotalAtom)

    const runGPT = async(calendarId: number)=>{
        if(messageContent === "") return;
        const GPTScoringValue:number = await scoringGPT(messageContent);
        
        // console.log("GPTScoringVaule",GPTScoringValue);

        // console.log("calendarId", calendarId)

        if(emotionalSixList !== null){
            const totalEmotionalValue = emotionalSixList.reduce((accumulator, curretValue) => accumulator + curretValue, 0) + GPTScoringValue
            if(count === 7){
                setEmotionalSevenTotal(totalEmotionalValue);
            }else{
                setEmotionalSevenTotal(0);
            }
        }
        


        //ここでGPTscoringの内容をDBに接続
        await addEmotinalValueDB(calendarId,GPTScoringValue);
    }

    const [user] = useAtom(UserAtom)
    const runCounseling = async(calendarId: number)=>{
        if(messageContent==="") return;
        const GPTCounseling:string = await counselingGPT(user,messageContent);

        await addCounselingDB(calendarId, GPTCounseling);
        
    }

    const updateGlobalState = async (count: number, showModel:boolean)=>{
        const response = await fetch(`${baseURL}/api/updateGlobalState`,{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ count, showModel}),
        });
        if(!response.ok){
            console.error('Failed to update global state');
        }
    }

    const [count, setCount] = useAtom(countAtom);

   
    const run = async()=>{
        if(messageContent === "") return;
        const nowString = getCurrentTimestamp();
        const now = new Date().toISOString()
        const addObject ={
            date:now,
            content:messageContent,
            timestamp: nowString,
        }
        const newCalendarData = await addContent(addObject)
        const MessageObject = newCalendarData.message
        setMessageList((prevMessageList)=>[...prevMessageList, MessageObject]);
        setMsseageContent("");
        

        setCommentBoxShow(false);
        //reactに動作の"前"と"今"のcountを明確にさせるための動作
        setCount(prevCount => {
            const newCount = (prevCount + 1) % 7;
            // localStorage.setItem('count', JSON.stringify(newCount));
            return newCount //+1を保存したいもんね
        });

        await updateGlobalState((count + 1) % 7, false)

        setShowModel(true);

        runGPT(newCalendarData.calendar.id);
        runCounseling(newCalendarData.calendar.id);      
    }

    useEffect(() => {
        const fetchGlobalState = async () => {
            const response = await fetch(`${baseURL}/api/getGlobalState`);
            if (response.ok) {
                const data = await response.json();
                setCount(data.count);
                setCommentBoxShow(data.comentBoxShow);
            } else {
                console.error('Failed to fetch global state');
            }
        };
    
        fetchGlobalState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    

    return (
        <div className={styles.container}>
            <div className={styles.inputContainer}>
                <TextField 
                    className={styles.textFieldStyle}
                    
                    variant="outlined"
                    multiline
                    rows={1}
                    placeholder="明日の自分へ"
                    value={messageContent}
                    onChange={(e) => setMsseageContent(e.target.value)}
                    InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={run}
                              edge="end"
                              style={{backgroundColor: '#91CAD3', color: 'white', borderRadius: '20px'}}
                            >
                              <SendIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                        style: { borderRadius: 30 },
                      }}

                />
            </div>
        </div>
    )
}