# Aurelia Electron - Starter Template

This is a starter template for Aurelia with Electron. It does include:

* Jest for Frontend (renderer) and Backend (main) unit tests + code coverage
* TSLint with a custom rule set
* StyleLint optimized for SCSS and BEM workflows

Below you can find instructions on how to build, test and run the project.

## Structure

The folder `src` contains the frontend (renderer process), which is a standard Aurelia CLI app. The folder `backend` on the other hand represents the main process of Electron.
Once built, the output of the frontend is as usual the `scripts` folder, whereas the backend is `dist/<name-of-app>/backend`. If you intend to package the app, it might be better
to move the frontend output to `dist/frontend` as well so that all sources are at a single location.

If you change the `name` inside the `package.json` make sure to adjust the `main` property as well as the `electron` npm script to reflect the new name

## How to develop?

Start with installing all npm dependencies via `npm install`.

After that just run `npm start` within the root of the project and both the renderer/frontend (src) and main/backend (backend) will be automatically built and a watch mode started. As soon as either a frontend/backend file is modified, the app will be rebuilt and restarted automatically.

Tests can be executed with:

* `npm run test-backend` runs main process tests and generates coverage in test/backend/coverage-jest
* `npm run test-frontend` runs renderer process tests and generates coverage in test/frontend/coverage-jest
* `npm run tdd-backend` runs continuous main process tests
* `npm run tdd-frontend` runs continuous renderer process tests
* `npm run test` runs all tests (backend/frontend) at once with coverage outputs

## Hooks

Before any push happens, a pre-push hook (Husky) will run all linters and tests to ensure no faulty code is pushed to the remote repository.
