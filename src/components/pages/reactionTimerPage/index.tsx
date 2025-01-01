import { useState } from "react";

type GameState = "ready" | "waiting" | "complete" | "result" | "falseClick";

const ReactionTimePage = () => {
  const [gameState, setGameState] = useState<GameState>("ready");
  const [startTime, setStartTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

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
    setTotalTime(timeTaken);
    setGameState("result"); // Set the state to "result" after calculating the time
  };

  return (
    <div
      className={`${backGroundColor()} h-svh cursor-pointer`}
      onClick={handleClick}
    >
      {gameState === "ready" && (
        <div className="flex items-center justify-center h-full font-bold text-white text-2xl">
          Click to Start: Measure Your Reflexes
        </div>
      )}
      {gameState === "waiting" && (
        <div className="flex items-center justify-center h-full font-bold text-white text-2xl">
          Wait for green
        </div>
      )}
      {(gameState === "complete" || gameState === "result") && (
        <div className="flex flex-col items-center justify-center h-full font-bold text-white text-2xl">
          {gameState !== "result" ? (
            <span>Click Now!</span>
          ) : (
            <>
              <span> Your reaction time is: {totalTime}ms </span>
              <button onClick={() => handleClick()}>Reset</button>
            </>
          )}
        </div>
      )}
      {gameState === "falseClick" && (
        <div className="flex items-center justify-center h-full font-bold text-white text-2xl">
          Too soon!
        </div>
      )}
    </div>
  );
};

export default ReactionTimePage;
