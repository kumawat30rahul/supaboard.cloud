import { useState } from "react";
import { useDataContext } from "../../../DataContext";

type GameState = "ready" | "waiting" | "complete" | "result" | "falseClick";

const ReactionTimePage = () => {
  const [gameState, setGameState] = useState<GameState>("ready");
  const [startTime, setStartTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const { bestReactionTime, setBestReactionTime } = useDataContext();

  const backGroundColor = () => {
    switch (gameState) {
      case "ready":
        return "bg-blue-500";
      case "waiting":
        return "bg-yellow-400";
      case "complete":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleClick = () => {
    if (gameState === "ready") {
      setGameState("waiting");
      const id = setTimeout(() => {
        setGameState("complete");
        setStartTime(Date.now());
      }, Math.floor(Math.random() * 6000)); // Random wait time (1-6 seconds)
      setTimeoutId(id);
    } else if (gameState === "waiting") {
      if (timeoutId) clearTimeout(timeoutId);
      setGameState("falseClick");
    } else if (gameState === "result") {
      setGameState("ready");
    } else if (gameState === "complete") {
      calculateTime(); // Calculate time when the user clicks on the green button
    } else if (gameState === "falseClick") {
      setGameState("ready");
    }
  };

  const calculateTime = () => {
    const endTime = Date.now();
    const timeTaken = endTime - startTime;
    if (timeTaken < bestReactionTime || bestReactionTime === 0) {
      setBestReactionTime(timeTaken);
    }
    setTotalTime(timeTaken);
    setGameState("result"); // Set the state to "result" after calculating the time
  };

  return (
    <div
      className={`${backGroundColor()} h-svh cursor-pointer text-center`}
      onClick={handleClick}
    >
      {gameState === "ready" && (
        <>
          <div className="flex flex-col items-center justify-center gap-3 h-full font-bold text-white text-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="w-10 h-10 text-white"
            >
              <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
            </svg>
            <span>Click to Start: Measure Your Reflexes</span>
          </div>
        </>
      )}
      {gameState === "waiting" && (
        <div className="flex flex-col items-center justify-center h-full font-bold text-white text-2xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="w-10 h-10 text-white"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
          <span>Wait for green</span>
        </div>
      )}
      {(gameState === "complete" || gameState === "result") && (
        <div className="flex flex-col items-center justify-center h-full font-bold text-white text-2xl">
          {gameState !== "result" ? (
            <div className="flex flex-col items-center justify-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="w-10 h-10 text-white"
              >
                <path d="M14 4.1 12 6" />
                <path d="m5.1 8-2.9-.8" />
                <path d="m6 12-1.9 2" />
                <path d="M7.2 2.2 8 5.1" />
                <path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z" />
              </svg>
              <span>Click Now!</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="w-10 h-10 text-white"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 8 10" />
              </svg>
              <span> Your reaction time is: {totalTime}ms </span>
              <span>Click again to reset</span>
            </div>
          )}
        </div>
      )}
      {gameState === "falseClick" && (
        <div className="flex items-center justify-center h-full font-bold text-white text-2xl">
          Too soon! Click again to try again
        </div>
      )}
    </div>
  );
};

export default ReactionTimePage;
