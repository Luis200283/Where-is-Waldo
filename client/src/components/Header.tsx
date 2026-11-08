import waldo from "../assets/waldo/waldo-badge.svg";
import { Link } from "react-router";
import { useState, useRef, useEffect, useContext } from "react";
import { useInterval } from "../helpers/useInterval";
import { ActiveContext } from "./activeContext";

function Timer() {
  const [time, setTime] = useState<number>(0);
  const { active, showGameTime } = useContext(ActiveContext);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = active ? Date.now() : null;
    if (!active && time !== 0) {
      showGameTime(formatTime(time));
    }
  }, [active]);

  useInterval(
    () => {
      if (startTimeRef.current === null) {
        return;
      }
      setTime(Date.now() - startTimeRef.current);
    },
    active ? 16 : null,
  );

  function formatTime(totalMiliseconds: number): string {
    const minutes = Math.floor(totalMiliseconds / 60000);
    const seconds = Math.floor((totalMiliseconds % 60000) / 1000);
    const miliseconds = Math.floor((totalMiliseconds % 1000) / 10);

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(miliseconds).padStart(2, "0")}`;
  }

  return <div className="text-center m-5">{<div>{formatTime(time)}</div>}</div>;
}

export function Header({ show }: { show: boolean }) {
  return (
    <header className="w-full h-[8%] bg-amber-200 flex justify-between items-center px-8">
      <Link to={"/"}>
        <div className="flex justify-center items-center gap-3">
          <img src={waldo} alt="Waldo icon" className="flex-1 w-15" />
          <h1 className="text-3xl font-sans tracking-tighter italic font-bold leading-7 text-center text-[#c53e32]">
            Where's <br />
            Waldo
          </h1>
        </div>
      </Link>
      {show && <Timer />}
    </header>
  );
}
