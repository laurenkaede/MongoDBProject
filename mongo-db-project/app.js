const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const User_project = require("./models/user_project");
const methodOverride = require("method-override");

const app = express();

dotenv.config({
  path: "./config.env",
});

app.use(express.urlencoded());
app.use(express.json());

app.use(methodOverride("_method"));

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is connected"));

const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));
app.set("view engine", "hbs");

app.get("/", async (req, res) => {
  try {
    const users = await User_project.find();
    res.render("index", {
      data: users,
    });
  } catch (error) {
    status: error.message;
  }
});

app.get("/register", (req, res) => {
  res.render("register.hbs");
});

app.post("/register/user", async (req, res) => {
  console.log(req.body);
  const name = req.body.form_user_name;
  const email = req.body.form_user_email;
  const password = req.body.form_user_password;
  const age = req.body.form_user_age;
  const location = req.body.form_user_location;
  const salary = req.body.form_user_salary;

  try {
    const newUser = await User_project.create({
      name,
      email,
      password,
      age,
      location,
      salary,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      status: error.message,
    });
  }
});

app.put("/editUser/:id", async (req, res) => {
  const userId = req.params.id;
  const user = await User_project.findById(userId);

  res.render("editUser", {
    data: user,
  });
});

app.put("/editUser/:id/success", async (req, res) => {
  const userId = req.params.id;

  const userUpdate = await User_project.findByIdAndUpdate(userId, {
    name: req.body.edit_user_name,
    email: req.body.edit_user_email,
    password: req.body.edit_user_password,
    age: req.body.edit_user_age,
    location: req.body.edit_user_location,
    salary: req.body.edit_user_salary,
  });

  res.status(200).send("<h1>User Updated</h1>");
});

app.delete("/delete/:id", async (req, res) => {
  const userId = req.params.id;
  const userToDelete = await User_project.findByIdAndRemove(userId);

  res.send("<h1>User Deleted</h1>");
});

app.listen(5000, (req, res) => {
  console.log("Server is running on port 5000");
});
