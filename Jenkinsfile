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
                branch 'master'
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
                branch 'master'
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
