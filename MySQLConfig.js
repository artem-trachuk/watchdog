var connection = null;

exports.start = function () {
  var mysql = require('mysql');
  connection = mysql.createPool({
    host: 'localhost',
    user: 'watchdog',
    password: '76yhtgrfvd',
    database: 'cameras_tracker',
    typeCast: function (field, next) {
      // handle only BIT(1)
      if (field.type == "BIT" && field.length == 1) {
        var bit = field.string();

        return (bit === null) ? null : bit.charCodeAt(0);
      }

      // handle everything else as default
      return next();
    }
  });
  connection.on('error', function (err) {
    exports.start();
  });
  // connection.connect(function (err) {
  //   if (err) {
  //     return;
  //   }
  // });
}
exports.getConnection = function () {
  return connection;
}

// setInterval(pingDb, 60000);

// function pingDb() {
//   connection.ping(function (err) {
//     if (err) {
//       exports.start();
//     }
//   });
// }