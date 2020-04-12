import React from "react";
import { render } from '@testing-library/react'
import MockedProvider from "./MockedProvider";

const customRender = (ui: React.ReactElement, options?: any) =>
  render(ui, { wrapper: MockedProvider, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }