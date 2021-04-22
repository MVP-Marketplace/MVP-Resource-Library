const { db } = require("../util/admin");
const config = require("../config");
const firebase = require("firebase");

firebase.initializeApp(config);

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    const token = await data.user.getIdToken();
    res.json(token);
  } catch (error) {
    res.status(403).json({ general: "wrong credentials, please try again" });
  }
};

exports.signUpUser = async (req, res) => {
  const newUser = {
    email: req.body.email.toLowerCase(),
    name: req.body.password.toLowerCase(),
    password: req.body.password,
  };
  let token, userId;
  db.doc(`/users/${newUser.email}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ email: "this email is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idtoken) => {
      token = idtoken;
      // make object of fields we'd like to add to the user documents in Firestore
      const userCredentials = {
        name: newUser.name,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId,
      };
      // Create a user in the users collection in Firestore
      return db.doc(`/users/${newUser.name}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return response.status(400).json({ email: "Email already in use" });
      } else {
        return res
          .status(500)
          .json({ general: "Something went wrong, please try again" });
      }
    });
};
