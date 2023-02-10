import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IRepos, IUser, ServerResponse } from "../../models/models";

export const githubApi = createApi({
  reducerPath: "github/apiRadon222",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.github.com" }),
  refetchOnFocus: true,
  endpoints: (build) => ({
    searchUsers: build.query<IUser[], string>({
      query: (search: string) => ({
        url: `search/users`,
        params: {
          q: search,
          per_page: 10,
        },
      }),
      transformResponse: (response: ServerResponse) => response.items,
    }),
    getUserRepos: build.query<IRepos[], string>({
      query: (username: string) => ({
        url: `users/${username}/repos`,
      }),
    }),
    createuser: build.mutation<any, void>({
      query: () => ``,
    }),
  }),
});

export const { useSearchUsersQuery, useLazyGetUserReposQuery } = githubApi;
