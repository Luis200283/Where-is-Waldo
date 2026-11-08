import { Header } from "./components/Header";
import { Game } from "./components/Game";
import { useState } from "react";
import { ActiveContext } from "./components/activeContext";
import { Score } from "./components/Score";

function App({ level }: { level: number }) {
  const [active, setActive] = useState<boolean>(false);
  const [gameTime, setGameTime] = useState<string | null>(null);


  function toggleActive(toggle: boolean) {
    setActive(toggle);
  }

  function showGameTime(time: string) {
    setGameTime(time);
  }

  return (
    <div className="w-full h-screen flex flex-col">
      {gameTime && <Score gameTime={gameTime} />}
      <ActiveContext value={{ active, toggleActive, showGameTime }}>
        <Header show={true} />
        <Game level={level} />
      </ActiveContext>
    </div>
  );
}

export default App;
