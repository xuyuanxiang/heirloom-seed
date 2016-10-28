var express = require("express");
var compression = require("compression");
var useragent = require('express-useragent');
var resolve = require("path").resolve;
var serveFavicon = require("serve-favicon");
var fs = require('fs');
var favicon = resolve(__dirname, './src/favicon.ico');
var PORT = process.env.PORT || 3000;
var app = express();
app.use(useragent.express());
app.use(compression());
if (fs.existsSync(favicon)) {
    app.use(serveFavicon(favicon));
}
app.use(express.static(resolve(__dirname, './public')));
app.get('*', function (req, res) {
    if (req.useragent.isMobile) {
        res.sendFile(resolve(__dirname, './public', 'index.xs.html'))
    } else if (req.useragent.isDesktop) {
        res.sendFile(resolve(__dirname, './public', 'index.md.html'))
    }
});
app.listen(PORT, ()=>console.info('Process#%s running at localhost:%d in %s environment.', process.pid, PORT, process.env.NODE_ENV));