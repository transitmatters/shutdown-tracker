# TransitMatters Shutdown Tracker

This is the repository for the TransitMatters Shutdown Tracker. Client code is written in Typescript with React and vite, and the minimal backend is written in Python with Chalice.

## Requirements to develop locally

- node 22.x and npm 10+ required
  - With `nvm` installed, use `nvm install && nvm use`
  - verify with `node -v`
- Python 3.13 with recent uv
  - [`uv`](https://docs.astral.sh/uv/)
    - Ensure `uv` is using the correct Python version by running `uv venv --python 3.13`

## Development Instructions

1. In the root directory, run `npm install` to install all frontend and backend dependencies
2. Run `npm start` to start both the Vite development server and the Python backend at the same time.
   1. `npm run dev` to just run the Vite development server
   2. `npm run start-python` to just run the Chalice backend server
3. Navigate to [http://localhost:3000](http://localhost:3000) (or the url provided after running `npm start`)

## Deployment Instructions

1. Configure AWS CLI 1.x or 2.x with your AWS access key ID and secret under the profile name `transitmatters`.
2. Configure shell environment variables for AWS ACM domain certificates.
   - `TM_LABS_WILDCARD_CERT_ARN`
   - (You may also need to set `AWS_DEFAULT_REGION` in your shell to `us-east-1`. Maybe not! We're not sure.)
   - `DD_API_KEY` (Datadog API key, needed to deploy to TransitMatters stack in prod)
3. Execute `./deploy.sh`.

#### Additional notes:

- If you're on a platform with a non-GNU `sed`, deploy.sh might fail. On macOS, this is fixed by `brew install gnu-sed` and adding it to your PATH.
- If you get an unexplained error, check the CloudFormation stack status in AWS Console. Good luck!

### Linting

To lint frontend and backend code, run `npm run lint` in the root directory

To lint just frontend code, run `npm run lint-frontend`

To lint just backend code, run `npm run lint-backend`

#### VSCode

If you're using VSCode, `.vscode` contains a based default workspace setup. It also includes recommended extentions that will improve the dev experience. This config is meant to be as small as possible to enable an "out of the box" easy experience for handling eslint.

## Support TransitMatters

If you've found this app helpful or interesting, please consider [donating](https://transitmatters.org/donate) to TransitMatters to help support our mission to provide data-driven advocacy for a more reliable, sustainable, and equitable transit system in Metropolitan Boston.
