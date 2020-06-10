const { series, src, dest } = require('gulp');

const newman = require("newman");
const minimist = require("minimist");
const replace = require("gulp-replace");
const fs = require("fs");

const knownOptions = {
  string: ["baseUrl", "iterations"],
  default: {
    baseUrl: "https://run.mocky.io",
    iterations: 1
  },
};

const options = minimist(process.argv.slice(2), knownOptions);
const projectFolder = "./project/";
const outputFolder = projectFolder + "/target"

if (!fs.existsSync(outputFolder)){
    fs.mkdirSync(outputFolder);
}

function replaceProperties(cb) {
  console.log("Options passed: ", options);

  return src([projectFolder + "/postman_environment.json"])
    .pipe(replace("{{baseUrl}}", options.baseUrl))
    .pipe(dest(outputFolder));
}

function runNewman(cb) {
  newman.run(
    {
      collection: require(projectFolder + "/postman_collection.json"),
      environment: require(outputFolder + "/postman_environment.json"),
      iterationCount: options.iterations,
      ignoreRedirects: false,
      reporters: ["cli", "json", "junit"],
      reporter: {
        junit: {
          export:
          outputFolder + "/junit-report-" + new Date().getTime() + ".xml",
        },
        json: {
          export:
          outputFolder + "/json-report-" + new Date().getTime() + ".json",
        },
      },
      color: true,
      disableUnicode: true,
    },
    process.exit
  );
  cb();
}

exports.replaceProperties = replaceProperties;
exports.runNewman = runNewman;
exports.default = series(replaceProperties, runNewman)
