import { useEffect, useState } from "react";

export function useMinuteClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const updateNow = () => setNow(new Date());

    // Sync with start of next minute
    const msUntilNextMinute =
      60_000 - (new Date().getSeconds() * 1000 + new Date().getMilliseconds());

    const timeout = setTimeout(() => {
      updateNow();
      const interval = setInterval(updateNow, 60_000);
      // cleanup
      return () => clearInterval(interval);
    }, msUntilNextMinute);

    updateNow();

    return () => clearTimeout(timeout);
  }, []);

  return now;
}
