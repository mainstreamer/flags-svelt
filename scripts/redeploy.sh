#!/bin/bash
set -e

FOLDER=~/Projects/flags-svelt/scripts

echo "Building image..."
"$FOLDER/build-tag-push.local"

echo "Deploying to remote..."
ssh hq@florence-hq.local 'cd ~/Apps/Capitals-quiz-ui/k8s && ./redeploy.sh'
