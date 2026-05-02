import express from "express"; 
import ejs from "ejs"; 
import morgan from "morgan";


const app = express() ;
app.set('view engine', 'ejs');
 

var is_weekend = false;   

function decideday(req, res, next){
    const date = new Date(); 
    console.log(date);
    const day = date.getDay(); 
    console.log(day) ;
    if (day == 6 || day == 0){
        is_weekend = true; 
    }
    next(); 
}

app.use(morgan("common"));
app.use(decideday);


app.get("/" , (req, res) => {
    res.render("index", { weekend : is_weekend}); 
})


app.listen(3000 , () => {
    console.log(`The server is running on port 3000`); 
})