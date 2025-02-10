"use client";

import { GameScene } from "./GameScene";
import { RiddleOverlay } from "./RiddleOverlay";
import { useRiddleLogic } from "../hooks/useRiddleLogic";

export function RiddleGame() {
  const { riddle, score, isLoading, checkAnswer, generateNewRiddle } =
    useRiddleLogic();

  return (
    <div className="fixed inset-0">
      <div className="absolute inset-0">
        <GameScene progress={score} />
      </div>

      <RiddleOverlay
        riddle={riddle}
        score={score}
        isLoading={isLoading}
        onAnswer={checkAnswer}
        onNewRiddle={generateNewRiddle}
      />
    </div>
  );
}
