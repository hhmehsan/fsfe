const http = require('http');
http.createServer(function(req,res){
res.write('Dear Zarei, FUCK YOU!');
res.end();
}).listen(3000);
console.log("server started");
