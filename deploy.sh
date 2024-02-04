#!/bin/bash -x

if [[ -z "$DD_API_KEY" || -z "$TM_LABS_WILDCARD_CERT_ARN" ]]; then
    echo "Must provide DD_API_KEY and TM_LABS_WILDCARD_CERT_ARN in environment" 1>&2
    exit 1
fi

STACK_NAME=shutdown-tracker
FRONTEND_HOSTNAME="shutdowns.labs.transitmatters.org"
FRONTEND_ZONE="labs.transitmatters.org"
BUCKET="$FRONTEND_HOSTNAME"
FRONTEND_CERT_ARN="$TM_LABS_WILDCARD_CERT_ARN" 

# Identify the version and commit of the current deploy
GIT_VERSION=`git describe --tags --always`
GIT_SHA=`git rev-parse HEAD`
echo "Deploying version $GIT_VERSION | $GIT_SHA"

# Adding some datadog tags to get better data
DD_TAGS="git.commit.sha:$GIT_SHA,git.repository_url:github.com/transitmatters/shutdown-tracker"

npm run build

# Deploy to cloudformation
aws cloudformation deploy --template-file cloudformation.json --stack-name $STACK_NAME --capabilities CAPABILITY_IAM --no-fail-on-empty-changeset --parameter-overrides \
    TMFrontendHostname=$FRONTEND_HOSTNAME \
    TMFrontendZone=$FRONTEND_ZONE \
    TMFrontendCertArn=$FRONTEND_CERT_ARN \
    DDApiKey=$DD_API_KEY \
    GitVersion=$GIT_VERSION \
    DDTags=$DD_TAGS
aws s3 sync dist/ s3://$BUCKET

# Grab the cloudfront ID and invalidate its cache
CLOUDFRONT_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Aliases.Items!=null] | [?contains(Aliases.Items, '$FRONTEND_HOSTNAME')].Id | [0]" --output text)
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*"
