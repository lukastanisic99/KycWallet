'use strict'

var os = require('os');
if (os.platform() == 'win32') {
    if (os.arch() == 'ia32') {
        var chilkat = require('@chilkat/ck-node16-win-ia32');
    } else {
        var chilkat = require('@chilkat/ck-node16-win64');
    }
} else if (os.platform() == 'linux') {
    if (os.arch() == 'arm') {
        var chilkat = require('@chilkat/ck-node16-arm');
    } else if (os.arch() == 'x86') {
        var chilkat = require('@chilkat/ck-node16-linux32');
    } else {
        var chilkat = require('@chilkat/ck-node16-linux64');
    }
} else if (os.platform() == 'darwin') {
    var chilkat = require('@chilkat/ck-node16-macosx');
}

export default chilkat;