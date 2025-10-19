import { TOKEN, USER } from "./constants";

export const saveTokens = ({
  token,
  user
}: {
  token: string;
  user: string;
}) => {
  localStorage.setItem(TOKEN, token);
  localStorage.setItem(USER, user);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN);
};



export const getUser = () => {
    const data = localStorage.getItem(USER);
    return data ? JSON.parse(data) : null;
};

export const removeTokens = () => {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USER);
};

