#!/bin/bash
NAMESPACE="capitals-ui"

echo "=== Redeploying capitals-ui ==="

# Restart deployment to pull latest image
echo "Restarting deployment..."
kubectl rollout restart deployment/capitals-ui -n $NAMESPACE

# Wait for rollout to complete
echo ""
echo "Waiting for capitals-ui..."
kubectl rollout status deployment/capitals-ui -n $NAMESPACE --timeout=120s

echo ""
echo "=== Redeploy Complete ==="
kubectl get pods -n $NAMESPACE
