#!/bin/bash

# Build script for the Free Fire Tournament web app
# This script creates an optimized build for GitHub Pages deployment

echo "Starting build process for Free Fire Tournament App..."

# Create build directory
BUILD_DIR="./build"
echo "Creating build directory..."
rm -rf $BUILD_DIR  # Remove existing build directory if it exists
mkdir -p $BUILD_DIR

# Copy and minify HTML files
echo "Processing HTML files..."
minify index.html > $BUILD_DIR/index.html

# Copy and minify CSS files
echo "Processing CSS files..."
mkdir -p $BUILD_DIR/css
minify css/styles.css > $BUILD_DIR/css/styles.css

# Copy and minify JavaScript files
echo "Processing JavaScript files..."
mkdir -p $BUILD_DIR/js
for jsfile in js/*.js; do
  filename=$(basename "$jsfile")
  echo "Minifying $filename..."
  minify "$jsfile" > "$BUILD_DIR/js/$filename"
done

# Ensure firebase.js is properly included
echo "Ensuring Firebase configuration is properly set up..."
if [ ! -f "$BUILD_DIR/js/firebase.js" ]; then
  echo "Warning: firebase.js was not found in the build. Copying it now."
  cp js/firebase.js $BUILD_DIR/js/
fi

# Copy other necessary files
echo "Copying additional files..."
cp README.md $BUILD_DIR/
cp .gitignore $BUILD_DIR/

# Create a simple version file with build timestamp
echo "v1.0.0 - $(date)" > $BUILD_DIR/version.txt

# Create CNAME file if you have a custom domain (uncomment and edit if needed)
# echo "yourdomain.com" > $BUILD_DIR/CNAME

# Create a GitHub Pages configuration file
cat > $BUILD_DIR/.nojekyll << EOL
# This file prevents GitHub Pages from processing this site with Jekyll
EOL

# Create specific GitHub Pages configuration if needed
cat > $BUILD_DIR/404.html << EOL
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Not Found - Free Fire Tournament Hub</title>
  <style>
    body {
      font-family: 'Roboto', sans-serif;
      color: #212121;
      background-color: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      flex-direction: column;
      text-align: center;
    }
    .container {
      max-width: 600px;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    }
    h1 {
      color: #6200EE;
      margin-top: 0;
    }
    a {
      color: #6200EE;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .icon {
      font-size: 5rem;
      color: #6200EE;
      margin-bottom: 1rem;
    }
  </style>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
  <div class="container">
    <i class="material-icons icon">search_off</i>
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for doesn't exist or has been moved.</p>
    <p><a href="/">Return to Home Page</a></p>
  </div>
</body>
</html>
EOL

echo "Build completed! Optimized files are ready in the '$BUILD_DIR' directory."
echo "To deploy to GitHub Pages, upload the contents of the '$BUILD_DIR' directory to your repository."