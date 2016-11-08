var express = require("express");
var compression = require("compression");
var useragent = require('express-useragent');
var {resolve, join} = require("path");
var serveFavicon = require("serve-favicon");
var fs = require('fs');
var favicon = resolve(__dirname, './src/favicon.ico');
var app = express();
app.use(useragent.express());
app.use(compression());
if (fs.existsSync(favicon)) {
    app.use(serveFavicon(favicon));
}
app.use(express.static(resolve(__dirname, './public')));
app.get('*', function (req, res) {
    if (req.useragent.isMobile) {
        res.sendFile(join(__dirname, '/public/xs', 'index.html'))
    } else if (req.useragent.isDesktop) {
        res.sendFile(join(__dirname, '/public/md', 'index.html'))
    }
});

module.exports = app;
