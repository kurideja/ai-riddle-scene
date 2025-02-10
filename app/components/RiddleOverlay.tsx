"use client"

interface RiddleOverlayProps {
  riddle: {
    question: string;
    choices: string[];
    correctIndex: number;
  } | null;
  score: number;
  isLoading: boolean;
  onAnswer: (answer: string) => void;
  onNewRiddle: () => void;
}

export function RiddleOverlay({
  riddle,
  score,
  isLoading,
  onAnswer,
  onNewRiddle,
}: RiddleOverlayProps) {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-lg">
        Score: {score}
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-md w-full px-4">
        <div className="bg-black/50 text-white p-6 rounded-lg pointer-events-auto">
          {isLoading ? (
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
          ) : (
            <button
              onClick={onNewRiddle}
              className="w-full bg-white/10 hover:bg-white/20 px-4 py-2 rounded"
            >
              Start Game
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 
