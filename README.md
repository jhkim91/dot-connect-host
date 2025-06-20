# Dot Connect

A puzzle game where you connect dots to solve challenging puzzles.

## Features

- 6x6 grid puzzle board
- Start and end points
- Normal dots and trap dots
- Path visualization
- Hint system
- Undo functionality
- Retry current puzzle
- New game generation

## Controls

- 💡 Hint: Shows the next possible move
- ↩️ Undo: Reverts the last move
- 🔄 New Game: Generates a new puzzle
- 🎮 Retry: Restarts the current puzzle

## Game Rules

1. Start from the green dot
2. Visit all normal dots exactly once
3. Avoid trap dots (X)
4. End at the red dot
5. Only move horizontally or vertically

## Development

### Prerequisites

- Node.js
- npm or yarn

### Installation

```bash
npm install
# or
yarn install
```

### Running the Development Server

```bash
npm start
# or
yarn start
```

### Building for Production

```bash
npm run build
# or
yarn build
```

## Technologies Used

- React
- TypeScript
- Styled Components
- Context API for state management

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
