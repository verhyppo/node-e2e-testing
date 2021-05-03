# node e2e testing


node-e2e-testing is a wrapper on top of newman to run replace properties in your environment json template and execute [Postman](https://postman.com) collections against multiple environments.


## Installation

The NPM package is not provided in any public repository

## Usage
### Node
To simply run the test provided with the application, run the following command:

```bash
npm i
npm run start
```

An example is provided under the `projects` folder.
To run the project with your postman collection and environment simply replace the contents.

### Docker

Docker image built by the project, allows you to run the application from a docker container:

```
docker run docker run node-e2e-testing:latest
```

To override application configutation, just mount a `.env` file under `/opt/e2e-testing`

```
docker \
  -v /path/to/my/.env:/opt/e2e-testing/.env
  run node-e2e-testing:latest
```

In order to override default values, you can override the command:
```
docker \
  -v /path/to/my/.env:/opt/e2e-testing/.env
  -v $/path/to/my/collection/:/opt/e2e-testing/project/ \
  run node-e2e-testing:latest
```

## Placeholder removal

You can replace as many variable as you prefer via the `.env` file.

example file
```
APP_REPLACE_PREFIX=APP_ENVIRONMENT_
APP_NEWMAN_ITERATIONS=1
APP_ENVIRONMENT_baseUrl=https://run.mocky.io
```

| Property                | Default Value      | Description                                                         |
| ----------------------- | ------------------ | ------------------------------------------------------------------- |
| `APP_REPLACE_PREFIX`    | `APP_ENVIRONMENT_` | common prefix for replacement variables in your postman environment |
| `APP_POSTMAN_ITERATIONS` | 1                  | number of times the Postman collection needs to be executed         |

In the example above, `APP_ENVIRONMENT_baseUrl` is the one that will be substituted to the `projects/postman_environment.json` when found in the forman `{{baseUrl}}`

at the end of the execution, the generated postman environment and the test results in json and junit report format, can be found in the `target`

## Build

The following program can be built and used as docker image by issuing the following command:

```
docker build -t node-e2e-testing .
```

## Roadmap

* ~~allow pass parameters as environment variables~~
* ~~use a better cli tool~~

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
