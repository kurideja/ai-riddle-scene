import { useState, useCallback } from "react";

export function useRiddleLogic(totalLevels: number) {
  const [riddle, setRiddle] = useState<{
    question: string;
    choices: string[];
    correctIndex: number;
  } | null>(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const generateNewRiddle = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/riddle?level=${score + 1}&totalLevels=${totalLevels}`);
      const data = await response.json();
      setRiddle(data);
    } catch (error) {
      console.error("Failed to fetch riddle:", error);
    } finally {
      setIsLoading(false);
    }
  }, [score, totalLevels]);

  const checkAnswer = useCallback(
    (answer: string) => {
      if (!riddle) return;

      if (
        answer.toLowerCase() ===
        riddle.choices[riddle.correctIndex].toLowerCase()
      ) {
        setScore((prev) => prev + 1);
      } else {
        // Decrease score by 2 but not below 0
        setScore((prev) => Math.max(0, prev - 2));
      }

      generateNewRiddle();
    },
    [riddle, generateNewRiddle]
  );

  return {
    riddle,
    score,
    isLoading,
    checkAnswer,
    generateNewRiddle,
  };
}
