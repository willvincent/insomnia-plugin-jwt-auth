const _get = require('lodash.get');

module.exports.requestHooks = [
  async context => {
    // get the token field name response from api
    let unAuthenticatedPaths = context.request.getEnvironmentVariable('unathenticated_paths')
    if (unAuthenticatedPaths && !Array.isArray(unAuthenticatedPaths)) {
      unAuthenticatedPaths = [unAuthenticatedPaths];
    } else if (!unAuthenticatedPaths) {
      unAuthenticatedPaths = ['login', 'register'];
    }
    const isNonAuthPath = unAuthenticatedPaths.some(u => context.request.getUrl().includes(u));

    // do not set header authorization header when path is 'login' or 'register'
    if (!isNonAuthPath) {
      const jwt = await context.store.getItem('jwt');
      context.request.addHeader('Authorization', `Bearer ${jwt}`);
    }
  }
];

module.exports.responseHooks = [
  async context => {
    // get the token field name response from api
    let tokenName = context.request.getEnvironmentVariable('access_token');
    if (!tokenName) {
      tokenName = 'token';
    }
    

    // check if current route is login
    let loginPath = context.request.getEnvironmentVariable('login_path')
    if (!loginPath) {
      loginPath = 'login';
    }
    
    const isLoginPath = context.request.getUrl().includes(loginPath);

    // persistent jwt on the storage
    if (isLoginPath) {
      const res = context.response.getBody().toString();
      const data = JSON.parse(res);
      const token = _get(data, tokenName, 'no token');

      console.log(tokenName);
      console.log(token);
      await context.store.setItem('jwt', token);
    }
  }
];