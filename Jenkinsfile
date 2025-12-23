pipeline{
    
    agent any
     environment{
        git_commit_id = getGitLastCommitId()
         envt = "QA-"
         cname = "HITPA-QA-Investigation"
         thost = "hitpa_qa"
         rname = "fraud_investigation"   
    }
    
    stages{
       
        stage('Pull Code From GitHub '){
            steps{
               dir('codedir'){   
                git branch: 'hitpa_qa', changelog: false, credentialsId: 'jenkins-wisteli', poll: false, url: 'git@github.com:wisteli/ansible_playbook.git'
               }
               sh 'cp codedir/investigation.env .env'
            }
        }

        stage('Build Docker Image'){
             steps{
                sh 'docker build . -t $rname:$envt$git_commit_id'
                sh 'docker tag $rname:$envt$git_commit_id 487148650694.dkr.ecr.ap-south-1.amazonaws.com/$rname:$envt$git_commit_id'
             }
         }

        stage('Push application image to AWS'){
            steps{
                sh 'aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 487148650694.dkr.ecr.ap-south-1.amazonaws.com'
                sh ' docker push 487148650694.dkr.ecr.ap-south-1.amazonaws.com/$rname:$envt$git_commit_id'
            }
        }
        
          stage('Deploy Code On Target Machine'){
            steps{
                ansiblePlaybook credentialsId: 'gcp', disableHostKeyChecking: true, extras: '-e thost=$thost -e docker_image=487148650694.dkr.ecr.ap-south-1.amazonaws.com/$rname:$envt$git_commit_id -e container_name=$cname -e ansible_python_interpreter=/usr/bin/python3 ', installation: 'ansible', inventory: 'codedir/Inventory.txt', playbook: 'codedir/deploy_fraud_investigation.yml', sudoUser: null 
              }
          } 
    }
}

def getGitLastCommitId(){
    def commitId = sh returnStdout: true, script: 'git rev-parse --short HEAD'
    return commitId;
}
