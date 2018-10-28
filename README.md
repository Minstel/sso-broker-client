# SSO Broker Client

This is a Javascript implementation of Broker class from [Legalthings SSO](https://github.com/legalthings/sso). It's intended for client-side usage, but should also work server-side, in node.js environment. Although it was not tested server-side, so possible some small twiks might be needed for this.

Installation
---

For testing or further development purposes it should be installed with command

```
npm install sso-broker-client
```

`package.json` file contains some commands, that can be used for working with repo:

```
"scripts": {
    "test": "./node_modules/.bin/jasmine-node spec",
    "dev": "./node_modules/.bin/webpack --config webpack.config.js --env dev",
    "build": "./node_modules/.bin/webpack --config webpack.config.js --env prod"
}
```

Commands `dev` and `build` generate files `/assets/sso-broker.js` and `/assets/sso-broker.min.js` respectively. First is for developing purposes, second one should be used on production.

Just put one of these files into your web-site directory and include on web-page:

```
<script src="/js/sso-broker.js"></script>
```

Usage
---

Such inclusion creates a global variable `SSOBroker`, representing a class, that should be instantiated with constructor:

```
const url = 'http://some.server/url';
const brokerId = 'MyEmailAccount';
const brokerSecret = '1e4gHu9ZXc3';
const cookieLifetime = 3600 * 24; //This is in seconds. Default value - 3600 (1 hour)
const debug = false;

const broker = new SSOBroker(window, url, brokerId, brokerSecret, cookieLifetime, debug);
```

Parameter `window` is a global JS variable, representing page global scope.
Parameters `cookieLifetime` and `debug` are optional. Setting `debug` to `true` enables debug console output.
The rest of parameters are the one used for PHP `Broker` constructor (see [Legalthings SSO](https://github.com/legalthings/sso) repo).

Here's a full set of method calls, intended for authorization and getting user information:

```
broker.attach()
    .then(() => broker.login(username, password))
    .then(() => broker.userInfo)
    .catch(error => console.log(error));
```

API
---

All methods of broker are public, for testing purposes. The following should be considered an API, as might be helpfull in working with user information:

* `getUserInfo()`
* `isAttached()`
* `attach(params?)`
* `login(username, password)`
* `logout()`
* `sendGETRequest(url, params)`
* `sendPOSTRequest(url, params)`
* `sendRequest(request, options)`

`isAttached` method returns boolean. All others return `Promise`.

CORS
---

In order to be used cross-domain (and that's the intended way for broker to work), server should responde with the following headers to each broker request:

* `Access-Control-Allow-Origin:  $_SERVER['HTTP_ORIGIN']`;
* `Access-Control-Allow-Headers: Authorization`;
* `Access-Control-Allow-Credentials: true`;

Using wildcard `*` for header `Access-Control-Allow-Origin` won't work, as setting origin explicitly in this header is required for CORS requests with cookies.

Also preflight `OPTIONS` request will be issued by browser before each broker `GET` or `POST` request. Be sure to handle it correctly server-side - for ex., do not actually process broker request, but only send `Access-Controll-...` headers.

