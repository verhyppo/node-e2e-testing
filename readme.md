# node e2e testing


node-e2e-testing is a wrapper on top of newman to run replace properties in your environment json template and execute [Postman](https://postman.com) collections against multiple environments.


## Installation

The package is not provided in any public repository

## Usage

To simply run the test provided with the application, run the following command:

```bash
npm i
npm run start
```

An example is provided inside the `projects` folder, simply replace the content of the postman collections and environment.

## Properties

|Property   | Default Value   | Description|
|---|---| --- |
|`baseUrl`| `https://run.mocky.io`| base url to set in the postman environment|
|`iterations`|1|number of times the Postman collection needs to be executed|

The docker image provided, allows you to run the application from a docker container:

```
docker run docker run node-e2e-testing:latest
```

to run the application using your postman collection and environment 

```
docker \
  -v $/path/to/my/collection/:/opt/e2e-testing/projects/ \
  run node-e2e-testing:latest
```

at the end of the execution, the generated postman environment and the test results in json and junit report format, can be found in the `target`

```
projects
|-- postman_collection.json
|-- postman_environment.json
`-- target
    |-- json-report-1591739475411.json
    |-- junit-report-1591739475411.xml
    `-- postman_environment.json
```

In order to override default values, you can override the command:
```
docker \
  -v $/path/to/my/collection/:/opt/e2e-testing/projects/ \
  run node-e2e-testing:latest \
  npm run start -- --baseUrl asdf.com
```

## Build

The following program can be built and used as docker image by issuing the following command:

```
docker build -t node-e2e-testing .
```

from this, you can simply run following the instructions above or can be used as base to create another docker image that contains the tests of your choose:

```
FROM node-e2e-testing

COPY my-project /opt/e2e-testing/project
CMD ["npm", "run", "start", "--", "--baseUrl=https://test.com"]
```


## Roadmap

* allow pass parameters as environment variables
* use a better cli tool

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
