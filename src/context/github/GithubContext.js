import { createContext, useReducer } from "react";
import GithubReducer from "./GithubReducer";

const GithubContext = createContext();

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({ children }) => {
  // const [users, setUsers] = useState([]);
  // const [loading, setLoading] = useState(true);
  const initialState = {
    user: {},
    users: [],
    repos: [],
    loading: false,
  };
  const [state, dispatch] = useReducer(GithubReducer, initialState);

  //Get initial users (testing purpose)
  const searchUsers = async function (text) {
    setLoading();

    const params = new URLSearchParams({ q: text });

    const response = await fetch(
      `https://api.github.com/search/users?${params}`,
      {
        headers: {
          Authorization: `token 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`,
        },
      }
    );

    const { items } = await response.json();
    //dispatch instead of setUsers,setLoading
    dispatch({
      type: "GET_USERS",
      payload: items,
    });
  };
  //dispatch is updating that state
  //so we have to pass in the component where we are using that

  //Get single User
  const getUser = async function (login) {
    setLoading();

    const response = await fetch(`https://api.github.com/users/${login}`, {
      headers: {
        Authorization: `token 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`,
      },
    });

    if (response.status === 404) {
      window.location = "/notfound";
    } else {
      const data = await response.json();
      //dispatch instead of setUsers,setLoading
      dispatch({
        type: "GET_USER",
        payload: data,
      });
    }
  };

  //Get user repos
  const getUserRepos = async function (login) {
    setLoading();

    const params = new URLSearchParams({ sort: "created", per_page: 10 });

    const response = await fetch(
      `https://api.github.com/users/${login}/repos?${params}`,
      {
        headers: {
          Authorization: `token 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`,
        },
      }
    );

    const data = await response.json();

    dispatch({
      type: "GET_REPOS",
      payload: data,
    });
  };

  //Set Loading
  const setLoading = () => dispatch({ type: "SET_LOADING" });

  //Clear Users from state
  const clearUsers = () => {
    dispatch({ type: "CLEAR_USERS" });
  };

  return (
    <GithubContext.Provider
      value={{
        user: state.user,
        users: state.users,
        loading: state.loading,
        repos: state.repos,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
