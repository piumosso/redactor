var connect = require('connect'),
    open = require('open'),
    port = 8080;


connect.createServer(
    connect.static(__dirname)
).listen(port);


open('http://localhost:' + port + '/playground/index.html');
