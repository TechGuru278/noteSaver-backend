let express = require("express");
let mongoose = require("mongoose");
let cors = require("cors");
let app = express();
app.use(express.json());
app.use(cors());

// connection of the mongoose
mongoose
  .connect(
    "mongodb+srv://shreyassk007godecor_db_user:F7rotP762lQpdQEp@cluster0.o1y1p3m.mongodb.net/"
  )
  .then(() => {
    console.log("the mongoose is connected");
  })
  .catch((err) => console.log(err));

// schema for login credenticals
let loginSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
let user = mongoose.model("account", loginSchema);

//create the account
app.post("/singUp", async (req, res) => {
  let singUpData = await user.create(req.body);
  res.json({
    message: "The data is created",
  });
});
app.post("/login", async (req, res) => {
  let { name, email, password } = req.body;
  let userFind = await user.findOne({ email });
  if (userFind && userFind.password == password) {
    res.json({
      message: `Welcome, ${name}`,
      redirect: "/home",
      name: name,
      email: email,
      id: userFind._id,
    });
  } else {
    res.json({
      message: "You are note the user",
    });
  }
});

// schema for the notes section
let notSchema = new mongoose.Schema({
  id: String,
  key: String,
  value: String,
});
let noteModel = mongoose.model("note", notSchema);

// notes getting
app.post("/notesGet", async (req, res) => {
  let notesData = noteModel.create(req.body);
  res.json({
    message: "The note is added",
    data: notesData,
  });
});
// get the note to the front end
app.get("/note/:id", async (req, res) => {
  try {
    let data = await noteModel.find({ id: req.params.id });
    res.send(data);
  } catch {
    (err) => {
      console.log(err);
    };
  }
});

app.put("/update/:id", async (req, res) => {
  let udata = noteModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json({ message: "The data updated" }, udata);
});

app.delete("/delete/:id", async (req, res) => {
  await noteModel.findByIdAndDelete(req.params.id);
  res.json({ mesage: "The note is deleted" });
});
app.get("/", async(req,res)=>{
            let data = await noteModel.find()
            noteModel.send(data)
})

app.listen(3000, () => {
  console.log("The server is started");
});

module.exports = app;

