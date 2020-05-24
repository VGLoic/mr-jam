import { useRef, useEffect } from "react";

type UseMountedRef = boolean | null;

const useMountedRef = (): UseMountedRef => {
  const isMountedRef = useRef<boolean | null>(null);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  });
  return isMountedRef.current;
};

export default useMountedRef;
