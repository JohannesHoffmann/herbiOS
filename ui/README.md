# UI

This is the web based User Interface of the herbiOS. It is based on react and allows the communication with the complete system with your smartphone or with a lcd touch panel in your van.

## Dependencies

The ui needs the api up and running. The Api is the backend and handles data communications between different devices like the touch panel in the van or smartphones.

## Development

In the project directory, you can run:

_If you don't use yarn you can also use npm instead_

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## FAQ

### I only see the "You are not at the Van" screen

In this case the ui has no connection to the API. Make first sure the API is up and running. If it works correctly and the problem still occurs check the ip address of the api in `src/Config.tsx` to match the ip the API is running at.