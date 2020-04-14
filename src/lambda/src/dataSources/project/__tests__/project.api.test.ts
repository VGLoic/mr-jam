import { ProjectAPI } from "../project.api";
import {
  gitlabProjectTest,
  projectTest,
  gitlabUserTest,
  userTest,
  gitlabMrTest,
  mrTest,
  gitlabApprovalStateTest,
  gitlabNoteTest,
  noteTest,
} from "../../../__mocks__/mockData";
import { MrStates } from "../../../common/mr-constants";

describe("ProjectAPI", () => {
  test("getUserProjects", async () => {
    const searchTest = "searchTest";
    const afterTest = 10;
    const projectApi = new ProjectAPI([gitlabProjectTest]);
    const res = await projectApi.getUserProjects(searchTest, afterTest);
    expect(res).toEqual([projectTest]);
  });

  test("getProjectById", async () => {
    const projectApi = new ProjectAPI(gitlabProjectTest);
    const res = await projectApi.getProjectById(
      gitlabProjectTest.id.toString()
    );
    expect(res).toEqual(projectTest);
  });

  test("getProjectUsers", async () => {
    const projectApi = new ProjectAPI([gitlabUserTest]);
    const res = await projectApi.getProjectUsers(
      gitlabProjectTest.id.toString()
    );
    expect(res).toEqual([userTest]);
  });

  test("getProjectMergeRequests", async () => {
    const projectApi = new ProjectAPI([gitlabMrTest]);
    const res = await projectApi.getProjectMergeRequests(
      projectTest.id.toString(),
      MrStates.All,
      "2017-01-01"
    );
    expect(res).toEqual([mrTest]);
  });

  test("getMergeRequestApprovers", async () => {
    const projectApi = new ProjectAPI(gitlabApprovalStateTest);
    const res = await projectApi.getMergeRequestApprovers(
      projectTest.id.toString(),
      mrTest.iid.toString()
    );
    expect(res).toEqual([userTest]);
  });

  test("getMergeRequestNotes", async () => {
    const projectApi = new ProjectAPI([
      gitlabNoteTest,
      { ...gitlabNoteTest, type: null },
    ]);
    const res = await projectApi.getMergeRequestNotes(
      projectTest.id.toString(),
      mrTest.iid.toString()
    );
    expect(res).toEqual([noteTest]);
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
      const projectApi = new ProjectAPI();
      projectApi.willSendRequest(request);
      expect(headers.get("Authorization")).toEqual("Bearer accessTokenTest");
      expect(params.get("per_page")).toEqual("11");
    });

    test("when per_page is given", () => {
      params.set("per_page", "1000");
      const projectApi = new ProjectAPI();
      projectApi.willSendRequest(request);
      expect(headers.get("Authorization")).toEqual("Bearer accessTokenTest");
      expect(params.get("per_page")).toEqual("1000");
    });
  });
});
