import express from "express";
import bodyParser from "body-parser";
import pg from "pg" 

const app = express();
const port = 3000;

const db = new pg.Client({
  user:"postgres", 
  host:"localhost", 
  database:"Permalist", 
  password:"2004", 
  port:5432
}); 

db.connect(); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function getItems(){
  const result = await db.query("select * from items"); 
  let items = [];  
  result.rows.forEach((task) => {
    items.push(task);
  }); 
  return items; 
}


app.get("/", async(req, res) => {
  const items = await getItems(); 
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  const result = await db.query("insert into items (title) values ($1) returning *",[item]); 
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const id = req.body.updatedItemId; 
  const title =  req.body.updatedItemTitle; 
  const result = await db.query("update items set title = $1 where id = $2", [title , id]); 
  res.redirect("/"); 
});

app.post("/delete", async(req, res) => {
  const id = req.body.deleteItemId; 
  const result = await db.query("delete from items where id = $1 returning *", [id]); 
  return res.redirect("/"); 
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
