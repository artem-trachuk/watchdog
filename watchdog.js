const net = require('net');
var ping = require("net-ping");
var options = {
    retries: 4,
}
var session = ping.createSession(options);
require('./MySQLConfig').start();
var watchdogHandler = require('./MySQLWatchdogHandler');

setInterval(checkPing, 1500);
setInterval(checkTCP, 1500);

function checkPing() {
    watchdogHandler.getPingDevices()
        .then(devices => {
            devices.forEach(device => {
                session.pingHost(device.host, function (error, target) {
                    if (error)
                        if (error instanceof ping.RequestTimedOutError)
                            watchdogHandler.updateStatus(device.id, false).catch(err => {});
                        else
                            watchdogHandler.updateStatus(device.id, false).catch(err => {});
                    else
                        watchdogHandler.updateStatus(device.id, true).catch(err => {});
                });
            });
        })
        .catch(err => {
            console.log(err);
        });
}

function checkTCP() {
    watchdogHandler.getTCPDevices()
    .then(devices => {
        devices.forEach(device => {
            const connection = net.createConnection(device.port, device.host);
            connection.setTimeout(3000);
            connection.on('timeout', () => {
                watchdogHandler.updateStatus(device.id, false).catch(err => {});
                connection.end();
            });
            connection.on('error', () => {
                watchdogHandler.updateStatus(device.id, false).catch(err => {});
                connection.end();
            });
            connection.on('connect', () => {
                watchdogHandler.updateStatus(device.id, true).catch(err => {});
                connection.end();
            });
        });
    })
    .catch(err => console.log(err));
}