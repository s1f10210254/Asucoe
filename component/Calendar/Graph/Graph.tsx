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

    // const [sortedGraphData, setSortedGraphData] = useState([]);
    
    //昇順表示
    // useEffect(() => {
    //   // graphData が更新された後に実行される
    //   setGraphData(graphData => {
    //     // 新しい配列インスタンスを作成してソートする
    //     const sortedData = [...graphData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    //     return sortedData;
    //   });
    //   // const sortedData = [...graphData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    //   // setSortedGraphData(sortedData);

    // }, [setGraphData]);
    const [sortedGraphData, setSortedGraphData] = useState<{date:string, emotionalValue: number }[]>([]);

    useEffect(() => {
      setSortedGraphData([...graphData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    }, [graphData]);

    


  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [result, setResult] = useState<number[]>([]);
  // const [labels, setLabels] = useState<number[]>([]);
  useEffect(()=>{
    const tempResult: number[] = [];
    const tempLabels: number[] = []

    sortedGraphData.forEach((item)=>{
      const date = new Date(item.date) ;
      const month = date.getMonth();

      if(month === currentMonth){
        tempResult.push(item.emotionalValue);
        tempLabels.push(date.getDate() );
      }
    })

    setResult(tempResult);
    // setLabels(tempLabels);
  },[sortedGraphData, currentMonth])  


  const labels = result.map((_, index) => `${index + 1}`);


  const data: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: '感情値',
        data: result,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        min: 1,
        beginAtZero: true,
        ticks:{
          stepSize:1,
          
          
        }
      },
    },
  };

  // // console.log("result",result)
  // // console.log("labels",labels)

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
        <div style={{display:"flex", justifyContent: "center", gap:"10vw"}}>
          <IconButton onClick={handlePreviousMonth}>
            <ArrowBackIcon/>
          </IconButton>
          <div><h2 style={{flexGrow: 1, fontSize: 20}}>{currentMonth + 1}月</h2></div>
          <IconButton onClick={handleNextMonth}>
            <ArrowForwardIcon/>
          </IconButton>
        </div>
        <Line options={options} data={data} width={windowWidth}/>
        {/* {result.length > 0 && labels.length > 0 && (
          <LineChart
          xAxis={[{data:labels}]}
            series={[
              { 
                curve:"linear",
                data:result,
              },
            ]}
            
            width={windowWidth}
            height={300}
          />
        )} */}
      </div>
    )
  }
  
