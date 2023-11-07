import { graphDataAtom } from "@/utils/jotai"
import { useAtom } from "jotai";
import React, { useEffect, useState} from "react";
// import { LineChart } from '@mui/x-charts/LineChart';
// import { width } from "@fortawesome/free-brands-svg-icons/fa42Group";
// import { IconButton } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { LineChart } from "@mui/x-charts";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartOptions,
  ChartData,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { IconButton } from "@mui/material";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement)


export function Graph() {
    
    const [graphData, setGraphData] = useAtom(graphDataAtom);

    const [sortedGraphData, setSortedGraphData] = useState<{date:string, emotionalValue: number }[]>([]);

    useEffect(() => {
      setSortedGraphData([...graphData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    }, [graphData]);

    


  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [result, setResult] = useState<(number | null)[]>([]);
 
  useEffect(() => {
    const daysInMonth = new Date(new Date().getFullYear(), currentMonth + 1,0).getDate();

    const newResult = new Array(daysInMonth).fill(null);

    sortedGraphData.forEach((item) => {
      const date = new Date(item.date);
      const month = date.getMonth();
      const day = date.getDate() - 1; // 配列は0から始まるので、1を引く
  
      if (month === currentMonth) {
        newResult[day] = item.emotionalValue; // 日にちに応じた位置に感情値を設定
      }
    });
  
  
    setResult(newResult);
    
  }, [sortedGraphData, currentMonth]);

 
  


  const labels = result.map((_, index) => `${index + 1}`);


  const data: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: '感情値',
        data: result,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        // borderWidth: 3,
        // pointRadius: 5,
        // pointBorderColor: 'blue',
        spanGaps: true,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    // maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
          x: {
            // title: {
            //   display: true,
            //   text: '日', // X軸のタイトル
            //   color: '#666', // タイトルの色
            // },
            ticks:{
              autoSkip:true,
              
            }
          
          },
          y: {
            min: 0,
            beginAtZero: true,
            // title: {
            //   display: true,
            //   text: '感情の数値', // Y軸のタイトル
            //   color: '#666', // タイトルの色
            
            // },
            ticks: {
              stepSize: 1,
            },
          },
        },
  };



  const handlePreviousMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
  };

    
    

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // ウィンドウサイズが変更されたときに実行されるイベントハンドラ
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  // コンポーネントがマウントされた時とアンマウントされた時にイベントリスナーを設定・解除
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    
    // コンポーネントがアンマウントされるときのクリーンアップ関数
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

    return(
      <div >
        <div style={{display:"flex", justifyContent: "center", gap:"10vw",paddingBottom:"50px"}}>
          <IconButton onClick={handlePreviousMonth}>
            <ArrowBackIcon/>
          </IconButton>
          <div><h2 style={{flexGrow: 1, fontSize: 20}}>{currentMonth + 1}月</h2></div>
          <IconButton onClick={handleNextMonth}>
            <ArrowForwardIcon/>
          </IconButton>
        </div>
        
          <Line options={options} data={data} width={windowWidth }/>
        
      </div>
    )
  }
  
