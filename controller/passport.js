const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
let userModel = require('../models/user.model')


const GOOGLE_CLIENT_ID ="192073990165-2rlerlgbja1nlbgapgii9vql8u90t0s7.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const FACEBOOK_CLIENT_ID ="1121036925455124";
const FACEBOOK_CLIENT_SECRET = "3912a21a8b19b58968f4b2a44cbb862d";

// const GOOGLE_CLIENT_ID="192073990165-mvq396g8bco38n32qrp65kr4en3h4bvf.apps.googleusercontent.com"
// const GOOGLE_CLIENT_SECRET = "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";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "https://nitkkr.herokuapp.com/auth/google/callback",
      
    },
    async (accessToken, refreshToken, profile, done)=> {
      try{
        let data=profile._json;
        data=JSON.parse(JSON.stringify(data))
  
      let user= await userModel.findOne({googleId:data.sub});
      console.log(data.email,"jdvnjsndv")
      if(!user){
        console.log(profile._json,"herre is profile");
   
  
        let createData={
          email:data.email,
          name:data.name+" "+data.family_name,
          googleId:data.sub,
          rollNo:"",
          password:"",
          collegeName:"NIT KKR",
       
        }
  
        let newUser=await await userModel.create(createData);
        console.log(newUser,"jhsvdcsdc");
        
      }else{
        console.log("login succcccc")
    }
      done(null, profile);
  }catch(err){
    console.log(err,"here is err")
  }
    }
  )
);
passport.use(
  new FacebookStrategy(
    {
      clientID:FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET ,
      callbackURL: "http://localhost:4044/auth/facebook/callback",
      profileFields: ['id', 'displayName']
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);


passport.serializeUser( async (user, done) => {
  let data= await userModel.findOne({googleId:user._json.sub});
  console.log(data,"wjdhcjsw")
  done(null,user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});