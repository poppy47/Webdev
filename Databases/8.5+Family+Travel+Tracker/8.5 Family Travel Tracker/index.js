import express from "express"; 
import bodyParser from "body-parser"; 
import pg from "pg"; 

const app = express(); 
const port = 3000; 

const db = new pg.Client({
  user: "postgres",
  host: "localhost", 
  database: 'World', 
  password: "2004", 
  port: 5432
}); 

db.connect(); 

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static("public")); 

let currentUserId = 1; 
let users = []; // Fixed: Changed 'user' to 'users' to match its usage below

async function checkVisisted() {
  const result = await db.query(
    "select country_code from visited_countries join users on users.id = user_id where user_id = $1", 
    [currentUserId]
  );  

  let countries = []; 
  result.rows.forEach((country) => {
    countries.push(country.country_code); 
  }); 
  return countries; 
}

async function getCurrentUser() {
  const result = await db.query("select * from users"); 
  users = result.rows; 
  return users.find((user) => user.id == currentUserId); 
}

app.get("/", async (req, res) => {
  const countries = await checkVisisted(); 
  const currentUser = await getCurrentUser(); 
  res.render("index.ejs", {
    countries: countries, 
    total: countries.length, // Fixed: Changed .total to .length
    users: users, 
    color: currentUser ? currentUser.color : "red", // Added fallback safety check
  }); 
}); 

app.post("/add", async (req, res) => {
  const input = req.body["country"]; 
  try {
    // Fixed: Changed 'form' to 'from'
    const result = await db.query(
      "select country_code from countries where lower(country_name) like '%' || $1 ||'%';",
      [input.toLowerCase()]
    ); 
    const data = result.rows[0]; 
    const countryCode = data.country_code; 
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)", 
        [countryCode, currentUserId]
      ); 
      res.redirect("/"); 
    } catch (err) {
      console.log(err); 
    }
  } catch (err) {
    console.log(err); 
  }
}); 

app.post("/user", async (req, res) => {
  if (req.body.add === "new") {
    res.render("new.ejs"); 
  } else {
    currentUserId = req.body.user; // Fixed: Changed 'currentUserID' to 'currentUserId'
    res.redirect("/"); 
  }
}); 

app.post("/new", async (req, res) => {
  const name = req.body.name; 
  const color = req.body.color; 

  // Fixed: Changed 'inot' to 'into'
  const result = await db.query(
    "insert into users(name, color) VALUES($1, $2) returning *;", 
    [name, color]
  ); 

  const id = result.rows[0].id; 
  currentUserId = id; 

  res.redirect("/"); 
}); 

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});