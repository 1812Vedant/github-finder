import { createContext, useReducer } from "react";
import GithubReducer from "./GithubReducer";

const GithubContext = createContext();

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({ children }) => {
  // const [users, setUsers] = useState([]);
  // const [loading, setLoading] = useState(true);
  const initialState = {
    users: [],
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

  //Set Loading
  const setLoading = () => dispatch({ type: "SET_LOADING" });

  //Clear Users from state
  const clearUsers = () => {
    dispatch({ type: "CLEAR_USERS" });
  };

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        loading: state.loading,
        searchUsers,
        clearUsers,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
