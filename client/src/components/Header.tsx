import waldo from "../assets/waldo/waldo-badge.svg";
import { useEffect, useRef, useState } from "react";

function Timer() {
  const [time, setTime] = useState<number>(0);
  const [active, setActive] = useState<boolean>(false);

  const initTimeRef = useRef<number>(0);  //marca de tiempo inicial
  const IntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);  //timepo transcurrido

  useEffect(() => {
    if (active) {
      initTimeRef.current = Date.now() - time; // recalcular el tiempo inicial despues de una pausa

      IntervalRef.current = setInterval(() => {
        setTime(Date.now() - initTimeRef.current); //
      }, 16); //~60fps
    } else {
      if (IntervalRef.current) clearInterval(IntervalRef.current);
    }
    return () => {
      if (IntervalRef.current) clearInterval(IntervalRef.current);
    };
  }, [active]);

  function formatTime(totalMiliseconds: number): string {
    const minutes = Math.floor(totalMiliseconds / 60000);
    const seconds = Math.floor((totalMiliseconds % 60000) / 1000);
    const miliseconds = Math.floor((totalMiliseconds % 1000) / 10);

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(miliseconds).padStart(2, "0")}`;
  }

  return (
    <div className="text-center m-5">
      <div>{formatTime(time)}</div>
      <div className="flex justify-center items-center gap-3">
        <button
          className="bg-emerald-800 p-0.5 rounded-lg text-white"
          onClick={() => {
            setActive(!active);
          }}
        >
          {active ? "Stop" : "Play"}
        </button>
        <button
          className="bg-red-800 p-0.5 rounded-lg text-white"
          onClick={() => {
            setActive(false);
            setTime(0);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export function Header() {
  return (
    <header className="w-full h-[8%] bg-amber-200 flex justify-between items-center px-8">
      <div className="flex justify-center items-center gap-3">
        <img src={waldo} alt="Waldo icon" className="flex-1 w-15" />
        <h1 className="text-3xl font-sans tracking-tighter italic font-bold leading-7 text-center text-[#c53e32]">
          Where's <br />
          Waldo
        </h1>
      </div>
      <Timer />
    </header>
  );
}
