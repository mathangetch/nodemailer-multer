//declerations
const express = require("express");
const { path } = require("express/lib/application");
const req = require("express/lib/request");
const res = require("express/lib/response");
const fs = require("fs");
const nodemailer = require("nodemailer");
const multer = require("multer");
const upload = multer({ dest: "images/" });
const port = 4040;

//express initialization
const app = express();

//multer storage 
let Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

let upp = multer({
  storage: Storage,
}).single("img");

// test api
app.get("/test", (req, res) => {
  res.send("testing api");
});

// direct to images folder single upload
app.post("/service/upload", upload.single("img"), function (req, res, next) {
  console.log(req.body, req.file);
  res.send(req.body);
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
});

// nodemailer method
app.post("/sendemail", (req, res) => {
  upp(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.send("something went wrong !!");
    } else {
      let to = req.body.to;
      let subject = req.body.subject;
      let body = req.body.content;
      let path = req.file.path;
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "jvsprem7299@gmail.com",
          pass: "jvs@7299",
        },
      });

      var mailoption = {
        from: "jvsprem7299@gmail.com",
        to: to,
        subject: subject,
        text: body,
        attachments: [
          {
            path: path,
          },
        ],
      };
      transporter.sendMail(mailoption, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log("email sent");
          fs.unlink(path, (err) => {
            if (err) {
              return res.send({ status: false, msg: "Email sending failed" });
            } else {
              console.log("deleted");
              return res.send({
                status: true,
                msg: "Email sent successfully !!",
              });
            }
          });
        }
      });
    }
  });
});


// server assigning to port
app.listen(port, () => {
  console.log("Server is running on 4040");
});
