import { RESTDataSource } from "apollo-datasource-rest";
import { BaseContext } from "../context/context";

class MockRESTDataSource extends RESTDataSource {
  mockData?: any;
  context: BaseContext = {
    accessToken: "accessTokenTest",
  };

  constructor(mockData?: any) {
    super();
    this.mockData = mockData;
  }

  async get(): Promise<any> {
    return this.mockData;
  }
}

export { MockRESTDataSource as RESTDataSource };
