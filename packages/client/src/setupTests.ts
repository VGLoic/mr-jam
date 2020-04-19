import "@testing-library/jest-dom/extend-expect";
import mediaQuery from "css-mediaquery";

function createMatchMedia(width: number) {
  return (query: string): MediaQueryList => ({
    matches: mediaQuery.match(query, { width }),
    addListener: () => {},
    removeListener: () => {},
    onchange: () => {},
    dispatchEvent: (event: Event): boolean => true,
    addEventListener: () => {},
    removeEventListener: () => {},
    media: "media",
  });
}

beforeAll(() => {
  window.matchMedia = createMatchMedia(window.innerWidth);
});
