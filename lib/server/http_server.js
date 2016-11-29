/* Base HTTP Server, optionally with HTTP basic auth
 * Used by log server to bind Socket.io, serve base static content
 */

var connect = require('connect'),
 serveStatic = require('serve-static'),
    sys = require(process.binding('natives').util ? 'util' : 'sys');
var auth = require('basic-auth');
//hack: dirty auth hack!
var config = require('../../etc/conf/server.conf').config;
var http = require("http");

app = connect();
app.use(serveStatic(__dirname + '/../client'));
app2 = connect();
app2.use(function (req, res) {
  var credentials = auth(req)

  if (!credentials || credentials.name !== config.basic_auth.username || credentials.pass !== config.basic_auth.password) {
    res.statusCode = 401
    res.setHeader('WWW-Authenticate', 'Basic realm="example"')
    res.end('Access denied')
  } else {
    res.end('Access granted')
  }
});
app2.use(serveStatic(__dirname + '/../client'));


// Import usage:
// var h = require('./http_server.js');
// var http_server = h.HTTPServer().listen(8899);
// var http_auth_server = h.HTTPAuthServer("foo","bar").listen(8899);
module.exports = {
  HTTPServer: function() {
    return http.createServer(
      app
    );
  },
  HTTPAuthServer: function(user, pass) {
    return http.createServer(
      app2
    );
  }
}
