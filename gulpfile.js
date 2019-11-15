var gulp = require('gulp');
var newman = require('newman');
var minimist = require('minimist');
var replace = require('gulp-replace');
var fs = require('fs');

var knownOptions = {
    string: [
        'project',
        'host',
        'port',
        'proto'
    ],
    default: {
        project: 'test',
        host: 'localhost',
        port: '9090',
        proto: 'https'
    }
};

var options = minimist(process.argv.slice(2), knownOptions);

gulp.task('replaceProperties', function () {
    console.log("Options passed: ", options);

    return gulp.src(['projects/' + options.project + '/postman_environment.json'])
        .pipe(replace('{{host}}', options.host))
        .pipe(replace('{{port}}', options.port))
        .pipe(replace('{{proto}}', options.proto))
        .pipe(gulp.dest('projects/' + options.project + '/target'));
});

gulp.task('default', function (cb) {
    newman.run({
        collection: require('./projects/' +options.project + '/postman_collection.json'),
        environment: require('./projects/' + options.project + '/target/postman_environment.json'),
        iterationCount: 1,
        ignoreRedirects: false,
        reporters: ['cli', 'json', 'junit'],
        reporter: {
            'junit': {'export': './projects/' + options.project + '/target/junit-report-' + new Date().getTime() + '.xml'},
            'json': {'export': './projects/' + options.project + '/target/json-report-' + new Date().getTime() + '.json'}
        },
        color: true,
        disableUnicode: true
    }, process.exit);
    cb();
});

var deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index){
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
    fs.rmdirSync(path);
    }
}

gulp.task('clean', function (cb) {
    console.log("Awww! I'm not implemented!");
});

