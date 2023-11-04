import { graphDataAtom } from "@/utils/jotai"
import { useAtom } from "jotai";
import React, { useEffect, useState} from "react";
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
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement)


export function Graph() {
    // const result: number[] = []
    const [graphData, setGraphData] = useAtom(graphDataAtom);

    useEffect(() => {
      // graphData が更新された後に実行される
      setGraphData(graphData => {
        // 新しい配列インスタンスを作成してソートする
        const sortedData = [...graphData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return sortedData;
      });
    }, [setGraphData]);



    const [result, setResult] = useState<number[]>([]);
    console.log(graphData)
  
  useEffect(() => {
    const tempResult: number[] = [];

    //10月のデータだけ抽出
    graphData.map((item) => {
        const date = new Date(item.date); // item.dataをDateオブジェクトに変換
        const month = date.getMonth(); // 月を取得

        if (month === 9) { // 10月のデータだけをチェック(9->10月)
            tempResult.push(item.emotionalValue);
        }
        // console.log("tempresulta",tempResult)
    });
    console.log("tempresulta",tempResult)

    setResult(tempResult);
}, [graphData]);

  
  
  // dataオブジェクトをここで定義
  const labels = Array.from({ length: result.length }, (_, i) => (i + 1).toString());
  const data: ChartData<'line'> = {
      labels,
      datasets: [
        {
          data: result,
          borderColor: '#91CAD3',
                  
        },
            ],
      };
    
      return <LineChart data={data} />;
}

const options: ChartOptions<'line'> = {
  responsive: true,
  scales: {
    // x: {
    //   display: false // x軸のラベルを表示しない
    // },
    y: {
      min: 1,       // y軸の最小値を1に設定
      max: 5,       // y軸の最大値を5に設定
      ticks: {
        stepSize: 1  // 1刻みでラベルを表示
      }
    }
  }
};

function LineChart({ data }: { data: ChartData<'line'> }): JSX.Element {
  return (
    <div style={{ marginTop: '20px' }}>
      <Line options={options} data={data}  width={500} height={420}/>
      </div>
    
  )
}