var connect = require('connect'),
    open = require('open'),
    lessMiddleware = require('less-middleware'),
    port = 8080;


connect.createServer(
    lessMiddleware({src: __dirname}),
    connect.static(__dirname)
).listen(port);


open('http://localhost:' + port + '/playground/index.html');
