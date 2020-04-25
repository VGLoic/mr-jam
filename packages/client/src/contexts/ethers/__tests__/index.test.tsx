import { renderHook, act } from "@testing-library/react-hooks";

import { EthersProvider, IEthereum, useEthers, METAMASK_ENABLED_KEY, METAMASK_ENABLED_VALUE } from "..";

jest.mock("ethers")

describe("<EthersProvider />", () => {
    describe("when ethereum in not in the window object", () => {
        let originalEthereum: IEthereum;
        beforeAll(() => {
            originalEthereum = (window as any).ethereum;
            (window as any).ethereum = undefined;
        });
    
        afterAll(() => {
            (window as any).ethereum = originalEthereum;
        });

        test("it should return the correct result", () => {
            const { result } = renderHook(() => useEthers(), { wrapper: EthersProvider });
            expect(result.current.isMetaMaskDetected).toEqual(false);
            expect(result.current.isEnabled).toEqual(false);
            expect(result.current.isNetworkAllowed).toEqual(false);
            expect(result.current.provider).toEqual(null);
        });
    });

    describe("when ethereum is in the window object", () => {

        const subscriptions: Record<string, any> = {};

        const register = (key:string, callback: any) => {
            subscriptions[key] = callback;
        };

        const trigger = (key: string) => {
            subscriptions[key]();
        }

        const mockEthereum: IEthereum = {
            isMetaMask: true,
            networkVersion: "5776",
            selectedAddress: null,
            enable: jest.fn(() => Promise.resolve()),
            on: (eventName: string, callback: (args: any) => any) => {
                if (eventName === "accountsChanged") {
                    register("accountsChanged", () => callback([]));
                } else if (eventName === "networkChanged") {
                    register("networkChanged", () => callback(5777));
                }
            },
            removeListener: (eventName: string, callback: (args: any) => any) => {
                if (eventName === "accountsChanged") {
                    register("accountsChanged", () => callback([]));
                } else if (eventName === "networkChanged") {
                    register("networkChanged", () => callback(5777));
                }
            },
        }

        let originalEthereum: IEthereum;
        beforeEach(() => {
            originalEthereum = (window as any).ethereum;
            (window as any).ethereum = mockEthereum;
        });
    
        afterEach(() => {
            (window as any).ethereum = originalEthereum;
        });

        test("it should initialize correctly", () => {
            const { result } = renderHook(() => useEthers(), { wrapper: EthersProvider });
            expect(result.current.isMetaMaskDetected).toEqual(true);
            expect(result.current.isEnabled).toEqual(false);
            expect(result.current.isNetworkAllowed).toEqual(false);
        });

        describe("events", () => {
            test("accountsChanged", () => {
                // Insert in local storage
                localStorage.setItem(METAMASK_ENABLED_KEY, METAMASK_ENABLED_VALUE);
                const { result } = renderHook(() => useEthers(), { wrapper: EthersProvider });
                act(() => {
                    trigger("accountsChanged");
                });
                expect(result.current.isEnabled).toEqual(false);
                // Clear local storage for safety
                localStorage.removeItem(METAMASK_ENABLED_KEY);
            });

            test("networkChanged", () => {
                // Insert in local storage
                const { result } = renderHook(() => useEthers(), { wrapper: EthersProvider });
                act(() => {
                    trigger("networkChanged");
                });
                expect(result.current.isNetworkAllowed).toEqual(true);
            });
        })

        describe("enableMetaMask", () => {
            test("when enable resolves", async () => {
                const { result } = renderHook(() => useEthers(), { wrapper: EthersProvider });
                await act(async () => {
                    await result.current.enableMetaMask();
                });
                expect(result.current.isEnabled).toEqual(true);
                expect(localStorage.getItem(METAMASK_ENABLED_KEY)).toEqual(METAMASK_ENABLED_VALUE);
                // Clear local storage
                localStorage.removeItem(METAMASK_ENABLED_KEY);
            })

            // Careful, this test removes a key in local storage, the two unit tests are linked
            test("when enable rejects", async () => {
                (window as any).ethereum = {
                    ...mockEthereum,
                    enable: jest.fn(() => Promise.reject()),
                };
                // Insert in local storage
                localStorage.setItem(METAMASK_ENABLED_KEY, METAMASK_ENABLED_VALUE);
                const { result } = renderHook(() => useEthers(), { wrapper: EthersProvider });
                await act(async () => {
                    await result.current.enableMetaMask();
                });
                expect(result.current.isEnabled).toEqual(true);
                expect(localStorage.getItem(METAMASK_ENABLED_KEY)).toEqual(null);
                // Clear local storage for safety
                localStorage.removeItem(METAMASK_ENABLED_KEY);
            })
        })
    })
});