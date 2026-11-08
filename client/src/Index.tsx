import { Header } from "./components/Header";
import { Link } from "react-router";

function Index() {
  return (
    <div className="w-full h-screen flex flex-col">
      <Header show={false} />
      <div className="flex-1 p-4 gap-8 bg-gray-900 flex flex-col items-center">
        <h1 className=" mt-4 text-4xl font-bold text-white italic font-serif text-shadow-lg text-shadow-amber-300/30">
          Select Level
        </h1>
        <div className=" w-full flex gap-3 justify-around items-center">
          <div className="group h-140 bg-amber-50 overflow-hidden border-6 border-white">
            <Link to={"/L1"}>
              <img
                className="w-226.5 h-150.75 max-w-none grayscale hover:grayscale-0 transition-all duration-300"
                src="/Levels/L1/L1.jpg"
                alt="Level 1"
              />
            </Link>
          </div>
          <div className="h-140 bg-amber-50 overflow-hidden border-6 border-white">
            <Link to={"/L2"}>
              <img
                className="w-226.5 h-150.75 max-w-none grayscale hover:grayscale-0 transition-all duration-300"
                src="/Levels/L2/L2.jpg"
                alt="Level 1"
              />
            </Link>
          </div>
          <div className="group relative h-140 bg-amber-50 overflow-hidden border-6 border-white">
            <Link to={"L3"}>
              <img
                className="w-226.5 h-150.75 max-w-none grayscale hover:grayscale-0 transition-all duration-300"
                src="/Levels/L3/L3.jpg"
                alt="Level 1"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
