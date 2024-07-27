import { useCallback, useState } from 'react';

export function useIdArray() {
  const [ids, setIds] = useState<number[]>([]);

  const deleteOne = useCallback((id: number) => {
    setIds(prev => prev.filter(pid => pid != id));
  }, []);

  const appendRandom = useCallback(() => {
    setIds(prev => [...prev, Math.random()]);
  }, []);

  const clear = useCallback(() => {
    setIds([]);
  }, []);

  return { ids, deleteOne, appendRandom, clear, setIds };
}
