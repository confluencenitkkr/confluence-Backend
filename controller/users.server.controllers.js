let userModel = require("../models/user.model");
let jwt = require("jsonwebtoken");
let universalFunctions = require("../utils/universalFunctions");
var Joi = require("joi");
const jobsModel = require("../models/jobs.model");
let responseMessages=require("../resources/response.json")
let event=require("../models/event.model");
let sponsor =require("../models/sponsor")
var crud = {
  googleLoginSignup: async (req, res) => {
    try {
       console.log(req.body)
      let data=req.body;

    let isexit= await userModel.findOne({googleId:data.googleId});
    console.log(isexit,"dhcbshjcbjsbcdbsdjcbj")

    if(!isexit){

      let createData={
        email:data.email,
        name:data.givenName,
        collegeName:"NIT KKR",
        password: "",
        rollNo:""
         
      }


      let newUser=await  userModel.create(createData);
      console.log(newUser,"jhsvdcsdc");
      var token = jwt.sign(
        {
          data: newUser._id,
        },
        "P16s2vsj6BRyFUKomxXG",
        {
          expiresIn: 15552000, // in seconds
        }
      );
      universalFunctions.sendSuccess(
        {
          statusCode: 200,
          message: "User created",
          data: {token},
        },
        res
      );
    }else{
      
      var token = jwt.sign(
        {
          data: isexit._id,
        },
        "P16s2vsj6BRyFUKomxXG",
        {
          expiresIn: 15552000, // in seconds
        }
      );
      console.log(isexit,"heree is user")
      universalFunctions.sendSuccess(
        {
          statusCode: 200,
          message: "login user ",
          data: {token,isexit},
        },
        res
      );
    } 
  }catch (error) {
      universalFunctions.sendError(error, res);
    }
  },
  signinUser : async function (req, res) {
    try {
    const schema = Joi.object().keys({
    email: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
  })

  console.log("payload", req.body)
  await universalFunctions.validateRequestPayload(req.body, res, schema)
  let payload = req.body

  let userInfo = await userModel.findOne({
    email: payload.email
  })
  console.log(userInfo,"user")
  if (!userInfo) {
    return universalFunctions.sendError(
      {
        statusCode: 400,
        message: responseMessages.USER_NOT_FOUND,
      },
      res
    )
  } else {

    if (!userInfo.authenticate(req.body.password)) {
      return universalFunctions.sendSuccess(
        {
          statusCode: 200,
          message: "password not match",
          data: payload,
        },
        res
      )
    }


    var token = jwt.sign(
      {
        data: userInfo._id,
      },
      "P16s2vsj6BRyFUKomxXG",
      {
        expiresIn: 15552000, // in seconds
      }
    );

    let user = {
      token,
      _id: userInfo._id,
      name: userInfo.name,
      email: userInfo.email,
    }

    return universalFunctions.sendSuccess(
      {
        statusCode: 200,
        message: responseMessages.SIGNIN_SUCCESS,
        data: user,
      },
      res
    )
  }
} catch (error) {
  return universalFunctions.sendError(error, res)
}
},
  Signup: async function (req, res) {
    try {
      console.log(req.body);
      const schema = Joi.object().keys({
        email: Joi.string().trim().required(),
        rollNo: Joi.string().trim().required(),
        password:Joi.string().trim().required(),
        collegeName: Joi.string().required(),
        name: Joi.string().required(),
        
      });
      await universalFunctions.validateRequestPayload(req.body, res, schema);

      let body = req.body;
      let isExist = await userModel.findOne({
        email: body.email,
      });
      if (isExist) {
        res.status(401).send({
          faild: true,
          message: "user exist",
        });
       
      } else {
        let userToCreate = {
          email: body.email,
          collegeName:body.collegeName,
          password: body.password,
          name: body.name,
          rollNo:body.rollNo
        }
        let createNew = await userModel.create(userToCreate);
        var token = jwt.sign(
          {
            data: createNew._id,
          },
          "P16s2vsj6BRyFUKomxXG",
          {
            expiresIn: 15552000, // in seconds
          }
        );
        createNew = JSON.parse(JSON.stringify(createNew));
        delete createNew["modified_at"];
        delete createNew["created_at"];
        delete createNew["__v"];
        delete createNew["salt"];
        delete createNew["created_at"];
        delete createNew["isDeleted"];
        delete createNew["password"];
        createNew.token = token;

        (createNew.newUserCreated = true),
          res.status(200).send({
            success: true,
            data: createNew,
          });
      }
    } catch (error) {
      console.log(error, "here is erroe ");
      res.status(400).send({
        success: false,
        message: error,
      });
    }
  },
  getEvent: async function (req, res) {
    try {
      let payload = {};
      let eventName = req.query.text;
      if (eventName) {
        payload.eventName = { $regex: new RegExp(eventName, "i") };
      }
      let events = await event.find(payload).sort({ created_at: -1 });
      events = JSON.parse(JSON.stringify(events));
      res.status(200).send({
        success: true,
        data: events,
      });
    } catch (error) {
      res.status(400).send({
        success: false,
        message: error,
      });
    }
  },

  getSponsor: async function (req, res) {
    try {
      
      let data = await sponsor.find().sort({ created_at: -1 });
      res.status(200).send({
        success: true,
        data: data,
      });
    } catch (error) {
      res.status(400).send({
        success: false,
        message: error,
      });
    }
  },
  addSponsor: async function (req, res) {
    try {
      let payload = req.body;

      console.log("payload:", payload);
   
      let data=await sponsor.create(payload);
      data = JSON.parse(JSON.stringify(data));

      res.status(200).send({
        success: true,
        data: data,
      });
    } catch (error) {
      console.log("erroe:", error);
      res.status(400).send({
        success: false,
        message: error,
      });
    }
  
  },

  addEvent: async function (req, res) {
    try {
      let payload = req.body;

      console.log("payload:", payload);
   
      let data=await event.create(payload);
      data = JSON.parse(JSON.stringify(data));

      res.status(200).send({
        success: true,
        data: data,
      });
    } catch (error) {
      console.log("erroe:", error);
      res.status(400).send({
        success: false,
        message: error,
      });
    }
  
  },
editPost: async function (req, res) {
  try {
    // Get event ID from the request parameters
    let eventId = req.params.id;
    // Get the updated data from the request body
    let updatedData = req.body;

    console.log("Updating event with ID:", eventId);
    console.log("Updated data:", updatedData);

    // Find the event by ID and update it
    let updatedEvent = await event.findByIdAndUpdate(
      { _id: eventId },
      updatedData, // Data to update
      { new: true } // Return the updated document
    );

    // Check if event exists
    if (!updatedEvent) {
      return res.status(404).send({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    console.log("Error updating event:", error);
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
},

  deleteEvent: async function (req, res) {
    try {
    
      let Id = req.params.id;

      let removeJob = await event.remove({ _id: Id});

      res.status(200).send({
        success: true,
        data: removeJob,
      });
    } catch (error) {
      console.log("erroe:", error);
      res.status(400).send({
        success: false,
        message: error,
      });
    }
  },
  getEventById: async function (req, res) {
    try {
    
      let Id = req.params.id;
    console.log(Id)
      let data = await event.findOne({ _id: Id});

      res.status(200).send({
        success: true,
        data: data,
      });
    } catch (error) {
      console.log("erroe:", error);
      res.status(400).send({
        success: false,
        message: error,
      });
    }
  },
  searchEvents: async function (req, res) {
    try {
      let searchText = req.query.text;
      let payload = {};
      console.log("searchText:", searchText);
      if (searchText) {
        payload = {
          $or: [
            { clubName: { $regex: new RegExp(searchText, "i") } },
          ],
        };
      }

      let fetchJobs = await event.find(payload);
      fetchJobs = JSON.parse(JSON.stringify(fetchJobs));

      res.status(200).send({
        success: true,
        data: fetchJobs,
        text: searchText,
      });
    } catch (error) {
      console.log("error:", error);
      res.status(400).send({
        success: false,
        message: error,
      });
    }
  },
};

module.exports = crud;
