import { useState, useEffect, useContext, useRef } from "react";
import { ActiveContext } from "./activeContext";

export function Game({ level }: { level: number }) {
  const [found, setFound] = useState<string[]>([]);
  const chars = ["char1", "char2", "char3", "char4"];
  const { toggleActive } = useContext(ActiveContext);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    toggleActive(true);
    if (imgRef.current) imgRef.current.focus();
  }, []);

  async function userClick(e: React.MouseEvent<HTMLElement>) {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    console.log({ x, y });
    try {
      const res = await fetch(`/game/?lev=${level}&x=${x}&y=${y}`);
      const data = await res.json();
      checkWin(data.result);
    } catch (error) {
      console.log(error);
    }
  }

  function checkWin(status: string) {
    if (status !== "failed" && !found.includes(status)) {
      const result = [...found, status];
      if (result.length === 4) {
        toggleActive(false);
      }
      setFound(result);
    }
  }

  return (
    <div className="bg-gray-900 p-5 flex flex-col flex-1 gap-3 h-min-0 items-center justify-center">
      <div className="w-full flex justify-center items-center gap-10">
        {chars.map((char, index) => (
          <div
            key={index}
            className="relative w-20 h-20 border-white border-4 rounded-full overflow-hidden flex items-center justify-center"
          >
            <img
              src={`/Levels/L${level}/${char}.png`}
              key={index}
              draggable="false"
              className="w-20 h-20"
            />

            {found.includes(char) && (
              <div className="pointer-events-none absolute inset-0 bg-green-500/40" />
            )}
          </div>
        ))}
      </div>
      <div
        ref={imgRef}
        className="h-[75vh] w-full overflow-auto draggable={false} select-none scrollbar-none rounded-xl"
      >
        <img
          onClick={(e) => {
            userClick(e);
          }}
          className="w-[2560px] h-[1608px] max-w-none"
          src={`/Levels/L${level}/L${level}.jpg`}
          draggable="false"
          alt="Level image"
        />
      </div>
    </div>
  );
}
