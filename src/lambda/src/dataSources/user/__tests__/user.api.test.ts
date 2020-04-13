import { UserAPI } from "../user.api";
import { gitlabUserTest, userTest } from "../../../__mocks__/mockData";
import { RequestOptions } from "apollo-datasource-rest";

describe("UserAPI", () => {
  test("getCurrentUser", async () => {
    const userApi = new UserAPI(gitlabUserTest);
    const res = await userApi.getCurrentUser();
    expect(res).toEqual(userTest);
  });

  describe("willSendRequest", () => {
    let headers: any;
    let params: any;
    let request: any;

    beforeEach(() => {
      headers = new Map<string, string>();
      params = new Map<string, string>();
      request = {
        path: "pathTest",
        params: params,
        headers: headers,
      };
    });

    test("when per_page is not given", () => {
      const userApi = new UserAPI();
      userApi.willSendRequest(request);
      expect(headers.get("Authorization")).toEqual("Bearer accessTokenTest");
      expect(params.get("per_page")).toEqual("11");
    });

    test("when per_page is given", () => {
      params.set("per_page", "1000");
      const userApi = new UserAPI();
      userApi.willSendRequest(request);
      expect(headers.get("Authorization")).toEqual("Bearer accessTokenTest");
      expect(params.get("per_page")).toEqual("1000");
    });
  });
});
