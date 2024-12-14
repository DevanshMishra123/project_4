import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [time, setTime] = useState(0);
  const [direction, setDirection] = useState([]);
  const [snk, setSnk] = useState([]);
  const [start,setStart] = useState(false)
  const [box,setBox] = useState({top: 100, left: 600 })
  const [count,setCount] = useState(0)
  const [result,setResult] = useState(false)
  console.log(result)

  function randomGenerator(min, max) {
    const top = Math.floor(Math.random() * ((max / 50) - (min / 50) + 1)) + (min / 50);
    const left = Math.floor(Math.random() * ((max / 50) - (min / 50) + 1)) + (min / 50);
    setBox({top: top*50, left: left*50})
  }

  const update = ()=>{
    setCount(count+1)
    randomGenerator(0,600)
    let arr = snk   
    let newObj = {}
    let lastObj = arr.at(-1)
    newObj.direction = lastObj.direction
    newObj.rotation_index = lastObj.rotation_index
    if(lastObj.direction==="up"){
      newObj.top = lastObj.top + 50
      newObj.left = lastObj.left 
    }
    if(lastObj.direction==="down"){
      newObj.top = lastObj.top - 50
      newObj.left = lastObj.left 
    }
    if(lastObj.direction==="left"){
      newObj.top = lastObj.top
      newObj.left = lastObj.left + 50   
    }
    if(lastObj.direction==="right"){
      newObj.top = lastObj.top 
      newObj.left = lastObj.left - 50 
    }
    arr.push(newObj)
    setSnk([...arr]);
  }

  const handleu = () => {
    if (snk[0].direction!="down"&&start) {
      console.log("up button clicked");
      let arr = direction
      arr.push({top: snk[0].top, left: snk[0].left, newDirection: "up"})
      setDirection([...arr])
      setTime(0);
    }
  };
  const handled = () => {
    if (snk[0].direction!="up"&&start) {
      console.log("down button clicked");
      let arr = direction
      arr.push({top: snk[0].top, left: snk[0].left, newDirection: "down"})
      setDirection([...arr])
      setTime(0);    
    }
  };
  const handlel = () => {
    if (snk[0].direction!="right"&&start) {
      console.log("left button clicked");
      let arr = direction
      arr.push({top: snk[0].top, left: snk[0].left, newDirection: "left"})
      setDirection([...arr])
      setTime(0);
    }
  };
  const handler = () => {
    if (snk[0].direction!="left"&&start) {
      console.log("right button clicked");
      let arr = direction
      arr.push({top: snk[0].top, left: snk[0].left, newDirection: "right"})
      setDirection([...arr])
      setTime(0);
    }
  };

  console.log(direction)

  useEffect(() => {
    let interval;
    if(!result){
      let arr = [];
      for (let index = 0; index < 5; index++)
        arr.push({ top: 0, left: 200 - 50 * index, rotation_index: 0, direction: ""});
      setSnk([...arr]);
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 500);
    }
    else
      clearInterval(interval)
    return () => clearInterval(interval);
  }, [result]);

  useEffect(()=>{
    if(snk[0] && snk[0].top==box.top&&snk[0].left==box.left)
      update()
  },[snk])

  useEffect(() => {
    console.log(`Time: ${time}`);
    let arr = snk
    for (let index = 0; index < arr.length; index++){
      let k = arr[index].rotation_index
      console.log("direction index is",direction[k])
      if(direction.length>k&&arr[index].top===direction[k].top&&arr[index].left===direction[k].left){
        arr[index].direction = direction[k].newDirection
        arr[index].rotation_index+=1
      }
    
      if (arr[index].direction==='up')
        arr[index].top = arr[index].top - 50

      if (arr[index].direction==='down')
        arr[index].top = arr[index].top + 50

      if (arr[index].direction==='left')
        arr[index].left = arr[index].left - 50

      if (arr[index].direction==='right')
        arr[index].left = arr[index].left + 50
      
      if(index==0){
        let obj = arr.some(obj=>obj!=arr[0]&&obj.top==snk[0].top&&obj.left==arr[0].left)
        if(obj||(arr[0].direction=="left"&&arr[0].left<0)||(arr[0].direction=="up"&&arr[0].top<0)||(arr[0].direction=="down"&&arr[0].top>600)||(arr[0].direction=="right"&&arr[0].left>900))
          setResult(true)
      }

      if(!result)
        setSnk([...arr]);
    }
    
  }, [time]);

  return (
    <div className="flex gap-4">
      <div className="border border-black w-[80vw] h-[100vh] relative">
        {snk.map((item, index) => (
          <div
            key={index}
            className="border border-black absolute w-[50px] h-[50px] bg-green-400 inline-block"
            style={{ top: `${item.top}px`, left: `${item.left}px` }}
          ></div>
        ))}
        <div className="border border-black absolute w-[50px] h-[50px] bg-cyan-400 inline-block" style={{ top: `${box.top}px`, left: `${box.left}px` }}></div>
      </div>
      <div>
        <button className="bg-blue-500 p-4 m-4 rounded-full" onClick={handleu}>
          move up
        </button>
        <button className="bg-blue-500 p-4 m-4 rounded-full" onClick={handled}>
          move down
        </button>
        <button className="bg-blue-500 p-4 m-4 rounded-full" onClick={handlel}>
          move left
        </button>
        <button className="bg-blue-500 p-4 m-4 rounded-full" onClick={handler}>
          move right
        </button>
        <button className="bg-blue-500 p-4 m-4 rounded-full" onClick={()=>{
          if(start)
            return
          let arr = snk;
          for (let index = 0; index < arr.length; index++)
            arr[index].direction = "right"
          setSnk([...arr])
          setStart(true)
        }}>start</button>
        <div className="p-4">Your Points: {count}</div>
        <div className="p-4">{result&&"game over"}</div>
      </div>
    </div>
  );
}

export default App;
