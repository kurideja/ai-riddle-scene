import { useState, useCallback } from "react";

export function useRiddleLogic() {
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
      const response = await fetch("/api/riddle");
      const data = await response.json();
      setRiddle(data);
    } catch (error) {
      console.error("Failed to fetch riddle:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkAnswer = useCallback(
    (answer: string) => {
      if (!riddle) return;

      if (
        answer.toLowerCase() ===
        riddle.choices[riddle.correctIndex].toLowerCase()
      ) {
        setScore((prev) => prev + 1);
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
