import express from "express";
import morgan from "morgan";  
import { dirname }  from "path"; 
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url)) 
import bodyParser  from "body-parser";

const app = express();
const port = 3000;

app.use(
  bodyParser.urlencoded({extended:true})
); 

app.use(morgan("common")); 

app.post("/submit" ,(req, res) => {
  const bandname = req.body.street + req.body.pet
  res.send(
    `<h1 style = color:blue; >Welcome to the band name generator</h1>
    <h2>Your Band Name is : ${ bandname }</h2>` );
});

app.get("/" ,(req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
