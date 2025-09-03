const token = () => {
  let accessToken: string | null = null;

  return {
    getToken() {
      return accessToken;
    },
    setToken(token: string) {
      accessToken = token;
    },
    removeToken() {
      accessToken = null;
    }
  };
};
export const tokenService = token();
