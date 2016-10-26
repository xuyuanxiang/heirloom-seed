## heirloom-seed
My general project seed. 

Using modern front-end frameworks and utils, like:

+ [TypeScript](https://www.typescriptlang.org/)
+ [React](https://facebook.github.io/react/) 
+ [Redux](http://redux.js.org/)
+ [PostCSS](http://postcss.org/)
+ [Jest](https://facebook.github.io/jest/)
+ [TSLint](https://palantir.github.io/tslint/)
+ [webpack](http://webpack.github.io/docs/)
+ [Travis](https://travis-ci.org/)
+ [Coveralls](https://coveralls.io/)
+ [Docker](https://www.docker.com/)
 
## Scripts
 
### Develop

Start [webpack-dev-server](http://webpack.github.io/docs/webpack-dev-server.html) with features: Automatic Refresh、Hot Replacement...

```bash
npm start
```
 
### Test

Using Jest to run all tests:


```bash
npm test
```

### Deploy
Using webpack to bundle all assets in NODE_ENV: `Production` 
```bash
npm run deploy
```
+ *pre deploy: run `Jest` with `--coverage`*
+ *post deploy: upload coverage reports to `Coveralls`*

### Serve
Using [PM2](https://github.com/Unitech/pm2) to start a [Express](https://github.com/expressjs/express) server with [compression](https://github.com/expressjs/compression) middleware.
```bash
npm run serve
```
## Docker
```
docker build --rm=true -t heirloom-seed:1.0 .
docker run -i -t -p 80:3000 heirloom-seed:1.0
```

## Travis

Push a new tag to Trigger Travis.
```
git add 1.0.0
git push origin 1.0.0
```

Will publish a new version to [NPM](https://www.npmjs.com/) after a successful build task.

