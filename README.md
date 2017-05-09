# sistemahair-api

[![build status](https://gitlab.com/ship7software/sistemahair-api/badges/master/build.svg)](https://gitlab.com/ship7software/sistemahair-api/commits/master)
[![coverage report](https://gitlab.com/ship7software/sistemahair-api/badges/master/coverage.svg)](https://gitlab.com/ship7software/sistemahair-api/commits/master)


API dos sites Sistema Hair



## dependencies

node 6.3.x or later and mongodb

## developing

run mongodd on a separated terminal instance:

```
mongod
```

run the app:

```bash
npm run dev
```

the app runs on `localhost:4300`

## production

_you'll likely be consuming mongodb as a service, so make sure you set the env var to connect to it._

```bash
npm start
```





--------------------------------------------------------------------------------
