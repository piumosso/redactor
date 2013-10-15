var connect = require('connect'),
    open = require('open'),
    lessMiddleware = require('less-middleware'),
    port = 8080,
    app;


connect.createServer()
    .use(lessMiddleware({src: __dirname}))
    .use(function(req, res, next){
        if (req.url == '/playground/upload.json') {
            res.end(JSON.stringify({
                src: "example.jpg"
            }));
        } else {
            next();
        }
    })
    .use(connect.static(__dirname))
    .listen(port);


open('http://localhost:' + port + '/playground/index.html');
