(function (e, a) {
  for (var i in a) e[i] = a[i];
})(
  exports,
  /******/ (function (modules) {
    // webpackBootstrap
    /******/ // The module cache
    /******/ var installedModules = {}; // The require function
    /******/
    /******/ /******/ function __webpack_require__(moduleId) {
      /******/
      /******/ // Check if module is in cache
      /******/ if (installedModules[moduleId]) {
        /******/ return installedModules[moduleId].exports;
        /******/
      } // Create a new module (and put it into the cache)
      /******/ /******/ var module = (installedModules[moduleId] = {
        /******/ i: moduleId,
        /******/ l: false,
        /******/ exports: {},
        /******/
      }); // Execute the module function
      /******/
      /******/ /******/ modules[moduleId].call(
        module.exports,
        module,
        module.exports,
        __webpack_require__
      ); // Flag the module as loaded
      /******/
      /******/ /******/ module.l = true; // Return the exports of the module
      /******/
      /******/ /******/ return module.exports;
      /******/
    } // expose the modules object (__webpack_modules__)
    /******/
    /******/
    /******/ /******/ __webpack_require__.m = modules; // expose the module cache
    /******/
    /******/ /******/ __webpack_require__.c = installedModules; // define getter function for harmony exports
    /******/
    /******/ /******/ __webpack_require__.d = function (exports, name, getter) {
      /******/ if (!__webpack_require__.o(exports, name)) {
        /******/ Object.defineProperty(exports, name, {
          enumerable: true,
          get: getter,
        });
        /******/
      }
      /******/
    }; // define __esModule on exports
    /******/
    /******/ /******/ __webpack_require__.r = function (exports) {
      /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        /******/ Object.defineProperty(exports, Symbol.toStringTag, {
          value: "Module",
        });
        /******/
      }
      /******/ Object.defineProperty(exports, "__esModule", { value: true });
      /******/
    }; // create a fake namespace object // mode & 1: value is a module id, require it // mode & 2: merge all properties of value into the ns // mode & 4: return value when already ns object // mode & 8|1: behave like require
    /******/
    /******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function (
      value,
      mode
    ) {
      /******/ if (mode & 1) value = __webpack_require__(value);
      /******/ if (mode & 8) return value;
      /******/ if (
        mode & 4 &&
        typeof value === "object" &&
        value &&
        value.__esModule
      )
        return value;
      /******/ var ns = Object.create(null);
      /******/ __webpack_require__.r(ns);
      /******/ Object.defineProperty(ns, "default", {
        enumerable: true,
        value: value,
      });
      /******/ if (mode & 2 && typeof value != "string")
        for (var key in value)
          __webpack_require__.d(
            ns,
            key,
            function (key) {
              return value[key];
            }.bind(null, key)
          );
      /******/ return ns;
      /******/
    }; // getDefaultExport function for compatibility with non-harmony modules
    /******/
    /******/ /******/ __webpack_require__.n = function (module) {
      /******/ var getter =
        module && module.__esModule
          ? /******/ function getDefault() {
              return module["default"];
            }
          : /******/ function getModuleExports() {
              return module;
            };
      /******/ __webpack_require__.d(getter, "a", getter);
      /******/ return getter;
      /******/
    }; // Object.prototype.hasOwnProperty.call
    /******/
    /******/ /******/ __webpack_require__.o = function (object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    }; // __webpack_public_path__
    /******/
    /******/ /******/ __webpack_require__.p = ""; // Load entry module and return exports
    /******/
    /******/
    /******/ /******/ return __webpack_require__(
      (__webpack_require__.s = "./src/main.ts")
    );
    /******/
  })(
    /************************************************************************/
    /******/ {
      /***/ "./src/common/mr-constants.ts":
        /*!************************************!*\
  !*** ./src/common/mr-constants.ts ***!
  \************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
            value: true,
          });
          var MrStates;

          (function (MrStates) {
            MrStates["Opened"] = "opened";
            MrStates["Closed"] = "closed";
            MrStates["Merged"] = "merged";
            MrStates["Locked"] = "locked";
            MrStates["All"] = "";
          })((MrStates = exports.MrStates || (exports.MrStates = {})));

          /***/
        },

      /***/ "./src/common/response.mappers.ts":
        /*!****************************************!*\
  !*** ./src/common/response.mappers.ts ***!
  \****************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
            value: true,
          });

          const date_fns_1 = __webpack_require__(/*! date-fns */ "date-fns");

          const toProjectConnection = (first, projects) => {
            const hasNextPage = projects.length > first;
            const edges = projects.map(toProjectEdge).slice(0, first);
            const endCursor =
              edges.length > 0 ? edges[edges.length - 1].cursor : null;
            return {
              edges,
              pageInfo: {
                hasNextPage,
                endCursor,
              },
            };
          };

          exports.toProjectConnection = toProjectConnection;

          const toProjectEdge = (project) => {
            return {
              cursor: project.id,
              node: project,
            };
          };

          exports.toProjectEdge = toProjectEdge;

          const toMergeRequestConnection = (first, mergeRequests, toDate) => {
            const filteredMergeRequests = toDate
              ? mergeRequests.filter((mergeRequest) =>
                  date_fns_1.isAfter(
                    new Date(toDate),
                    new Date(mergeRequest.createdAt)
                  )
                )
              : mergeRequests;
            const hasNextPage = filteredMergeRequests.length > first;
            const edges = filteredMergeRequests
              .map(toMergeRequestEdge)
              .slice(0, first);
            const endCursor =
              edges.length > 0 ? edges[edges.length - 1].cursor : null;
            return {
              edges,
              pageInfo: {
                hasNextPage,
                endCursor,
              },
            };
          };

          exports.toMergeRequestConnection = toMergeRequestConnection;

          const toMergeRequestEdge = (mergeRequest) => {
            return {
              cursor: mergeRequest.createdAt,
              node: mergeRequest,
            };
          };

          exports.toMergeRequestEdge = toMergeRequestEdge;

          const toReviews = (notes, authorId) => {
            const reviewedByMap = notes.reduce((reviewers, note) => {
              if (note.author.id !== authorId)
                reviewers.set(note.author.id, note.author);
              return reviewers;
            }, new Map());
            const reviewedBy = [...reviewedByMap.values()];
            return {
              reviewedBy,
              notes,
            };
          };

          exports.toReviews = toReviews;

          /***/
        },

      /***/ "./src/config/config.class.ts":
        /*!************************************!*\
  !*** ./src/config/config.class.ts ***!
  \************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
            value: true,
          });

          class ConfigService {
            constructor() {
              this.config = {
                pageLimit: "11",
              };
            }

            get(key) {
              if (!(key in this.config)) {
                throw new Error(`Key ${key} does not exist`);
              }

              return this.config[key];
            }
          }

          exports.ConfigService = ConfigService;

          /***/
        },

      /***/ "./src/config/config.service.ts":
        /*!**************************************!*\
  !*** ./src/config/config.service.ts ***!
  \**************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
            value: true,
          });

          const config_class_1 = __webpack_require__(
            /*! ./config.class */ "./src/config/config.class.ts"
          );

          const configService = new config_class_1.ConfigService();
          exports.configService = configService;

          /***/
        },

      /***/ "./src/context/context.ts":
        /*!********************************!*\
  !*** ./src/context/context.ts ***!
  \********************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
            value: true,
          });

          const apollo_server_lambda_1 = __webpack_require__(
            /*! apollo-server-lambda */ "apollo-server-lambda"
          );

          function extractAccessToken(authorizationHeader) {
            if (typeof authorizationHeader !== "string") return "";
            const bearerString = authorizationHeader.substring(0, 7);
            if (bearerString !== "Bearer ") return "";
            const accessToken = authorizationHeader.substring(7);
            return accessToken;
          }

          function contextFunction({ event }) {
            console.log("rest: ", event);
            const accessToken = extractAccessToken(event.headers.authorization);

            if (!accessToken) {
              throw new apollo_server_lambda_1.AuthenticationError(
                "Unauthorized. No access token detected."
              );
            }

            return {
              accessToken,
            };
          }

          exports.contextFunction = contextFunction;

          /***/
        },

      /***/ "./src/dataSources/index.ts":
        /*!**********************************!*\
  !*** ./src/dataSources/index.ts ***!
  \**********************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
            value: true,
          });

          const user_1 = __webpack_require__(
            /*! ./user */ "./src/dataSources/user/index.ts"
          );

          exports.UserAPI = user_1.UserAPI;

          const project_1 = __webpack_require__(
            /*! ./project */ "./src/dataSources/project/index.ts"
          );

          const dataSources = () => ({
            userAPI: new user_1.UserAPI(),
            projectAPI: new project_1.ProjectAPI(),
          });

          exports.dataSources = dataSources;

          /***/
        },

      /***/ "./src/dataSources/project/index.ts":
        /*!******************************************!*\
  !*** ./src/dataSources/project/index.ts ***!
  \******************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
            value: true,
          });

          var project_api_1 = __webpack_require__(
            /*! ./project.api */ "./src/dataSources/project/project.api.ts"
          );

          exports.ProjectAPI = project_api_1.ProjectAPI;

          /***/
        },

      /***/ "./src/dataSources/project/mappers/gitlab-approval-to-approval.mapper.ts":
        /*!*******************************************************************************!*\
  !*** ./src/dataSources/project/mappers/gitlab-approval-to-approval.mapper.ts ***!
  \*******************************************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
            value: true,
          });

          const user_1 = __webpack_require__(
            /*! ../../user */ "./src/dataSources/user/index.ts"
          );

          const gitlabApprovalStateToApprovers = (gitlabApprovalState) => {
            const approversMap = gitlabApprovalState.rules.reduce(
              (approvers, gitlabRule) => {
                gitlabRule.approved_by.forEach((gitlabUser) => {
                  approvers.set(
                    gitlabUser.id,
                    user_1.gitlabUserToUser(gitlabUser)
                  );
                });
                return approvers;
              },
              new Map()
            );
            return [...approversMap.values()];
          };

          exports.gitlabApprovalStateToApprovers = gitlabApprovalStateToApprovers;

          /***/
        },

      /***/ "./src/dataSources/project/mappers/gitlab-mr-notes-to-mr-notes.mapper.ts":
        /*!*******************************************************************************!*\
  !*** ./src/dataSources/project/mappers/gitlab-mr-notes-to-mr-notes.mapper.ts ***!
  \*******************************************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
            value: true,
          });

          const user_1 = __webpack_require__(
            /*! ../../user */ "./src/dataSources/user/index.ts"
          );

          const gitlabMrNotesToMrNotes = (gitlabMrNotes) => {
            const filteredNotes = [];
            gitlabMrNotes.forEach((gitlabNote) => {
              if (gitlabNote.type !== "DiffNote" || gitlabNote.system) return;
              filteredNotes.push(gitlabMrNoteToMrNote(gitlabNote));
            });
            return filteredNotes;
          };

          exports.gitlabMrNotesToMrNotes = gitlabMrNotesToMrNotes;

          const gitlabMrNoteToMrNote = (gitlabNote) => {
            return {
              id: gitlabNote.id,
              type: gitlabNote.type,
              body: gitlabNote.body,
              author: user_1.gitlabUserToUser(gitlabNote.author),
              createdAt: gitlabNote.created_at,
              resolved: gitlabNote.resolved,
            };
          };

          /***/
        },

      /***/ "./src/dataSources/project/mappers/gitlab-mr-to-mr.mapper.ts":
        /*!*******************************************************************!*\
  !*** ./src/dataSources/project/mappers/gitlab-mr-to-mr.mapper.ts ***!
  \*******************************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
            value: true,
          });

          const user_1 = __webpack_require__(
            /*! ../../user */ "./src/dataSources/user/index.ts"
          );

          const gitlabMrToMr = (gitlabMr) => {
            return {
              id: gitlabMr.id,
              iid: gitlabMr.iid,
              projectId: gitlabMr.project_id,
              title: gitlabMr.title,
              description: gitlabMr.description,
              state: gitlabMr.state,
              createdAt: gitlabMr.created_at,
              updatedAt: gitlabMr.updated_at,
              mergedBy: gitlabMr.merged_by
                ? user_1.gitlabUserToUser(gitlabMr.merged_by)
                : null,
              mergedAt: gitlabMr.merged_at,
              targetBranch: gitlabMr.target_branch,
              sourceBranch: gitlabMr.source_branch,
              assignee: gitlabMr.assignee
                ? user_1.gitlabUserToUser(gitlabMr.assignee)
                : null,
              author: gitlabMr.author
                ? user_1.gitlabUserToUser(gitlabMr.author)
                : null,
              userNotesCount: gitlabMr.user_notes_count,
              webUrl: gitlabMr.web_url,
            };
          };

          exports.gitlabMrToMr = gitlabMrToMr;

          /***/
        },

      /***/ "./src/dataSources/project/mappers/gitlab-project-to-project.mapper.ts":
        /*!*****************************************************************************!*\
  !*** ./src/dataSources/project/mappers/gitlab-project-to-project.mapper.ts ***!
  \*****************************************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          "use strict";

          function _extends() {
            _extends =
              Object.assign ||
              function (target) {
                for (var i = 1; i < arguments.length; i++) {
                  var source = arguments[i];
                  for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                      target[key] = source[key];
                    }
                  }
                }
                return target;
              };
            return _extends.apply(this, arguments);
          }

          var __rest =
            (this && this.__rest) ||
            function (s, e) {
              var t = {};

              for (var p in s)
                if (
                  Object.prototype.hasOwnProperty.call(s, p) &&
                  e.indexOf(p) < 0
                )
                  t[p] = s[p];

              if (
                s != null &&
                typeof Object.getOwnPropertySymbols === "function"
              )
                for (
                  var i = 0, p = Object.getOwnPropertySymbols(s);
                  i < p.length;
                  i++
                ) {
                  if (
                    e.indexOf(p[i]) < 0 &&
                    Object.prototype.propertyIsEnumerable.call(s, p[i])
                  )
                    t[p[i]] = s[p[i]];
                }
              return t;
            };

          Object.defineProperty(exports, "__esModule", {
            value: true,
          });

          const gitlabProjectToProject = (gitlabProject) => {
            const {
                namespace,
                path_with_namespace,
                created_at,
              } = gitlabProject,
              rest = __rest(gitlabProject, [
                "namespace",
                "path_with_namespace",
                "created_at",
              ]);

            const { full_path } = namespace,
              restNamespace = __rest(namespace, ["full_path"]);

            return _extends(_extends({}, rest), {
              pathWithNamespace: path_with_namespace,
              createdAt: created_at,
              namespace: _extends(_extends({}, restNamespace), {
                fullPath: full_path,
              }),
            });
          };

          exports.gitlabProjectToProject = gitlabProjectToProject;

          /***/
        },

      /***/ "./src/dataSources/project/mappers/index.ts":
        /*!**************************************************!*\
  !*** ./src/dataSources/project/mappers/index.ts ***!
  \**************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
            value: true,
          });

          var gitlab_project_to_project_mapper_1 = __webpack_require__(
            /*! ./gitlab-project-to-project.mapper */ "./src/dataSources/project/mappers/gitlab-project-to-project.mapper.ts"
          );

          exports.gitlabProjectToProject =
            gitlab_project_to_project_mapper_1.gitlabProjectToProject;

          var gitlab_mr_to_mr_mapper_1 = __webpack_require__(
            /*! ./gitlab-mr-to-mr.mapper */ "./src/dataSources/project/mappers/gitlab-mr-to-mr.mapper.ts"
          );

          exports.gitlabMrToMr = gitlab_mr_to_mr_mapper_1.gitlabMrToMr;

          var gitlab_approval_to_approval_mapper_1 = __webpack_require__(
            /*! ./gitlab-approval-to-approval.mapper */ "./src/dataSources/project/mappers/gitlab-approval-to-approval.mapper.ts"
          );

          exports.gitlabApprovalStateToApprovers =
            gitlab_approval_to_approval_mapper_1.gitlabApprovalStateToApprovers;

          var gitlab_mr_notes_to_mr_notes_mapper_1 = __webpack_require__(
            /*! ./gitlab-mr-notes-to-mr-notes.mapper */ "./src/dataSources/project/mappers/gitlab-mr-notes-to-mr-notes.mapper.ts"
          );

          exports.gitlabMrNotesToMrNotes =
            gitlab_mr_notes_to_mr_notes_mapper_1.gitlabMrNotesToMrNotes;

          /***/
        },

      /***/ "./src/dataSources/project/project.api.ts":
        /*!************************************************!*\
  !*** ./src/dataSources/project/project.api.ts ***!
  \************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
            value: true,
          });

          const apollo_datasource_rest_1 = __webpack_require__(
            /*! apollo-datasource-rest */ "apollo-datasource-rest"
          );

          const config_service_1 = __webpack_require__(
            /*! ../../config/config.service */ "./src/config/config.service.ts"
          );

          const mappers_1 = __webpack_require__(
            /*! ./mappers */ "./src/dataSources/project/mappers/index.ts"
          );

          const user_1 = __webpack_require__(
            /*! ../user */ "./src/dataSources/user/index.ts"
          );

          class ProjectAPI extends apollo_datasource_rest_1.RESTDataSource {
            constructor() {
              super();
              this.baseURL = `https://gitlab.com/api/v4/projects`;
            }

            willSendRequest(request) {
              request.headers.set(
                "Authorization",
                `Bearer ${this.context.accessToken}`
              );

              if (!request.params.get("per_page")) {
                const pageLimit = parseInt(
                  config_service_1.configService.get("pageLimit")
                );
                request.params.set("per_page", pageLimit.toString());
              }
            }

            async getUserProjects(search = "", after = 0) {
              try {
                const gitlabProjects = await this.get("/", {
                  pagination: "keyset",
                  id_after: after,
                  order_by: "id",
                  sort: "asc",
                  membership: true,
                  search,
                  min_access_level: 30,
                });
                return gitlabProjects.map(mappers_1.gitlabProjectToProject);
              } catch (err) {
                console.log("err: ", err);
              }
            }

            async getProjectById(projectId) {
              const gitlabProject = await this.get(`/${projectId}`);
              return mappers_1.gitlabProjectToProject(gitlabProject);
            }

            async getProjectUsers(projectId) {
              const gitlabUsers = await this.get(`/${projectId}/users`, {
                per_page: "100",
              });
              return gitlabUsers.map(user_1.gitlabUserToUser);
            }

            async getProjectMergeRequests(projectId, state, after) {
              const params = {
                order_by: "created_at",
                sort: "asc",
              };
              if (state) params.state = state;
              if (after) params.created_after = after;
              const gitlabMergeRequests = await this.get(
                `/${projectId}/merge_requests`,
                params
              );
              return gitlabMergeRequests.map(mappers_1.gitlabMrToMr);
            }

            async getMergeRequestApprovers(projectId, mergeRequestIid) {
              const gitlabApprovalState = await this.get(
                `/${projectId}/merge_requests/${mergeRequestIid}/approval_state`
              );
              return mappers_1.gitlabApprovalStateToApprovers(
                gitlabApprovalState
              );
            }

            async getMergeRequestNotes(projectId, mergeRequestIid) {
              const gitlabNotes = await this.get(
                `/${projectId}/merge_requests/${mergeRequestIid}/notes`,
                {
                  per_page: "100",
                }
              );
              return mappers_1.gitlabMrNotesToMrNotes(gitlabNotes);
            }
          }

          exports.ProjectAPI = ProjectAPI;

          /***/
        },

      /***/ "./src/dataSources/user/index.ts":
        /*!***************************************!*\
  !*** ./src/dataSources/user/index.ts ***!
  \***************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
            value: true,
          });

          var user_api_1 = __webpack_require__(
            /*! ./user.api */ "./src/dataSources/user/user.api.ts"
          );

          exports.UserAPI = user_api_1.UserAPI;

          var mappers_1 = __webpack_require__(
            /*! ./mappers */ "./src/dataSources/user/mappers/index.ts"
          );

          exports.gitlabUserToUser = mappers_1.gitlabUserToUser;

          /***/
        },

      /***/ "./src/dataSources/user/mappers/gitlab-user-to-user.mapper.ts":
        /*!********************************************************************!*\
  !*** ./src/dataSources/user/mappers/gitlab-user-to-user.mapper.ts ***!
  \********************************************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          "use strict";

          function _extends() {
            _extends =
              Object.assign ||
              function (target) {
                for (var i = 1; i < arguments.length; i++) {
                  var source = arguments[i];
                  for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                      target[key] = source[key];
                    }
                  }
                }
                return target;
              };
            return _extends.apply(this, arguments);
          }

          var __rest =
            (this && this.__rest) ||
            function (s, e) {
              var t = {};

              for (var p in s)
                if (
                  Object.prototype.hasOwnProperty.call(s, p) &&
                  e.indexOf(p) < 0
                )
                  t[p] = s[p];

              if (
                s != null &&
                typeof Object.getOwnPropertySymbols === "function"
              )
                for (
                  var i = 0, p = Object.getOwnPropertySymbols(s);
                  i < p.length;
                  i++
                ) {
                  if (
                    e.indexOf(p[i]) < 0 &&
                    Object.prototype.propertyIsEnumerable.call(s, p[i])
                  )
                    t[p[i]] = s[p[i]];
                }
              return t;
            };

          Object.defineProperty(exports, "__esModule", {
            value: true,
          });

          const gitlabUserToUser = (gitlabUser) => {
            const { avatar_url } = gitlabUser,
              rest = __rest(gitlabUser, ["avatar_url"]);

            return _extends(_extends({}, rest), {
              avatarUrl: avatar_url,
            });
          };

          exports.gitlabUserToUser = gitlabUserToUser;

          /***/
        },

      /***/ "./src/dataSources/user/mappers/index.ts":
        /*!***********************************************!*\
  !*** ./src/dataSources/user/mappers/index.ts ***!
  \***********************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
            value: true,
          });

          var gitlab_user_to_user_mapper_1 = __webpack_require__(
            /*! ./gitlab-user-to-user.mapper */ "./src/dataSources/user/mappers/gitlab-user-to-user.mapper.ts"
          );

          exports.gitlabUserToUser =
            gitlab_user_to_user_mapper_1.gitlabUserToUser;

          /***/
        },

      /***/ "./src/dataSources/user/user.api.ts":
        /*!******************************************!*\
  !*** ./src/dataSources/user/user.api.ts ***!
  \******************************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
            value: true,
          });

          const apollo_datasource_rest_1 = __webpack_require__(
            /*! apollo-datasource-rest */ "apollo-datasource-rest"
          );

          const config_service_1 = __webpack_require__(
            /*! ../../config/config.service */ "./src/config/config.service.ts"
          );

          const mappers_1 = __webpack_require__(
            /*! ./mappers */ "./src/dataSources/user/mappers/index.ts"
          );

          class UserAPI extends apollo_datasource_rest_1.RESTDataSource {
            constructor() {
              super();
              this.baseURL = `https://gitlab.com/api/v4/user`;
            }

            willSendRequest(request) {
              request.headers.set(
                "Authorization",
                `Bearer ${this.context.accessToken}`
              );

              if (!request.params.get("per_page")) {
                const pageLimit = parseInt(
                  config_service_1.configService.get("pageLimit")
                );
                request.params.set("per_page", pageLimit.toString());
              }
            }

            async getCurrentUser() {
              const gitlabUser = await this.get("/");
              return mappers_1.gitlabUserToUser(gitlabUser);
            }
          }

          exports.UserAPI = UserAPI;

          /***/
        },

      /***/ "./src/main.ts":
        /*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
            value: true,
          });

          const apollo_server_lambda_1 = __webpack_require__(
            /*! apollo-server-lambda */ "apollo-server-lambda"
          );

          const resolvers_1 = __webpack_require__(
            /*! ./resolvers */ "./src/resolvers.ts"
          );

          const schema_1 = __webpack_require__(
            /*! ./schema */ "./src/schema.ts"
          );

          const dataSources_1 = __webpack_require__(
            /*! ./dataSources */ "./src/dataSources/index.ts"
          );

          const context_1 = __webpack_require__(
            /*! ./context/context */ "./src/context/context.ts"
          );

          const server = new apollo_server_lambda_1.ApolloServer({
            typeDefs: schema_1.typeDefs,
            resolvers: resolvers_1.resolvers,
            dataSources: dataSources_1.dataSources,
            context: context_1.contextFunction,
          });
          exports.handler = server.createHandler();

          /***/
        },

      /***/ "./src/resolvers.ts":
        /*!**************************!*\
  !*** ./src/resolvers.ts ***!
  \**************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
            value: true,
          });

          const date_fns_1 = __webpack_require__(/*! date-fns */ "date-fns");

          const config_service_1 = __webpack_require__(
            /*! ./config/config.service */ "./src/config/config.service.ts"
          );

          const response_mappers_1 = __webpack_require__(
            /*! ./common/response.mappers */ "./src/common/response.mappers.ts"
          );

          const mr_constants_1 = __webpack_require__(
            /*! ./common/mr-constants */ "./src/common/mr-constants.ts"
          );

          const resolvers = {
            MrStates: {
              OPENED: mr_constants_1.MrStates.Opened,
              CLOSED: mr_constants_1.MrStates.Closed,
              MERGED: mr_constants_1.MrStates.Merged,
              LOCKED: mr_constants_1.MrStates.Locked,
              ALL: mr_constants_1.MrStates.All,
            },
            Query: {
              currentUser: async (_, __, { dataSources }) => {
                return dataSources.userAPI.getCurrentUser();
              },
              projects: async (
                _,
                { search, first, after },
                { dataSources }
              ) => {
                if (
                  first >=
                  parseInt(config_service_1.configService.get("pageLimit"))
                ) {
                  throw new Error(
                    "Ooops, that much quantity is not supported yet :("
                  );
                }

                const projects = await dataSources.projectAPI.getUserProjects(
                  search,
                  after
                );
                return response_mappers_1.toProjectConnection(first, projects);
              },
              project: async (_, { projectId }, { dataSources }) => {
                return dataSources.projectAPI.getProjectById(projectId);
              },
            },
            Project: {
              users: async ({ id: projectId }, __, { dataSources }) => {
                return dataSources.projectAPI.getProjectUsers(
                  projectId.toString()
                );
              },
              mergeRequests: async (
                { id: projectId },
                { first, fromDate, toDate, after, mrState },
                { dataSources }
              ) => {
                if (
                  first >=
                  parseInt(config_service_1.configService.get("pageLimit"))
                ) {
                  throw new Error(
                    "Ooops, that much quantity is not supported yet :("
                  );
                }

                let effectiveAfter = fromDate;

                if (after) {
                  const afterDateFormat = new Date(after);
                  const fromDateFormat = new Date(fromDate);

                  if (toDate) {
                    const toDateFormat = new Date(toDate);

                    if (date_fns_1.isAfter(afterDateFormat, toDateFormat)) {
                      throw new Error("cursor cannot be after the toDate");
                    }
                  }

                  if (date_fns_1.isAfter(fromDateFormat, afterDateFormat)) {
                    throw new Error("fromDate cannot be after the cursor");
                  }

                  effectiveAfter = after;
                }

                const mergeRequests = await dataSources.projectAPI.getProjectMergeRequests(
                  projectId.toString(),
                  mrState,
                  effectiveAfter
                );
                return response_mappers_1.toMergeRequestConnection(
                  first,
                  mergeRequests,
                  toDate
                );
              },
            },
            MergeRequest: {
              approvedBy: async ({ projectId, iid }, __, { dataSources }) => {
                return dataSources.projectAPI.getMergeRequestApprovers(
                  projectId.toString(),
                  iid.toString()
                );
              },
              reviews: async (
                { projectId, iid, author },
                __,
                { dataSources }
              ) => {
                const notes = await dataSources.projectAPI.getMergeRequestNotes(
                  projectId.toString(),
                  iid.toString()
                );
                return response_mappers_1.toReviews(notes, author.id);
              },
            },
            User: {
              projects: async (_, __, { dataSources }) => {
                return dataSources.projectAPI.getUserProjects();
              },
            },
          };
          exports.resolvers = resolvers;

          /***/
        },

      /***/ "./src/schema.ts":
        /*!***********************!*\
  !*** ./src/schema.ts ***!
  \***********************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
            value: true,
          });

          const apollo_server_lambda_1 = __webpack_require__(
            /*! apollo-server-lambda */ "apollo-server-lambda"
          );

          const typeDefs = apollo_server_lambda_1.gql`
  enum MrStates {
    OPENED
    CLOSED
    MERGED
    LOCKED
    ALL
  }

  type Namespace {
    id: ID!
    name: String!
    fullPath: String!
  }

  type ProjectConnection {
    edges: [ProjectEdge]
    pageInfo: ProjectPageInfo!
  }

  type ProjectPageInfo {
    """
    True if there are still projects to fetch
    """
    hasNextPage: Boolean!
    """
    Cursor (ID) of the last edge, null if no result
    """
    endCursor: Int
  }

  type ProjectEdge {
    """
    Cursor for project is the ID since the pagination by created_at is not supported by gitlab
    """
    cursor: Int!
    """
    Project node
    """
    node: Project!
  }

  type Project {
    """
    Gitlab ID of the project
    """
    id: ID!
    """
    Name of the project
    """
    name: String!
    """
    Description of the project
    """
    description: String
    """
    Path of the project with the namespace
    """
    pathWithNamespace: String!
    """
    Namespace of the project
    """
    namespace: Namespace!
    """
    Users of the project, only developers and higher
    """
    users: [User]
    """
    Merge requests of the projects, sorted by ascending createdAt
    """
    mergeRequests(
      """
      Pagination paramater: how many results in the response, maximum is 10
      """
      first: Int = 5
      """
      Search for merge request created after this date
      """
      fromDate: String = "2019-01-01"
      """
      Search for merge request created before this date
      """
      toDate: String
      """
      Pagination parameter: cursor (created_at) used for searching new results
      """
      after: String
      """
      State of the merge requests
      """
      mrState: MrStates = ALL
    ): MergeRequestConnection
  }

  type MergeRequestConnection {
    """
    Edges, each edge contain the pagination cursor and the node (data)
    """
    edges: [MergeRequestEdge]
    """
    Page information related to the pagination
    """
    pageInfo: MergeRequestPageInfo!
  }

  type MergeRequestPageInfo {
    """
    True if there are still merge requests to fetch
    """
    hasNextPage: Boolean!
    """
    Cursor (created_at) of the last edge, null if no result
    """
    endCursor: String
  }

  type MergeRequestEdge {
    """
    Cursor for merge request is the created_at since the pagination by ID is not supported by gitlab
    """
    cursor: String!
    """
    Merge request node
    """
    node: MergeRequest!
  }

  type MergeRequest {
    """
    Gitlab ID of the merge request
    """
    id: ID!
    """
    Gitlab iid of the merge request
    """
    iid: Int!
    """
    Gitlab ID of the project to which the merge request belongs
    """
    projectId: Int!
    """
    Title of the merge request
    """
    title: String!
    """
    Description of the merge request
    """
    description: String!
    """
    State of the merge request
    """
    state: String!
    """
    Date of the creation of the merge request
    """
    createdAt: String!
    """
    Date of the last update of the merge request
    """
    updatedAt: String!
    """
    User who has merged the merge request
    """
    mergedBy: User
    """
    Date of the merge
    """
    mergedAt: String
    """
    Target branch of the merge request
    """
    targetBranch: String
    """
    Source branch of the merge request
    """
    sourceBranch: String
    """
    Assignee of the merge request
    """
    assignee: User
    """
    Author of the merge request
    """
    author: User!
    """
    Total number of notes in the merge request
    """
    userNotesCount: Int!
    """
    URL of the merge request
    """
    webUrl: String!
    """
    List of users who have approved the merge request
    """
    approvedBy: [User]
    """
    Reviews state of the merge request
    """
    reviews: Reviews
  }

  type Reviews {
    """
    List of notes in the merge request
    """
    notes: [Note]
    """
    List of users who have reviewed the merge request
    """
    reviewedBy: [User]
  }

  type Note {
    """
    Gitlab ID of the note
    """
    id: ID!
    """
    Type of the note
    """
    type: String!
    """
    Body of the note
    """
    body: String!
    """
    Author of the note
    """
    author: User!
    """
    Date of creation of the note
    """
    createdAt: String!
    """
    True if the note is resolved
    """
    resolved: Boolean!
  }

  """
  DEPRECATED
  """
  type ApprovalState {
    rules: [ApprovalRule]
  }

  """
  DEPRECATED
  """
  type ApprovalRule {
    id: ID!
    name: String!
    eligibleApprovers: [User]
    approvalsRequired: Int
    approvedBy: [User]
  }

  type User {
    """
    Gitlab ID of the user
    """
    id: ID!
    """
    Gitlab name of the user
    """
    name: String!
    """
    Gitlab username of the user
    """
    username: String!
    """
    Gitlab avatar URL of the user
    """
    avatarUrl: String!
    """
    Gitlab email of the user
    """
    email: String!
    """
    List of projects of the user
    """
    projects: [Project]
  }

  type Query {
    """
    Allow to query the current user given the access token
    """
    currentUser: User
    """
    Allow to query projects given a search parameter
    """
    projects(
      """
      Search parameter of the project
      """
      search: String
      """
      Pagination paramater: how many results in the response, maximum is 10
      """
      first: Int = 5
      """
      Pagination parameter: cursor (id) used for searching new results
      """
      after: Int = 0
    ): ProjectConnection
    """
    Allow to query one project by its ID
    """
    project(
      """
      ID of the project
      """
      projectId: String!
    ): Project
  }
`;
          exports.typeDefs = typeDefs;

          /***/
        },

      /***/ "apollo-datasource-rest":
        /*!*****************************************!*\
  !*** external "apollo-datasource-rest" ***!
  \*****************************************/
        /*! no static exports found */
        /***/ function (module, exports) {
          module.exports = require("apollo-datasource-rest");

          /***/
        },

      /***/ "apollo-server-lambda":
        /*!***************************************!*\
  !*** external "apollo-server-lambda" ***!
  \***************************************/
        /*! no static exports found */
        /***/ function (module, exports) {
          module.exports = require("apollo-server-lambda");

          /***/
        },

      /***/ "date-fns":
        /*!***************************!*\
  !*** external "date-fns" ***!
  \***************************/
        /*! no static exports found */
        /***/ function (module, exports) {
          module.exports = require("date-fns");

          /***/
        },

      /******/
    }
  )
);
//# sourceMappingURL=main.js.map
