import express from "express";
import bodyParser from "body-parser";

const app = express();
app.set('view engine', 'ejs');
const port = 3000;
var total = 0 ; 

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs"); 
});

app.post("/submit", (req, res) => {
  const firstname = req.body.fName; 
  const lastname = req.body.lName; 
  total = firstname.length + lastname.length; 
  res.render("index", { total : total}); 
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
