
<br> <br>

<div align="center">
  <img src="https://github.com/MetricOneDev/oasis-borrow/blob/pm/readme-updates/public/static/img/logo.svg" width="500" height="500">
</div>
<br>
<br>

| Environment | URL                                            | Branch |                                     Build Status                                     |
| ----------- |------------------------------------------------| :----: | :----------------------------------------------------------------------------------: |
| Production  | [Metric Vaults](https://vaults.metric.one)         | `main` | ![](https://github.com/github/docs/actions/workflows/main.yml/badge.svg?branch=main) |

<br>

# Borrow

[Borrow](https://vaults.metric.one) is the most popular user-interface to interact with the
MetricOne protocol. It enables users to generate MONE, the most used and
decentralized stablecoin, using a variety of crypto assets as collateral.

<br>

### Getting Started

Clone the repository

```sh
git clone https://github.com/MetricOneDev/oasis-borrow.git
```

Navigate to the project folder and install all dependencies

```sh
yarn
```

To create a local development instance we must first spin up the database prior to starting the web
server.

```sh
# Open one terminal and run:
./scripts/dev.sh
```

Monitor the logs and wait for the migrations to complete. This should be evident by a log message
`Migrations DONE`

In a second terminal we can then begin the web server instance over http or https (https is required
for testing hardware wallets):

\*Note: Make sure you have everything setup correctly according to the configuration explain
[here](#Configuration)

```sh
yarn start

# Optionally
HTTPS=true yarn start
```

The application will be viewable on http://localhost:3000 or https://localhost:3443 respectively

<br>

### Storybook

We utilise storybook for visualising some of our UI components in isolation. This makes development
easier for UI work as next.js is very compute heavy when re-rendering changes in development mode.

```sh
yarn storybook
```
<br>

### Configuration

The application consists of two parts

- `next.js`

- custom `express` server

There is the `next.config.js` which contains the configuration for `next.js`. This configuration is
created during build time thus The env variables that are used in this file will be evaluated during
_build time_.

Some of the values that are used you can check in the `.env` file.

#### List of the `build-time` env vars:

- `COMMIT_SHA` - The value is used together with `SHOW_BUILD_INFO`. Main usages is to display a
  commit in the footer. This targets build deployments to staging environments so that the team can
  see which version the UI reflects. The value could be a branch name or specific commit.

- `API_HOST` - The value is used to construct links based on root domain.

- `MIXPANEL_ENV` - The value could be either `production` or anything else you'd like to use to
  denote that it's NOT production. The difference is where the events are sent. For "development"
  environments the events will be displayed in the dev console within the browser. If the env is set
  to `production` then all the events will be actually sent to Mixpanel.

- `MIXPANEL_KEY` - The value will be used for `production` environments. This is the project key
  that is generated from Mixpanel.

- `USE_TERMS_OF_SERVICE` - In order to use some functionalities the user should read and accept
  Terms of Service. For development purposes, this feature can be disabled. You can disable this
  feature if you'd like to remove that functionality at all. The values are either `0` (disabled) or
  `1` (enabled).

- `SHOW_BUILD_INFO` - The value will determine whether an information about the build is diplayed in
  the footer. Currently we display only the build time and commit from which it is built. This
  targets deployments to staging environments so that the tam can see which version the UI reflects.
  The value is either `0` (disabled) or `1` (enabled)

- `INFURA_PROJECT_ID` - This is used in cases where the user hasn't authorized the application to
  access their wallet ( hasn't connected their wallet - `read-only` mode) or when the application is
  accessed with a specific provider injected.

- `ETHERSCAN_API_KEY` - The value is used to create the corresponding etherscan endpoint. For each
  transaction, there is a url that leads to that TX details in etherscan.

As mentioned previously, there is also the custom express server part which uses the env variables
at _run time_

#### List of the `run-time` env vars:

- `INFURA_PROJECT_ID_BACKEND` - This is used mainly together with the
  `<build_time>.USE_TERM_OF_SERVICE`. It is related with Argent internals. On the backend we need to
  connect to a node in order to verify the wallet that is signing the Terms of Service.

- `CHALLENGE_JWT_SECRET` - Could be any value. This is used on the server to sign JWT message.

- `USER_JWT_SECRET` - Could be any value different from `CHALLENGE_JWT_SECRET`. This is used when
  the user signs the Terms of Service.

_Note: Make sure that you call the process that build the project with the `build-time` vars and
make sure that you call the proces that runs the application with the `run-time` vars._

<br>

### Hardhat

In addition, we make use of hardhat in order to test the application in a controlled mainnet-like
environment. More details can be found [here](./HARDHAT.md)

<br>

## Contributing

Contributions are welcome. Feel free to open issues or PR's to improve Metric Borrow. We are always
open to suggestions on how best to improve the application to give the optimal user experience.

Please ensure that the tests pass, typechecks and conforms to the linting rules. The most convenient
way to do this is by calling:

```sh
yarn test:fix
```

<br>

## License

Copyright (C) 2021 Oazo Apps Limited, Licensed under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance with the License. You may obtain a copy
of the License at

> [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is
distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing permissions and limitations under the
License.
