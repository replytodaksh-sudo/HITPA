pipeline {
    agent any
 
    environment {
        RECIPIENTS = "prashant.tyagi@consint.ai, harsh.bisht@consint.ai"
        thost = "hitpa_qa"
    }
    stages {
        stage('Notify Build Started') {
            steps {
                script {
                    def commitId = getGitLastCommitId()
                    def commitMessage = sh(returnStdout: true, script: 'git log -1 --pretty=%s').trim()
                    def commitUser = sh(returnStdout: true, script: 'git log -1 --pretty=%an').trim()
                    def commitDescription = sh(returnStdout: true, script: 'git log -1 --pretty=%B').trim()  // Get commit description
                    mail bcc: '', 
                         body: """
                            Hi Team,<br><br>
                            The build for ${env.JOB_NAME} has started.<br><br>
                            Project: ${env.JOB_NAME}<br>
                            Git Repo: https://github.com/${env.GIT_URL.tokenize(':')[1]}<br>
                            Git Branch: ${env.GIT_BRANCH.replace('origin/', '')}<br>
                            Commit ID: ${commitId}<br>
                            Commit Message: ${commitMessage}<br>
                            Commit Description: ${commitDescription}<br>
                            Commit User: ${commitUser}<br><br>
                            Thanks & Regards,<br>
                            DevOps Team<br>
                            Consint.ai
                         """,
                         cc: '', 
                         charset: 'UTF-8', 
                         from: 'prashant.tyagi@consint.ai', 
                         mimeType: 'text/html', 
                         replyTo: '', 
                         subject: "Build Started: Project name -> ${env.JOB_NAME}", 
                         to: "${env.RECIPIENTS}"
                }
            }
        }
 
        stage('Pull Code From GitHub '){
            steps{
               dir('codedir'){   
                git branch: 'hitpa_qa', changelog: false, credentialsId: 'jenkins-wisteli', poll: false, url: 'git@github.com:wisteli/ansible_playbook.git'
               }
               sh 'cp codedir/investigation.env .env'
            }
        }

        stage('Delete build folder if exists') {
            steps {
                sh returnStatus: true, script: 'rm -rf dist'
            }
        }
        stage('Build Docker Image') {
            steps {
                // Build the Docker image
                sh 'docker build -t investigation-app .'
            }
        }
 
        stage('Run Container and Copy Dist Files') {
            steps {
                script {
                    // Run the container in detached mode
                    def containerId = sh(script: "docker create investigation-app", returnStdout: true).trim()
                    // Copy the dist files from the container to the Jenkins workspace
                    sh "docker cp ${containerId}:/app/dist ./dist"
                    // Remove the container after copying
                    sh "docker rm ${containerId}"
                }
            }
        }
          stage('Deploy Code On Target Machine'){
            steps{
                ansiblePlaybook credentialsId: 'gcp', disableHostKeyChecking: true, extras: '-e thost=$thost  -e ansible_python_interpreter=/usr/bin/python3 ', installation: 'ansible', inventory: 'codedir/Inventory.txt', playbook: 'codedir/deploy_desk_audit_ui.yml', sudoUser: null 
              }
          }  
    }
 
    post {
        always {
            script {
                def commitId = getGitLastCommitId()
                def commitMessage = sh(returnStdout: true, script: 'git log -1 --pretty=%s').trim()
                def commitUser = sh(returnStdout: true, script: 'git log -1 --pretty=%an').trim()
                def commitDescription = sh(returnStdout: true, script: 'git log -1 --pretty=%B').trim()  // Get commit description
                def buildStatus = currentBuild.result ?: 'SUCCESS'
                def verb = (buildStatus == 'SUCCESS') ? 'completed successfully' : 'failed'
                def failureDetails = (buildStatus == 'FAILURE') ? "Failure Reason: ${currentBuild.description}" : ''
                mail bcc: '', 
                     body: """
                        Hi Team,<br><br>
                        The build for ${env.JOB_NAME} has ${verb}.<br><br>
                        Project: ${env.JOB_NAME}<br>
                        Git Repo: https://github.com/${env.GIT_URL.tokenize(':')[1]}<br>
                        Git Branch: ${env.GIT_BRANCH.replace('origin/', '')}<br>
                        Commit ID: ${commitId}<br>
                        Commit Message: ${commitMessage}<br>
                        Commit Description: ${commitDescription}<br>
                        Commit User: ${commitUser}<br>
                        ${failureDetails}<br>
                        Thanks & Regards,<br>
                        DevOps Team<br>
                        Consint.ai
                     """,
                     cc: '', 
                     charset: 'UTF-8', 
                     from: 'prashant.tyagi@consint.ai', 
                     mimeType: 'text/html', 
                     replyTo: '', 
                     subject: "${buildStatus} CI: Project name -> ${env.JOB_NAME}", 
                     to: "${env.RECIPIENTS}"
            }
        }
    }
}
def getGitLastCommitId() {
    def commitId = sh returnStdout: true, script: 'git rev-parse --short HEAD'
    return commitId.trim()
}