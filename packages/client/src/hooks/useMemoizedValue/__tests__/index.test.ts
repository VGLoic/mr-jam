import { renderHook } from "@testing-library/react-hooks";
import useMemoizedValue from "../";

describe("useMemoizedValue", () => {
  test("it should not return a new value if value has not changed", () => {
    let oldValueRef = [10];
    let value = oldValueRef;
    const { result, rerender } = renderHook(() => useMemoizedValue(value));

    value = [10];
    rerender();

    expect(result.current).toEqual(oldValueRef);
  });

  test("it should return a new value if value has changed", () => {
    let value = [10];
    const { result, rerender } = renderHook(() => useMemoizedValue(value));

    value.push(5);
    rerender();

    expect(result.current).toEqual([10, 5]);
  });
});
