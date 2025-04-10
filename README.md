# face-detection-app
This is a face detection app which was part of the final project in the course 'The Complete Web Developer: Zero to Mastery' by Andrei Neagoie but this comes with its own features.

Unlike the origional that comes with an animated background from particles, this app comes with a gradient background. The color of the backgound changes anytime there is an event.

Also, the app has a function that mounts once the user regisers or logs on so that the app would not close once the page is refreshed like the origional. This app also detects multiple faces instead of just one face in a picture.

The backend of the app contains the connection to the Clarifai services unlike the origional. The key is hidden in a .env document that has not been uploaded to github.

All the codes in both the frontend (facebrain folder) and backend (facebrainapi folder) have been explained and can be easily be read and reused in any project.

TO USE THE APP:
1. Clone this repo.
2. Run npm install in both the facebrain and facebrainapi folders.
3. Create a .env file in the facebrainapi folder and add the following codes: CLARIFAI_API_KEY = 'Your key from clarifai'.
4. create a database 'facebrain' with two tables 'users' and 'login' using Postgresql.
5. The 'users' table should be (id serial PRIMARY KEY, name VARCHAR (100), email text UNIQUE NOT NULL, entries BIGINT DEFAULT 0, joined TIMESTAMP NOT NULL).
6. The 'login' table should be (id serial PRIMARY KEY, hash VARCHAR (100), email text UNIQUE NOT NULL).
7. Start the frontend (facebrain) by running npm run dev
8. Start the backend (facebrainapi) by running npm start

Please let me know is there are any mistakes or house to futher develop the app. Thank you.
