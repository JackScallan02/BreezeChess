import { useEffect, useState } from "react";

export const useHeldKeys = () => {
  const [heldKeys, setHeldKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setHeldKeys((prev) => {
        const updated = new Set(prev);
        updated.add(e.key.toLowerCase());
        return updated;
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setHeldKeys((prev) => {
        const updated = new Set(prev);
        updated.delete(e.key.toLowerCase());
        return updated;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return heldKeys;
};
