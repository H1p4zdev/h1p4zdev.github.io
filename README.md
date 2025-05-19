# Free Fire Tournament Web App

A responsive web application for organizing Free Fire tournaments, built with HTML, CSS, and vanilla JavaScript.

## Features

- Responsive design that works on mobile, tablet, and desktop
- Tournament listing and details
- Registration system
- Results display
- User authentication with Firebase
- Dark mode toggle
- Admin section for tournament management

## Deployment to GitHub Pages

To deploy this app to GitHub Pages:

1. Create a new GitHub repository
2. Upload all the files from this folder to your repository
3. In your repository settings, go to the "Pages" section
4. Select the branch you want to deploy (usually `main` or `master`)
5. Save the settings and wait for GitHub to deploy your site
6. Your site will be available at `https://[your-username].github.io/[repository-name]`

## Setting up Firebase Authentication

Before deploying, you need to set up Firebase Authentication:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Add a web app to your project
4. In the Firebase console, enable the Authentication service and set up the sign-in methods (Google and Email/Password)
5. Open the `js/firebase-config.js` file and replace the placeholder values with your Firebase project credentials
6. Add your GitHub Pages URL to the authorized domains in the Firebase Authentication settings

## Local Development

You can test this app locally by:

1. Opening the `index.html` file in your browser
2. Using a local server if you have one (e.g., with Python: `python -m http.server`)

## Customization

You can customize this app by:
- Changing the color scheme in `css/styles.css`
- Updating the tournament data in the `initializeData()` function in `js/main.js`
- Adding your own logo and images