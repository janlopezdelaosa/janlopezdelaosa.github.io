# Weather Forecast

- Live demo: https://janlopezdelaosa.github.io
- [API reference](API.md)

## Run locally

Clone repo and

```sh
$ npm install
```

> npm 7 is required to support workspaces

### Frontend

```sh
$ cd front
$ npm run start
```

### Backend

Copy `.env` file (attached to email) in `/back` folder

```sh
$ cd back
$ nodemon index.js
```

### Tests

```sh
$ cd front
$ npm run cypress:open
```

Click `main-cases_spec.js`.

## Project overview

This project is a monorepo that contains a React frontend and an Express backend.

### Repository

Consider this sketch of the repo structure:

```bash
/back
    /package.json
/docs
/front
    /package.json
/package.json
```

- With `npm 7` adding support for workspaces, `npm install` from root folder installs dependencies and keeps track of the shared ones.

- The `/docs` folder doesn't contain any documentation but the Web App build itself. GitHub Pages allows to serve content from either / (root) or (/docs). The name is misleading but just redirecting frontend build's output to /docs results in a better development workflow. Pushing the repo also deploys the website.

### Frontend

Developed with React, Typescript and TailwindCSS and deployed to GitHubPages.

Packages:

- React. Interactive UI.
- Typescript. Static type definition for JavaScript.
- TailwindCSS. Responsive design for mobile and desktop.
- ReactQuery. Cache queries and enable suspense components on fetch.

Features:

- Standard fixed Header / Footer with basic information.
- City input box loads its possible values from the DB.
- The app checks user's input against the retrieved values.
- Input is debounced to relieve some computation.
- Input box and hourly forecast components suspense on data fetching.
- Data fetching is cached.

### Backend

Developed with Express, deployed to Heroku and connected to a RealTime Database in Google Firebase.

## Others

### Quality assurance

Types, syntax and format with TypeScript, ESLint and Prettier. Project requirements with Cypress.

### Browser compatibility

Responsive design with TailwindCSS. Browser supported features with caniuse.com.
