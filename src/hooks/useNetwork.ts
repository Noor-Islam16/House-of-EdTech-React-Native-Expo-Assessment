import * as Network from "expo-network";
import { useEffect, useState } from "react";

export const useNetwork = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  const checkNetwork = async () => {
    try {
      const state = await Network.getNetworkStateAsync();
      setIsOnline(state.isConnected ?? true);
    } catch {
      setIsOnline(true);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkNetwork();
    const interval = setInterval(checkNetwork, 5000);
    return () => clearInterval(interval);
  }, []);

  return { isOnline, isChecking };
};
