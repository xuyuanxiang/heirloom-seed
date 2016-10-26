var express = require("express");
var compression = require("compression");
var resolve = require("path").resolve;
var serveFavicon = require("serve-favicon");
var fs = require('fs');
var favicon = resolve(__dirname, './src/favicon.ico');
var PORT = process.env.PORT || 3000;
var app = express();
app.use(compression());
if (fs.existsSync(favicon)) {
    app.use(serveFavicon(favicon));
}
app.use(express.static(resolve(__dirname, './public')));
app.listen(PORT, ()=>console.info('Process#%s running at localhost:%d in %s environment.', process.pid, PORT, process.env.NODE_ENV));