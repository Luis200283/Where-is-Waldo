import { useState } from "react";
import L1 from "../assets/Levels/L1.jpg";

export function Game() {
  const [zoom, setZoom] = useState(1.0);

  return (
    <div className="bg-gray-900 p-5 h-screen flex flex-col items-center justify-between">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-white text-2xl">Zoom</h1>
        <div className="flex justify-center items-center gap-5">
          <button className="text-white bg-gray-600 rounded-lg items-center w-8 h-8 text-3xl">
            +
          </button>
          <button className="text-white bg-gray-600 rounded-lg items-center w-8 h-8 text-3xl">
            -
          </button>
        </div>
      </div>
      <div
        style={{
          width: `${zoom * 100}%`,
          height: `${zoom * 100}%`,
        }}
        className="block h-125 w-full overflow-scroll scrollbar-none bg-amber-50 p-1"
      >
        <img
          style={{
            width: `${zoom * 100}%`,
            height: `${zoom * 100}%`,
          }}
          className={`zoom-[${zoom}] object-contain max-w-full max-h-full select-none pointer-events-none`}
          src={L1}
          alt=""
        />
      </div>
    </div>
  );
}
