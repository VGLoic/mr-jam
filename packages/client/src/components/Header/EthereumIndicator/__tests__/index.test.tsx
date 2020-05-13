import React from "react";
import { render } from "test-utils";
import { ethers } from "ethers";

import EthereumIndicator from "../index";
import { UseEthers, useEthers, EthersProvider } from "contexts/ethers";

jest.mock("contexts/ethers");

describe("<EthereumIndicator />", () => {
  const baseMock: UseEthers = {
    isMetaMaskDetected: true,
    isEnabled: true,
    isNetworkAllowed: true,
    enableMetaMask: jest.fn(() => Promise.resolve()),
    provider: {} as ethers.providers.Web3Provider,
  };
  beforeAll(() => {
    (EthersProvider as jest.Mock<
      JSX.Element
    >).mockImplementation(({ children }) => <div>{children}</div>);
  });
  test("when MetaMask is not detected", () => {
    (useEthers as jest.Mock<UseEthers>).mockReturnValue({
      ...baseMock,
      isMetaMaskDetected: false,
    });
    const { asFragment } = render(<EthereumIndicator />);
    expect(asFragment()).toMatchSnapshot("MetaMask not detected");
  });
  test("when MetaMask is not enabled", () => {
    (useEthers as jest.Mock<UseEthers>).mockReturnValue({
      ...baseMock,
      isEnabled: false,
    });
    const { asFragment } = render(<EthereumIndicator />);
    expect(asFragment()).toMatchSnapshot("MetaMask not enabled");
  });

  test("when network is not allowed", () => {
    (useEthers as jest.Mock<UseEthers>).mockReturnValue({
      ...baseMock,
      isNetworkAllowed: false,
    });
    const { asFragment } = render(<EthereumIndicator />);
    expect(asFragment()).toMatchSnapshot("Network not allowed");
  });
});
