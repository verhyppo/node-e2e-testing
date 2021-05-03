import fs, { stat, createReadStream, createWriteStream, mkdir } from 'fs';
import stringReplaceStream from 'string-replace-stream';
import newman from 'newman';
import dotenv from 'dotenv'

dotenv.config();

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

    let acc = src;
    Object.entries(process.env)
        .filter(([k, v]) => k.startsWith(process.env.APP_REPLACE_PREFIX))
        //.forEach(([k, v]) => console.log(`{{${k.substring("environment_".length, k.length)}}}`))
        .map(([k, v]) => stringReplaceStream(`{{${k.substring(process.env.APP_REPLACE_PREFIX.length, k.length)}}}`, v))
        .forEach((it) => acc = acc.pipe(it));

    acc.pipe(dest);
}
const runNewman = () => {
    newman.run(
        {
            collection: `${projectFolder}/postman_collection.json`,
            environment: `${outputFolder}/postman_environment.json`,
            iterationCount: process.env.APP_POSTMAN_ITERATIONS,
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