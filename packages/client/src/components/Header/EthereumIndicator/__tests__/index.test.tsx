import React from "react";
import { render } from "test-utils";
import { ethers } from "ethers";

import EthereumIndicator from "../index";
import EthersProvider from "contexts/ethers/EthersProvider";
import useEthers, { UseEthers } from "contexts/ethers/useEthers";

jest.mock("contexts/ethers/useEthers");
jest.mock("contexts/ethers/EthersProvider");

describe("<EthereumIndicator />", () => {
  const baseMock: UseEthers = {
    isMetaMaskDetected: true,
    isEnabled: true,
    isNetworkAllowed: true,
    enableMetaMask: jest.fn(() => Promise.resolve()),
    provider: {} as ethers.providers.Web3Provider,
    selectedAddress: null,
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
