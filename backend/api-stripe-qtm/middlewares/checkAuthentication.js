const admin = require("firebase-admin");

//check if jwt token is valid
const authenticate = async (req, res, next) => {
    const idToken = req.body.jwt;
    try {
      if(idToken){
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
      }else{
        throw "error"
      }
    } catch (error) {
      console.error('authentication failed!', error);
      res.status(401).json({ message: 'Authentication failed', status: 401});
    };
};

module.exports = authenticate;