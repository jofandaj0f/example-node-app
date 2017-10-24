#!/usr/bin/env groovy

pipeline {
  agent { label 'docker' }
  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr:'5'))
  }
  stages {
    stage('pre-build') {
      steps {
        slack ('STARTED','#watchtops_app')
        git 'cleanupWorkspace'
      }
    }
  }
  post {
    always {
      slack (currentBuild.result,'#my_node_app')
    }
  }
}
