// Stub for socket hook
import { useEffect, useState } from 'react';

export function useSocket() {
  const [connected, setConnected] = useState(false);
  
  useEffect(() => {
    // connect logic here
  }, []);

  return { connected };
}
