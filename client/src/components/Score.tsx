import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface PlayerScore {
  name: string;
  timeMs: string;
}

function Records() {
  const [users, setUsers] = useState<PlayerScore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch("/game/score");
        if (!res.ok) throw new Error("Error al obtener los datos");
        const data: { users: PlayerScore[] } = await res.json();
        setUsers(data.users);
      } catch (error) {
        if (error instanceof Error) setError(error.message);
        else setError("unknow error");
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p className="text-red-600">Server Error</p>;
  }
  return (
    <>
      <h2>Score</h2>
      <ol className="h-20 scroll-auto scrollbar-none">
        {users.map((user, index) => {
          return (
            <li className="text-xl m-2" key={index}>
              <p>
                {user.name} : {user.timeMs}
              </p>
            </li>
          );
        })}
      </ol>
    </>
  );
}

interface score {
  gameTime: string;
}

export function Score({ gameTime }: score) {
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  async function postUserScore() {
    setLoading(true);
    try {
      const res = await fetch("/game/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, time: gameTime }),
      });
      if (res.ok) {
        console.log("¡Datos guardados con éxito!");
      } else {
        console.warn("El servidor respondió con un error:", res.status);
      }
    } catch (error) {
      console.error("Error al enciar el puntaje:", error);
    } finally {
      console.log("Redirigiendo...");
      navigate("/", { replace: true });
    }
  }

  return (
    <div className="absolute w-full h-screen z-10 bg-black/70 flex justify-center items-center">
      <div className="text-7xl bg-amber-100/80 p-10 rounded-2xl w-200 h-120 flex flex-col gap-5 items-center justify-center overflow-auto scrollbar-none">
        <h2 className=" mt-30 md:text-8xl text-6xl text-black">Your Win</h2>
        <p className="md:text-6xl text-4xl text-white">time: {gameTime}</p>
        <input
          onChange={(e) => {
            setName(e.target.value);
          }}
          className="max-w-[80%] italic font-mono bg-amber-50 text-2xl rounded-2xl text-center py-2 border-2 border-black"
          type="text"
          placeholder="Enter your name"
        />
        <button
          onClick={postUserScore}
          disabled={loading}
          className="text-sm bg-white px-5 py-1.5 font-bold hover:bg-black hover:text-white rounded-lg"
        >
          submit
        </button>
        <Records />
      </div>
    </div>
  );
}
