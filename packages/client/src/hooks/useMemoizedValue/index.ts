import { useRef, useEffect } from "react";
import isEqual from "lodash/isEqual";

const useMemoizedValue = <T>(value: T): T => {
  const ref = useRef<T>(value);
  useEffect(() => {
    if (!isEqual(ref.current, value)) ref.current = value;
  }, [value]);
  return ref.current;
};

export default useMemoizedValue;
