# heirloom-seed

My project template for [generator-heirloom](https://github.com/xuyuanxiang/generator-heirloom).

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
Using webpack to bundle all assets under NODE_ENV: `production`:
```bash
npm run deploy
```
+ *pre deploy: run `Jest` with `--coverage`*；
+ *post deploy: upload coverage reports to `Coveralls`*；
+ *webpack will be interrupted with `tslint` errors;*
+ *all static resources will be uploaded to [Aliyun CDN service](https://cn.aliyun.com/product/cdn)* by `aliyunoss-webpack-plugin`。
+ *Aliyun CDN service config in `package.json` file.*

### Product
Using [PM2](https://github.com/Unitech/pm2) to start a [Express](https://github.com/expressjs/express) server with [compression](https://github.com/expressjs/compression) middleware.
```bash
NODE_ENV=production npm start
```

## Detect User-Agent

### Platform-specific extensions

For example:

+ `index.md.tsx`: Desktop.
+ `index.xs.tsx`: Mobile.

Send different views to browser:

```
// ./index.js
app.get('*', function (req, res) {
    if (req.useragent.isMobile) {
        res.sendFile(resolve(__dirname, './public/xs', 'index.html'))
    } else if (req.useragent.isDesktop) {
        res.sendFile(resolve(__dirname, './public/md', 'index.html'))
    }
});
```

*`req.useragent`: see [express-useragent API](https://github.com/biggora/express-useragent)*

## Docker
```
docker build --rm=true -t heirloom-seed:1.0 .
docker run -i -t -p 80:4000 heirloom-seed:1.0
```

## Travis

Push a new tag to github will trigger Travis.
```
git add 1.0.0
git push origin 1.0.0
```

A new version will be published to [NPM](https://www.npmjs.com/) after a successful build task.

