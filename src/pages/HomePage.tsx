import { useEffect, useState } from "react";
import { RepoCard } from "../components/RepoCard";
import { useDebounce } from "../hoooks/debounce";
import {
  useLazyGetUserReposQuery,
  useSearchUsersQuery,
} from "../store/github/github.api";

export const HomePage = () => {
  const [search, setSearch] = useState("");
  const [dropdown, setDropdown] = useState(false);
  const debounced = useDebounce(search);
  const { data, isError, isLoading } = useSearchUsersQuery(debounced, {
    skip: debounced.length < 3,
    refetchOnFocus: true,
  });
  const [fetchRepos, { isLoading: isReposLoading, data: reposData }] =
    useLazyGetUserReposQuery();

  useEffect(() => {
    setDropdown(debounced.length > 3 && data?.length! > 0);
  }, [debounced, data]);

  // console.log(data);

  const clickHandler = (username: string) => {
    fetchRepos(username);
    setDropdown(false);
  };
  return (
    <div className="flex justify-center pt-10 mx-auto h-screen w-screen">
      {isError && (
        <p className="text-center text-red-600">Something went wrong...</p>
      )}
      <div className="relative w-[560px]">
        <input
          type="text"
          className="border py-2 px-4 w-full h-[42px] mb-2"
          placeholder="Search for Githib username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {dropdown && (
          <ul className="absolute top-12 left-0 ring-0 max-h-[200px] shadow-md bg-white list-none overflow-y-scroll">
            {isLoading && <p className="text-center ">Loading...</p>}
            {data?.map((user) => (
              <li
                key={user.id}
                onClick={() => clickHandler(user.login)}
                className="py-2 px-4 hover:bg-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                {user.login}
              </li>
            ))}
          </ul>
        )}
        <div className="container">
          {isReposLoading && (
            <p className="text-center">Repos are loading...</p>
          )}
          {reposData?.map((repo) => (
            <RepoCard repo={repo} key={repo.id} />
          ))}
        </div>
      </div>
    </div>
  );
};
