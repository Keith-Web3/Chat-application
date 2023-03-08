# Chat Application
This is a chat application built with Vite, React, and TypeScript. It supports private messaging, creating and messaging in public channels, and video calls implemented using WebRTC and Agora. The messaging feature is implemented using Firebase for real-time communication.
## To get started, clone the repository and install dependencies:
```html
git clone https://github.com/Keith-Web3/Chat-application.git
cd chat-app
npm install
```
## Setting up Firebase Credentials
Before you can use the chat application, you will need to set up Firebase credentials for the app. To do this, follow these steps:

1. Create a new Firebase project in the [Firebase Console](https://console.firebase.google.com/).

2. Add a new web app to the project by clicking on the "Add app" button and selecting "Web".

3. Give the app a nickname and click on "Register app".

4. Copy the Firebase config object that appears on the next screen, which should look something like this:
```
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  databaseURL: "your-database-url",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
};
```
5. Create a new file in the root directory of the chat application called .env and add the following lines, replacing the values with your Firebase config object values:
```
VITE_API_KEY = "your-api-key"
VITE_AUTH_DOMAIN = "your-auth-domain"
VITE_PROJECT_ID = "your-project-id"
VITE_STORAGE_BUCKET = "your-storage-bucket"
VITE_MESSAGING_SENDER_ID = "your-messaging-sender-id"
VITE_APP_ID = "your-app-id"
```
## Setting up Agora Credentials
Before you can use the video calling feature of the chat application, you will need to set up an Agora app and get an app ID. To do this, follow these steps:
1. Sign up for an account on the [Agora website](https://www.agora.io/en/).
2. Create a new app by going to the [project management tab](https://console.agora.io/projects) and clicking on the create button.
3. Once your app is created, click on the app to access the app settings.
4. Copy the app ID, which should be a string of letters and numbers.
5. Add the copied ID to your .env file created earlier
```
VITE_API_KEY = "your-api-key"
VITE_AUTH_DOMAIN = "your-auth-domain"
VITE_PROJECT_ID = "your-project-id"
VITE_STORAGE_BUCKET = "your-storage-bucket"
VITE_MESSAGING_SENDER_ID = "your-messaging-sender-id"
VITE_APP_ID = "your-app-id"
VITE_AGORA_APP_ID = "agora-app-id"
```

To run the application, use the following command:
```html
npm run dev
```
This will start the application in development mode at http://localhost:5173. Open this URL in your web browser to access the chat application.
## Features
The chat application supports the following features:

### Private Messaging
Users can send private messages to each other by creating channels with themselves as the only users or clicking on the user you wish to message in the users tab of a channel. The private messaging feature is implemented using Firebase for real-time communication.

### Public Channels
Users can create and join public channels. They can send messages to the entire channel, and other users in the channel can see those messages in real-time.

### Video Calls
Users can initiate video calls with each other. This feature is only supported on private messsaging channels i.e channels with only two users as the video-calling feature is implemented using WebRTC, which only supports peer-to-peer connection.

## Technologies Used
The following technologies were used to build this chat application:

* Vite: a build tool that provides fast and efficient development builds
* React: a JavaScript library for building user interfaces
* TypeScript: a typed superset of JavaScript
* Firebase: a mobile and web application development platform that provides backend services for real-time applications
* WebRTC: a set of JavaScript APIs for real-time communication between peers
## Testing
This application does not currently have any tests. If you would like to contribute tests, please submit a pull request.

## Contributing
If you would like to contribute to this project, please submit a pull request.

## License
This project is licensed under the MIT license. See the LICENSE file for more information.
