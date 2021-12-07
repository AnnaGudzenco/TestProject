import './App.css';
import React from "react";
import { useEffect, useState } from "react";
import { interval, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

function App() {
  const [sec, setSec] = useState(0);
  const [status, setStatus] = useState("stop");

  useEffect(() => {
    const unsubscribe = new Subject();
    interval(1000)
      .pipe(takeUntil(unsubscribe))
      .subscribe(() => {
        if (status === "run") {
          setSec(sec => sec + 1000);
        }
      });
    return () => {
      unsubscribe.next();
      unsubscribe.complete();
    };
  }, [status]);
 
  let hours = Math.trunc((sec / (1000 * 60 * 60)) % 24)
  let minutes =  Math.trunc((sec / 60000) % 60)
  let seconds =  Math.trunc((sec / 1000) % 60)
  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

    function startHandler(){
      setStatus("run")  
    }
    function stopHandler(){
      setStatus("stop")
      setSec(0);
    }
     
    let clicks = [];
    let timeout;

    function doubleClick() {
      status==='stop' ? setStatus("run") : setStatus("stop")
    }

    function waitHandler(event) {
        event.preventDefault();
        clicks.push(new Date().getTime());
        window.clearTimeout(timeout);
        timeout = window.setTimeout(() => {
            if (clicks.length > 1 && clicks[clicks.length - 1] - clicks[clicks.length - 2] < 300) {
                doubleClick();
            }
        }, 300);      
    }
    function resetHandler(){
      setSec(0);
      setStatus("run");
    }

  return(
    <div className='timer'>
      <p className='timer__inner'>
        <span className='timer__item'>{hours}</span>:
        <span className='timer__item'>{minutes}</span>:
        <span className='timer__item'>{seconds}</span>
      </p>
      <button className='timer__btn timer__btn--start' onClick={startHandler}>start</button>
      <button className='timer__btn timer__btn--stop' onClick={stopHandler}>stop</button>
      <button className='timer__btn timer__btn--weit' onClick={waitHandler}>wait</button>
      <button className='timer__btn timer__btn--reset' onClick={resetHandler}>reset</button>
    </div>
  )
}

export default App;
