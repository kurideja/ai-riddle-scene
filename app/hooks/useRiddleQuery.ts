import { useQuery } from '@tanstack/react-query';

interface Riddle {
  question: string;
  choices: string[];
  correctIndex: number;
}

export function useRiddleQuery(attempt: number, totalLevels: number) {
  return useQuery<Riddle>({
    queryKey: ['riddle', attempt, totalLevels],
    queryFn: async () => {
      const response = await fetch(
        `/api/riddle?attempt=${attempt}&totalLevels=${totalLevels}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch riddle');
      }
      return response.json();
    },
    staleTime: Infinity, // Since riddles don't change
    retry: 2,
  });
} 
