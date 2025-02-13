import { useState, useCallback } from "react";
import { useRiddleQuery } from "./useRiddleQuery";

export function useRiddleLogic(totalLevels: number) {
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [shouldFlash, setShouldFlash] = useState(false);

  // Current riddle
  const { data: currentRiddle, isLoading: isCurrentLoading } = useRiddleQuery(
    attempts,
    totalLevels
  );

  // Pre-fetch next riddle
  useRiddleQuery(attempts + 1, totalLevels);

  const checkAnswer = useCallback(
    (answer: string) => {
      if (!currentRiddle) return;

      const isCorrect =
        answer.toLowerCase() ===
        currentRiddle.choices[currentRiddle.correctIndex].toLowerCase();

      setAttempts((prev) => prev + 1);

      if (isCorrect) {
        setScore((prev) => prev + 1);
      } else {
        setShouldFlash(true);
        setTimeout(() => {
          setShouldFlash(false);
        }, 1000);
      }
    },
    [currentRiddle]
  );

  return {
    riddle: currentRiddle,
    score,
    isLoading: isCurrentLoading,
    checkAnswer,
    shouldFlash,
  };
}
