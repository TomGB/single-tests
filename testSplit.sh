#!/bin/sh

yarn test:beforeSplit
echo 'running split'
yarn split
echo 'running the new split tests and writing to splitTestResults.json'
yarn test:afterSplit > /dev/null 2>&1
echo 'validating that the correct tests failed'
yarn test:splitOutcome
