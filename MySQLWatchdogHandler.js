var MySQLconfig = require('./MySQLConfig');
var connection = MySQLconfig.getConnection();

function isConnected() {
    return connection;
}

exports.getPingDevices = getPingDevices;
exports.updateStatus = updateStatus;
exports.getTCPDevices = getTCPDevices;

function getPingDevices() {
    return new Promise(function (resolve, reject) {
        if (!isConnected()) reject('no connection');
        else {
            connection.query(`SELECT id, INET_NTOA(host) AS host FROM watchdog WHERE wdType = 'ping'`, function (err, rows) {
                if (err) reject(err);
                else if (rows.length > 0) resolve(rows);
                else reject(null);
            });
        }
    });
}

function getTCPDevices() {
    return new Promise(function (resolve, reject) {
        if (!isConnected()) reject('no connection');
        else {
            connection.query(`SELECT id, INET_NTOA(host) AS host, port FROM watchdog WHERE wdType = 'tcp'`, function (err, rows) {
                if (err) reject(err);
                else if (rows.length > 0) resolve(rows);
                else reject(null);
            });
        }
    });
}

function updateStatus(id, status) {
    return new Promise(function (resolve, reject) {
        if (!isConnected()) reject('no connection');
        else {
            connection.query(`UPDATE watchdog SET status = ? WHERE id = ?`, [status, id], function (err, res) {
                if (err) reject(err);
                else resolve(res);
            });
        }
    });
}

