"use client";

import { GameScene } from "./GameScene";
import { RiddleOverlay } from "./RiddleOverlay";
import { useRiddleLogic } from "../hooks/useRiddleLogic";

export function RiddleGame() {
  const totalLevels = 10;
  const {
    riddle,
    score,
    isLoading,
    checkAnswer,
    shouldFlash,
  } = useRiddleLogic(totalLevels);

  const isComplete = score >= totalLevels;

  return (
    <div className="fixed inset-0">
      <div className="absolute inset-0">
        <GameScene
          progress={score}
          totalLevels={totalLevels}
          isComplete={isComplete}
          shouldFlash={shouldFlash}
        />
      </div>

      <RiddleOverlay
        riddle={riddle}
        score={score}
        isLoading={isLoading}
        onAnswer={checkAnswer}
        isComplete={isComplete}
        totalLevels={totalLevels}
      />
    </div>
  );
}
