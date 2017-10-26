pipeline {
    agent any
    parameters {
        string(
            name: 'NPM_CANARY_VERSION',
            defaultValue: 'none'
        )
        booleanParam(
            name: 'RESOLVE_CHECK',
            defaultValue: false
        )
    }

    stages {
        stage ('Configure') {
            steps {

                    writeFile file: "Dockerfile", text:
'''
FROM mhart/alpine-node:8.1

WORKDIR /src
ADD . .

RUN apk add --no-cache bash git openssh python make gcc g++ && \
    npm install --no-optional --unsafe-perm && \
    npm run build && \
    npm prune --production && \
    apk del bash git openssh python make gcc g++ && \
    rm -rf ./common ./server ./client

CMD ["npm", "start"]

EXPOSE 3000
'''

                    writeFile file: "commit.jenkinsfile", text:
'''
pipeline {
    agent { docker 'node:8.2.1' }
    parameters {
        string(name: 'NPM_CANARY_VERSION')
    }
    stages {
        stage('Change and commit') {
            steps {
                script {
                    sh "/var/scripts/change_resolve_version.js ${params.NPM_CANARY_VERSION}"
                    withCredentials([
                        usernameColonPassword(credentialsId: 'DXROBOT_GITHUB', variable: 'CREDS')
                    ]) {
                        sh "/var/scripts/commit_changes.sh ${CREDS} ${params.NPM_CANARY_VERSION}"
                    }
                }
            }
        }
    }
    post {
        always {
            deleteDir()
        }
    }
}
'''

                    writeFile file: "docker-compose.test.yml", text:
'''
version: '3'
services:
  hackernews:
    command:
      - npm
      - start
    environment:
      - IS_TEST=true

  testcafe:
    build:
      context: ./tests
      dockerfile: testcafe.dockerfile
    links:
      - hackernews
    depends_on:
      - hackernews
    environment:
      - HACKERNEWS_HOST=hackernews
'''

                    writeFile file: "docker-compose.yml", text:
'''
version: '3'
services:
  hackernews:
    build: .
'''

                    writeFile file: "docker-registry-name", text:
'''hackernews'''

                    writeFile file: "tests/testcafe.dockerfile", text:
'''
FROM testcafe/testcafe

USER root
COPY ./functional ./tests

RUN mkdir -p $HOME && \
    cd ./tests/ && \
    npm i chai isomorphic-fetch uuid

CMD ["chromium --no-sandbox", "/tests"]
'''
            }
        }

        stage ('Install') {
            steps {
                script {
                    docker.image('node:8.2.1').inside {
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Unit test') {
            steps {
                script {
                    docker.image('node:8.2.1').inside {
                        sh 'npm test'
                        sh 'npm run flow'
                    }
                }
            }
        }

        stage('Prepare Dockerfile') {
            when {
                expression { return params.RESOLVE_CHECK }
            }
            steps {
                script {
                    sh "/var/scripts/patch-dockerfile.sh"
                }
            }
        }

        stage('End-to-end tests') {
            steps {
                script {
                    PROJECT_NAME = sh (
                        script: "/var/scripts/get-project-name.sh",
                        returnStdout: true
                    ).trim()
                    sh "docker-compose -f docker-compose.yml -f docker-compose.test.yml -p ${PROJECT_NAME} up --build --exit-code-from testcafe"
                    hackernewsServiceExitCode= sh (
                        script: "docker wait ${PROJECT_NAME}_hackernews_1",
                        returnStdout: true
                    ).trim()
                    if (hackernewsServiceExitCode != "137") {
                        sh "exit ${hackernewsServiceExitCode}"
                    }
                }
            }
        }

        stage('Push image') {
            when {
                not { expression { return params.RESOLVE_CHECK } }
            }
            steps {
                script {
                    docker.image('node:8.2.1').inside {
                        sh "PROJECT_NAME=${PROJECT_NAME} /var/scripts/push-image.js 172.22.6.135:6666"
                    }
                }
            }
        }

        stage('Deploy') {
            when {
                not { expression { return params.RESOLVE_CHECK } }
            }
            steps {
                sshagent(['okhotnikov_rsa']) {
                    sh """
                       ssh -o StrictHostKeyChecking=no -l okhotnikov 192.168.98.97 'cd ~/dev/hackernews
                            sudo pull-image.sh
                            sudo run-container.sh dev'
                    """
                }
            }
        }
    }

    post {
        always {
            script {
                if (!currentBuild.previousBuild || currentBuild.previousBuild.currentResult != currentBuild.currentResult) {
                    withCredentials([string(credentialsId: 'TEAMS_WEBHOOK', variable: 'TEAMS_WEBHOOK')]) {
                        docker.image('node:8.2.1').inside {
                            sh "/var/scripts/notification.js ${currentBuild.currentResult} ${env.BUILD_URL} ${TEAMS_WEBHOOK} ${env.BRANCH_NAME}"
                        }
                    }
                }
            }
            sh "docker-compose -f docker-compose.yml -f docker-compose.test.yml -p ${PROJECT_NAME} down --rmi all"
            deleteDir()
        }
    }
}
