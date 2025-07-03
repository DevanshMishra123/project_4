import { useState, useEffect, useRef } from "react";
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
  const gameBoardRef = useRef(null);
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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(event.key)) {
        event.preventDefault(); 
      }
      if (event.key === 'ArrowUp' || event.key === 'w')
        handleu();
      else if (event.key === 'ArrowDown' || event.key === 's')
        handled();
      else if (event.key === 'ArrowLeft' || event.key === 'a') 
        handlel();
      else if (event.key === 'ArrowRight' || event.key === 'd') 
        handler();
      else if (event.key === 'Enter') {
        if (!start) {
          let arr = snk;
          for (let index = 0; index < arr.length; index++)
            arr[index].direction = "right";
          setSnk([...arr]);
          setStart(true);
        }
      } else if (event.key === 'r' || event.key === 'R') 
          window.location.reload();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [snk, start, direction]); 

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
    let gameWidth = 900;  
    let gameHeight = 600; 
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
        if(obj||(arr[0].direction=="left"&&arr[0].left<0)||(arr[0].direction=="up"&&arr[0].top<0)||(arr[0].direction=="down"&&arr[0].top >= gameHeight)||(arr[0].direction=="right"&&arr[0].left >= gameWidth)){
          setResult(true)
        }
      }

      if(!result)
        setSnk([...arr]);
    }
    
  }, [time]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6 text-green-600">Snake Game</h1>

      <div ref={gameBoardRef} className="border-4 border-black w-[900px] h-[600px] relative bg-[linear-gradient(to_right,#e5e5e5_49px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_49px,transparent_1px)] bg-[size:50px_50px] rounded-lg overflow-hidden">
        {snk.map((item, index) => (
          <div
            key={index}
            className={`absolute w-[50px] h-[50px] ${index === 0 ? 'bg-green-700' : 'bg-green-400'} border border-black rounded-md`}
            style={{ top: `${item.top}px`, left: `${item.left}px` }}
          ></div>
        ))}
        <div
          className="border border-black absolute w-[50px] h-[50px] bg-cyan-400 rounded-md"
          style={{ top: `${box.top}px`, left: `${box.left}px` }}
        ></div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={handleu}>
          Move Up
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={handled}>
          Move Down
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={handlel}>
          Move Left
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={handler}>
          Move Right
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          onClick={() => {
            if (start) return;
            let arr = snk;
            for (let index = 0; index < arr.length; index++) arr[index].direction = "right";
            setSnk([...arr]);
            setStart(true);
          }}
        >
          Start Game
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          onClick={() => window.location.reload()}
        >
          Restart
        </button>
      </div>

      <div className="text-xl mt-4">Your Points: <span className="font-bold">{count}</span></div>
      {result && <div className="text-3xl font-bold text-red-600 mt-4">Game Over</div>}
    </div>
  );
}
  
export default App;

/*
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
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={handleu}>
          Move Up
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={handled}>
          Move Down
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={handlel}>
          Move Left
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={handler}>
          Move Right
        </button>
        <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded" onClick={()=>{
          if(start)
            return
          let arr = snk;
          for (let index = 0; index < arr.length; index++)
            arr[index].direction = "right"
          setSnk([...arr])
          setStart(true)
        }}>Start Game</button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          onClick={() => window.location.reload()}
        >
          Restart
        </button>
        <div className="text-xl mt-4">Your Points: <span className="font-bold">{count}</span></div>
        {result && <div className="text-3xl font-bold text-red-600 mt-4">Game Over</div>}
      </div>
    </div>
  );
}
*/
