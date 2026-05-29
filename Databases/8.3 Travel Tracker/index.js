import express from "express";
import bodyParser from "body-parser";
import pg from "pg"; 

const db = new pg.Client({
  user:"postgres", 
  host:"localhost",
  database:"World", 
  password:"2004", 
  port:5432,
}); 

db.connect(); 

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

/* My version of code  */

app.get("/", async (req, res) => {
  const result = await db.query(
    "select * from visited_countries;");
  let countries = [] 
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  console.log(countries)
  res.render("index.ejs", {countries:countries, total:result.rows.length});
});

app.post("/add", async(req, res) => {
  const country = req.body.country;
  const result = await db.query(
    `select * from countries where country_name like '${country}'`
  );
  if (result.rows.length !== 0){
  const country_code = result.rows[0].country_code;
  await db.query(
    `insert into visited_countries ( country_code ) values ($1)`, [country_code]
  );  
  res.redirect("/");
}else{
  console.error("country does not exist");
}
});


//Angela 's version of code which i just copied for practice -- i leaved the idea 
app.listen(port, ()=> {
  console.log(`Server running on http://localhost:${port}`);
})