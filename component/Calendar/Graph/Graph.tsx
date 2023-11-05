// import { graphDataAtom } from "@/utils/jotai"
// import { useAtom } from "jotai";
// import React, { useEffect, useState} from "react";
// import { LineChart } from '@mui/x-charts/LineChart';
// import { width } from "@fortawesome/free-brands-svg-icons/fa42Group";
// import { IconButton } from "@mui/material";
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';




// export function Graph() {
    
//     const [graphData, setGraphData] = useAtom(graphDataAtom);
    
//     //昇順表示
//     useEffect(() => {
//       // graphData が更新された後に実行される
//       setGraphData(graphData => {
//         // 新しい配列インスタンスを作成してソートする
//         const sortedData = [...graphData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
//         return sortedData;
//       });
//     }, [setGraphData]);


    


//   const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
//   const [result, setResult] = useState<number[]>([]);
//   const [labels, setLabels] = useState<number[]>([]);
//   useEffect(()=>{
//     const tempResult: number[] = [];
//     const tempLabels: number[] = []

//     graphData.forEach((item)=>{
//       const date = new Date(item.date) ;
//       const month = date.getMonth();

//       if(month === currentMonth){
//         tempResult.push(item.emotionalValue);
//         tempLabels.push(date.getDate() );
//       }
//     })

//     setResult(tempResult);
//     setLabels(tempLabels);
//   },[graphData, currentMonth])  

//   // console.log("result",result)
//   // console.log("labels",labels)

//   const handlePreviousMonth = () => {
//     setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
//   };
  
//   const handleNextMonth = () => {
//     setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
//   };

    
    

//     const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   // ウィンドウサイズが変更されたときに実行されるイベントハンドラ
//   const handleResize = () => {
//     setWindowWidth(window.innerWidth);
//   };

//   // コンポーネントがマウントされた時とアンマウントされた時にイベントリスナーを設定・解除
//   useEffect(() => {
//     window.addEventListener('resize', handleResize);
    
//     // コンポーネントがアンマウントされるときのクリーンアップ関数
//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//     return(
//       <div >
//         <div style={{display:"flex", justifyContent: "center", gap:"10vw"}}>
//           <IconButton onClick={handlePreviousMonth}>
//             <ArrowBackIcon/>
//           </IconButton>
//           <div><h2 style={{flexGrow: 1, fontSize: 20}}>{currentMonth + 1}月</h2></div>
//           <IconButton onClick={handleNextMonth}>
//             <ArrowForwardIcon/>
//           </IconButton>
//         </div>
//         {result.length > 0 && labels.length > 0 && (
//           <LineChart
//           xAxis={[{data:labels}]}
//             series={[
//               { 
//                 curve:"linear",
//                 data:result,
//               },
//             ]}
            
//             width={windowWidth}
//             height={300}
//           />
//         )}
//       </div>
//     )
//   }
  
