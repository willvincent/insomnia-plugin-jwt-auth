# insomnia-jwt-auth
This is a plugin for [insomnia](https://insomnia.rest) that will store a jwt token after successful login to an api, and automatically send it to all further requests that should be authenticated.

## Usage
If your api's login route contains `login` in the path, and the response from a successful login includes the jwt token in the root of the response json, as the property `token` all you need to do is install the plugin inside insomnia, the plugin will do the rest.

Once installed (and optionally further configured) upon successful login, the jwt token will be stored within insomnia and automatically populated into future requests.

## Configuration

There are three environment variables that you can optionally define if these defaults will not work for your situation, or if you wish to define a list of paths that should not have an auth token set.

### Token Property Name
If your api's auth login response does not include the jwt token at the root level of the JSON response object as `token`, for example, if it's named differently or nested inside another object you can define the object property to look at by specifying the `access_token` environment variable:

Suppose your login response looks something like this:
```
{
  "credentials": {
    "type": "bearer",
    "jwt_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjM0LCJpYXQiOjE2MjM3ODcxODUsImV4cCI6MTYyMzc4ODA4NX0.mxEJW8R2NK8GiAGUfUxbFCWHq6qTxX4M2YGx6yo-E8A"
  },
  "user": {
      "id": 56,
      "first_name": "Bob",
      "last_name": "Ross",
      "occupation": "Painter"
  }
}
```

In this case you would set `access_token` to `credentials.jwt_token` in your environment config.

### Login Path
If your api's auth login route does not have `login` anywhere in its path, for example if you instead hit `/authenticate` you can define that in your environment config by defining `login_path`:

```
"login_path": "authenticate"
```

### Unauthenticated Paths
You may also specify an array of paths that should not receive the bearer token auth header. While in most cases the unnecessary header will probably just be ignored, you may wish to exclude it from certain routes for user registration/etc.

To do so, simply populate the list of desired routes into an array for `unathenticated_paths` in your environment config.

```
"unauthenticated_paths": [
    "login",
    "register",
    "healthcheck",
    "api-docs",
]
```

Note - it's not necessary to provide full paths, ie: `/api/v1/user` could simply be specified as `user` as the matching used simply looks for a string match.  The caveat here is if you have similar routes and only want to prevent auth headers on one, you need to be more specific in the definition - and routes that require a property cannot be used, so you couldn't for example include `/api/v1/user/*/delete` where the * indicates a wildcard or other parameter needing to be passed in, that won't work. (Pull requests welcome)


#### Thanks
Forked & extended from [thatcatinsomnia's package](https://github.com/thatcatinsomnia/insomnia-plugin-auto-set-bearer-token)
