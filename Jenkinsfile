pipeline {
    stages {
        stage ('Install') {
            agent {
                docker {
                    image 'reimagined/resolve-ci'
                }
            }
            steps {
                script {
                    sh 'npm install'
                }
            }
        }

        stage('Unit test') {
            agent {
                docker {
                    image 'reimagined/resolve-ci'
                }
            }
            steps {
                script {
                    sh 'npm test'
                    sh 'npm run flow'
                }
            }
        }

        stage('End-to-end tests') {
            agent {
                docker {
                    image 'reimagined/resolve-ci'
                }
            }
            steps {
                script {
                    sh """
                        /init.sh
                        npm run test:functional -- --browser=path:/chromium
                    """
                }
            }
        }

        stage('Push image') {
            agent {
                docker {
                    image 'reimagined/resolve-ci'
                }
            }
            when {
                branch 'master'
            }
            steps {
                script {
                    sh "PROJECT_NAME=${PROJECT_NAME} /var/scripts/push-image.js 172.22.6.135:6666"
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'master'
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
                        docker.image('reimagined/resolve-ci').inside {
                            sh "/var/scripts/notification.js ${currentBuild.currentResult} ${env.BUILD_URL} ${TEAMS_WEBHOOK} ${env.BRANCH_NAME}"
                        }
                    }
                }
            }

            deleteDir()
        }
    }
}
