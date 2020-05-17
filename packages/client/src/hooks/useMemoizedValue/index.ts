import { useState, useEffect } from "react";
import isEqual from "lodash/isEqual";

const useMemoizedValue = <T>(value: T): T => {
  const [memoizedValue, setMemoizeValue] = useState<T>(value);
  useEffect(() => {
    if (!isEqual(memoizedValue, value)) setMemoizeValue(value);
  }, [value, memoizedValue]);
  return memoizedValue;
};

export default useMemoizedValue;
