import React from "react";
import { render } from '@testing-library/react'
import MockedProvider from "./MockedProvider";

const customRender = (ui: React.ReactElement, options?: any) => {
  const RenderedMockedProvider = (props: any) => <MockedProvider {...props} ethersContext={options?.ethersContext} />;
  return render(ui, { wrapper: RenderedMockedProvider, ...options });
}

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }