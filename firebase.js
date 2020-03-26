import firebase from "firebase";
import "firebase/firestore";
import getEnvVars from "./environment";

envVars = getEnvVars("dev");

const firebaseConfig = {
  apiKey: envVars.API_KEY,
  authDomain: envVars.AUTH_DOMAIN,
  databaseURL: envVars.DATABASE_URL,
  projectId: envVars.PROJECT_ID,
  storageBucket: envVars.STORAGE_BUCKET,
  messagingSenderId: envVars.MESSAGING_SENDER_ID,
  appId: envVars.APP_ID,
  measurementId: envVars.MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig);

export default firebase;
