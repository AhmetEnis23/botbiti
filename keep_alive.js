var http = require('http');

http.createServer(function (req, res) {
  res.write("yaşiom bilader");
  res.end()
}).listen(8080);
