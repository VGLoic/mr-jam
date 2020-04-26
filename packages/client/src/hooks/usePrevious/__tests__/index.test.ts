import { renderHook } from "@testing-library/react-hooks";
import { usePrevious } from "../";

describe("usePrevious", () => {
    test("it should update the value if value has changed", () => {
        let value = 10;
        const { result, rerender } = renderHook(() => usePrevious(value));
        
        value = 11;
        rerender();

        expect(result.current).toEqual(10)
    })
})