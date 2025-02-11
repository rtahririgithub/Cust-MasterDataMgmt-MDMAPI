var express = require('express');
var os = require('os');
var config = require('config');
var fs = require('fs');
var router = express.Router();

var envPackageName = process.env.npm_package_name;
var imagetag = process.env.IMAGE_TAG;
var builddate = process.env.BUILD_DT;

// info endpoint
router.get('/info', function(req, res) {

    if (envPackageName != null) {
        var packageName = process.env.npm_package_name;
        var packageDescription = process.env.npm_package_description;
        var packageVersion = process.env.npm_package_version;
    }
    else {
        var pkgjson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

        packageName = pkgjson.name;
        packageDescription = pkgjson.description;
        packageVersion = pkgjson.version;
    }

    res.status(200).json({
        tag: imagetag,
        build: {
            date: builddate,
            name: packageName,
            description: packageDescription,
            version: packageVersion
        },
        nodeConfigEnv: nodeConfigEnv
    }).end();
});

// metrics endpoint
router.get('/metrics', function(req, res){
    res.status(200).json({
        mem: process.memoryUsage(), // An object describing the memory usage of the Node.js process measured in bytes.
        uptime: process.uptime(), // Numbers of seconds the current Node.js process has been running.
        cpu: os.loadavg() //  Array containing the 1, 5, and 15 minute load averages. UNIX-specific concept with no real equivalent on Windows platforms.
    }).end();
});

// env endpoint
router.get('/env', function(req, res){
    res.status(200).json({
        env: process.env // Returns an object containing the environment variables.
    }).end();
});

//config endpoint
router.get('/config', function(req, res){
    var result = config.util.toObject();
    res.status(200).json({
        result // Returns an object containing the config items.
    }).end();
});


module.exports = router;
