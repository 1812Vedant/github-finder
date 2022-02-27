export const searchUsers = async function (text) {
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

  return items;
};

//Get single User
export const getUser = async function (login) {
  const response = await fetch(`https://api.github.com/users/${login}`, {
    headers: {
      Authorization: `token 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`,
    },
  });

  if (response.status === 404) {
    window.location = "/notfound";
  } else {
    const data = await response.json();

    return data;
  }
};

//Get user repos
export const getUserRepos = async function (login) {
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

  return data;
};
