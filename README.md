# Rick and Morty Locations

A responsive React application for exploring locations and residents from the
[Rick and Morty API](https://rickandmortyapi.com/).

## Features

- Random location on first load and validated searches by location ID.
- Correct, accessible pagination with five residents per page.
- Abortable requests that prevent stale responses from replacing newer data.
- Batched resident loading: one character request per visible page.
- Explicit loading, empty, error, and retry states.
- Responsive layout, keyboard focus styles, reduced-motion support, and semantic markup.
- Automated component and hook tests.

## Requirements

- Node.js `20.19+` or `22.12+`
- npm

## Getting started

```bash
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Available scripts

```bash
npm run dev        # Start the development server
npm run lint       # Run ESLint with zero warnings allowed
npm run test       # Run the test suite once
npm run test:watch # Run tests in watch mode
npm run build      # Create a production build in dist/
npm run preview    # Preview the production build locally
```

## Project structure

```text
src/
  components/  Presentational cards, resident loading, and pagination
  hooks/       Abortable fetch state management
  test/        Shared test setup and fixtures
  App.jsx      Search, location state, and page orchestration
  config.js    API and pagination constants
```

The app uses the browser Fetch API instead of an HTTP client dependency. Location
requests and batched character requests are canceled when their URL changes or the
component unmounts.

## Quality checks

Before opening a pull request, run:

```bash
npm run lint
npm run test
npm run build
npm audit
```
