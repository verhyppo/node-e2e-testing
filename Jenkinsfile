pipeline {
    agent {
        docker { 
            image 'node:11-alpine'
        }
    }
    parameters {
        string(name: 'project', description:'name of the project to test')
        string(name: 'host', description:'host where the project is deployed')
        string(name: 'port', description:'port where the project is deployed', defaultValue: '443')
        string(name: 'protocol', description:'protocol to use', defaultValue: 'https')
    }
    stages {
        stage('Prepare run') {
            steps {
                sh 'npm install'
                sh "npm run gulp replaceProperties -- -proto ${params.protocol} -host ${params.host} -port ${params.port} -project ${params.project}"
            }
        }
        stage('Run tests') {
            steps {
                sh "npm run gulp default -- -project ${params.project}"
            }
        }
    }
    post {
        always {
            junit "target/${params.project}/target/*.xml"
        }
    }
}
