import fs, { stat, createReadStream, createWriteStream, mkdir } from 'fs';
import stringReplaceStream from 'string-replace-stream';
import minimist from 'minimist'
import newman from 'newman';

const knownOptions = {
    string: ["baseUrl", "iterations"],
    default: {
        baseUrl: "https://run.mocky.io",
        iterations: 1
    },
};

const options = minimist(process.argv.slice(2), knownOptions);
const projectFolder = "./project";
const outputFolder = projectFolder + "/target"

const prepareEnvironment = () => {
    stat(outputFolder, (err, stat) => {
        if (err && err.errno == -2) {
            console.log(err);
            return mkdir(outputFolder, executepipe)
        }
        return executepipe();
    })
}

const executepipe = () => {
    const src = createReadStream(`${projectFolder}/postman_environment.json`);
    const dest = createWriteStream(`${outputFolder}/postman_environment.json`)
    return src.
        pipe(stringReplaceStream("{{baseUrl}}", options.baseUrl))
        .pipe(dest);
}
const runNewman = () => {
    newman.run(
        {
            collection: `${projectFolder}/postman_collection.json`,
            environment: `${outputFolder}/postman_environment.json`,
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
}

await prepareEnvironment();
runNewman();