//* environment.js

const ENV = {
  development: {
    apiUrl: "https://v30e8esys8.execute-api.ap-northeast-2.amazonaws.com/prod",
  },
  production: {
    apiUrl: "https://v30e8esys8.execute-api.ap-northeast-2.amazonaws.com/prod",
  },
};

const getEnvVars = () => {
  if (__DEV__) {
    return ENV.development;
  }
  return ENV.production;
};

export default getEnvVars;
