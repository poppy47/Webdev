import express from "express"; 

const app = express() ; 
app.get("/", (req, res)=> {
    res.send("<h1>Welcome to the homepage! </h1>"); 
})

app.get("/about", (req, res) => {
    res.send("<h1> about us</h1>"); 
}); 


app.use(( req, res) => {
    res.status(404).send("<h1> Page not found<h1>"); 
}); 

app.listen(5000, ()=> {
    console.log("Server is running at http://localhost:5000"); 
}); 