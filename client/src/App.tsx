import { Header } from "./components/Header";
import { Game } from "./components/Game";

function App() {
  return (
    <div className="w-full h-screen flex flex-col">
      <Header />
      <Game />
    </div>
  );
}

export default App;
