"use client";

interface RiddleOverlayProps {
  riddle:
    | {
        question: string;
        choices: string[];
        correctIndex: number;
      }
    | undefined;
  score: number;
  isLoading: boolean;
  onAnswer: (answer: string) => void;
  isComplete?: boolean;
  totalLevels: number;
}

export function RiddleOverlay({
  riddle,
  score,
  isLoading,
  onAnswer,
  isComplete,
  totalLevels,
}: RiddleOverlayProps) {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-lg">
        Score: {score}/{totalLevels}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-md w-full px-4">
        <div className="bg-black/50 text-white p-6 rounded-lg pointer-events-auto">
          {isComplete ? (
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Congratulations!</h1>
              <p className="text-lg mb-6">You&apos;ve completed all levels!</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
              >
                Play Again
              </button>
            </div>
          ) : isLoading ? (
            <div className="text-center">Loading new riddle...</div>
          ) : riddle ? (
            <>
              <p className="text-lg mb-4">{riddle.question}</p>
              {riddle.choices && (
                <div className="grid grid-cols-2 gap-2">
                  {riddle.choices.map((choice) => (
                    <button
                      key={choice}
                      onClick={() => onAnswer(choice)}
                      className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded"
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
