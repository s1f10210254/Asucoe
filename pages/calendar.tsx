import Link from "next/link"
import styles from "./calendar.module.css"
import { Collapse, Fade, Grow, IconButton, Slide, Zoom } from "@mui/material"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useCallback, useEffect, useMemo, useState } from "react";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import ReviewsIcon from '@mui/icons-material/Reviews';
import { DayData, getDaysInMonth, isToday } from "@/utils/makeCalendar";
import { baseURL } from "@/utils/url";
import { Graph } from "@/component/Calendar/Graph/Graph";
import { useAtom } from "jotai";
import { graphDataAtom } from "@/utils/jotai";
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function Calendar(){
    const [isGraphCalendar, setIsGraphCalendar] = useState<boolean>(true);
    const [graphData, setGraphData] = useAtom(graphDataAtom);

    // const [flipAnimation, setFlipAnimation] = useState(false);

    const isChangeCalendarGraph=()=>{
        setIsGraphCalendar(!isGraphCalendar)
        // setFlipAnimation(true);
        // setTimeout(() => {
        //     setIsGraphCalendar((prev) => !prev);
        //     setFlipAnimation(false);
        //   }, 500);
    }

    type CalendarItem = {
        date: string;
        emotionalValue: number;
        id: number;
    }
    
    type MessageItem = {
        content: string;
        timestamp: string;
        calendarId: number;
        counseling: string;
    }

    const [eventData, setEventData] = useState<any[]>([]);
    const [DbCalendarData, setDbCalendarData] = useState<CalendarItem[]>([]);
    const [DbMessageData, setDbMessageData] = useState<MessageItem[]>([]);

    const getCalendar = async()=>{
        const responce = await fetch(`${baseURL}/api/getDB`,{
            method:'GET',
            headers:{
                'Content-Type' : 'application/json',
            },
        })
        const data = await responce.json()
        const DB_calendar = data.calendar;
        const DB_messages = data.messages;

        const combinedData_Calendar = DB_calendar.map((item:any)=>({
            date : item.date,
            emotionalValue : item.emotionalValue,
            id : item.id
        }))

        const combinedDate_messages = DB_messages.map((item:any)=>({
            content : item.content,
            timestamp:item.timestamp,
            calendarId: item.calendarId,
            counseling: item.counseling
        }))
        return { combinedData_Calendar, combinedDate_messages}
    }
    
    useEffect(()=>{
        const fetchDB = async()=>{
            const DB = await getCalendar();
            setDbCalendarData(DB.combinedData_Calendar)
            setDbMessageData(DB.combinedDate_messages);
            
            //DBからdateとemotionalValueを受け取り渡す。
            const dateEmotinalData = DB.combinedData_Calendar.map((item:any)=>({
                date: item.date,
                emotionalValue: item.emotionalValue,
            }))
            setGraphData(dateEmotinalData);

            // 今日の日付に対応するcalendarItemを探します
            const today = new Date();
            const todayCalendarItem = DB.combinedData_Calendar.find(
                (item: CalendarItem) => new Date(item.date).getDate() === today.getDate() &&
                    new Date(item.date).getMonth() === today.getMonth() &&
                    new Date(item.date).getFullYear() === today.getFullYear()
            );

            // そのcalendarItemに対応するメッセージを探し、selectedMessageにセットします
            if (todayCalendarItem) {
                const messageForToday = DB.combinedDate_messages.find(
                    (msg: MessageItem) => msg.calendarId === todayCalendarItem.id
                );
                if (messageForToday) {
                    setSelectedMessage(messageForToday.content);
                }
                const counselorForToday = DB.combinedDate_messages.find(
                    (counselor: MessageItem) => counselor.calendarId === todayCalendarItem.id
                )
                if(counselorForToday){
                    setSelectedCounseling(counselorForToday.counseling)
                }
            }

        }
        fetchDB()
    },[setGraphData]);

    const emotionalValueToColor = (value: number) => {
        if(value === 1) return '#EAF4FF'; 
        if(value === 2) return "#D4E8FF";
        if(value === 3) return "#BFDFFF";
        if(value === 4) return "#A9D6FF";
        if(value === 5) return "#93CEFF";
    };
    
      
    useEffect(()=>{
        const eventData = DbCalendarData.map(calendarItem =>{
            const message = DbMessageData.find(
                messageItem => messageItem.calendarId === calendarItem.id
            );
            return{
                date: new Date(calendarItem.date),
                note: message ? message.content  : "",
                color : emotionalValueToColor(calendarItem.emotionalValue),
                counseling: message ? message.counseling : "",
            }
        })
        setEventData(eventData);
    },[DbCalendarData, DbMessageData])
    

        
    const [currentDate, setCurrentDate] = useState(new Date());
    const days = ["日", "月", "火", "水", "木", "金", "土"];

    

    const prevMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
    }
    
    const nextMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
    }

    

    const generateCalendarDays = (date: Date): DayData[]=>{
        const month = date.getMonth();
        const year = date.getFullYear()

        const daysInMonth = getDaysInMonth(month + 1, year);
        const firstDayOfMonth = new Date(year, month, 1).getDay();

        const daysArray: DayData[] = [];

        for(let i = 0; i < firstDayOfMonth; i++) {
            daysArray.push({ date: null });
        }

        for(let i = 1; i<= daysInMonth; i++){
            const currentDate = new Date(year, month, i);
            const dataForDay = eventData.find(data => 
                data.date && 
                data.date.getDate() === i && 
                data.date.getMonth() === month && 
                data.date.getFullYear() === year
            );
            if(dataForDay){
                daysArray.push(dataForDay);
            }else{
                daysArray.push({
                    date:currentDate,
                    color: isToday(currentDate) ? "white" : "rgb(255, 255, 255)",
                    note : isToday(currentDate) ? "今日" : "イベントはまだ書かれていないです"
                })
            }
        }
        return daysArray;
    }
    const calendarDays = generateCalendarDays(currentDate)

    const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
    const [selectedCounseling, setSelectedCounseling] = useState<string | null>(null);

    const handleDayClick = (day: DayData) => {
        setSelectedMessage(day.note || null);
        setSelectedCounseling(day.counseling || null);
    };


    const [showCounseling, setShowCounseling] = useState(false);

   
    
    return (
        <div className={styles.container}>
            <div className={styles.topbar}>
            <Link href="/" passHref>
                <IconButton aria-label="Home" size="large" style={{ marginLeft: 'auto', padding: '8px', color: '#000000' }}>
                    <HomeIcon fontSize="inherit"/>
                </IconButton>
            </Link>
            <IconButton size="large" style={{ padding: '8px', color: '#000000' , marginRight: '0px'}} onClick={isChangeCalendarGraph}>
                {isGraphCalendar ? <AutoGraphIcon fontSize="inherit"/> : <CalendarMonthIcon fontSize="inherit"/>}
            </IconButton>
           
            
            
            </div>

            <div className={styles.calendarGraph}>
                <Slide direction="left" in={isGraphCalendar} mountOnEnter unmountOnExit>
                {/* {isGraphCalendar&&( */}
                    <div className={styles.calendarGraph}>
                    <div className={styles.calendarHeader}>
                    <IconButton onClick={prevMonth}>
                        <ArrowBackIcon/>
                    </IconButton>
                    <h2 className={styles.calendarMonth}>
                        {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
                    </h2>
                    <IconButton onClick={nextMonth}>
                        <ArrowForwardIcon/>
                    </IconButton>
                    </div>
                
                    <div className={styles.daysHeader}>
                        {days.map(day => <div key={day} className={styles.dayHeader}>{day}</div>)}
                    </div>
                    <div className={styles.days}>
                        {calendarDays.map((day,index)=>(
                            <div 
                                key={index} 
                                className={styles.day}  
                                onClick={() => handleDayClick(day)}
                                style={{ backgroundColor : day.color || 'rgb(255, 255, 255)'}}
                            >
                                {day.date ? day.date.getDate() : ""}
                            </div>
                        ))}
                    </div>
                </div>
                {/* )} */}
                
                </Slide>
                <Slide direction="right" in={!isGraphCalendar} mountOnEnter unmountOnExit timeout={500}>
                    <div><Graph/></div>
                </Slide>
                

            </div>
            <div>
                {selectedMessage &&(
                    <>
                    <div className={styles.noteDisplay}>
                    <ReviewsIcon onClick={() => setShowCounseling(!showCounseling)} />
                        {selectedMessage}
                        {showCounseling &&(
                            <div className={styles.counselingTooltip}>
                                {selectedCounseling}
                            </div>
                        )}
                        
                    </div>
                    
                    </>
                )}
            </div>    
        </div>
    )
}