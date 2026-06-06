import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user:"postgres", 
  host:'localhost', 
  database:"secrets", 
  password:"2004", 
  port:5432
}); 

db.connect().then(()=> console.log("database connected successfully")).catch((err) => console.log("connection faild")); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username; 
  const password = req.body.password; 
  const checkResult = await db.query("select * from users where email = $1", [email]); 
  if (checkResult.rows.length > 0){
    res.send("Email already exists. Try logging in."); 
  }else{
  try{
    const result = await db.query("INSERT INTO users(email, password) VALUES ($1, $2) returning *", [email, password]);
    console.log(result.rows)
  }catch(err){
    console.log(err); 
  }
  res.render("secrets.ejs"); 
}});

app.post("/login", async (req, res) => {
  const email = req.body.username; 
  const password = req.body.password; 
  try{
      const result = await db.query("select * from users where email = $1", [email]); 
      if(result.rowCount > 0){
        if (result.rows[0].password === password){
          res.render("secrets.ejs"); 
        }else{
          res.send("Access Denied"); 
        }
      }else{
        res.send("You are not registered . Please Register First"); 
      }
  }catch(error){
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
