import express from "express"; 
import bodyParser from "body-parser"; 
import morgan from "morgan"; 
import axios from "axios"; 

const app = express();  


const port = 3000; 
 

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended:true} ));
app.use(morgan("common"))

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/IFSC" , async(req,res) =>{
    const IFSCcode = req.body.ifsc;
    try{
        const response = await axios.get(
            `https://ifsc.razorpay.com/${IFSCcode}`
        ); 
        console.log(response.status);
        res.render("index.ejs", {data:response.data , Branch:response.data.BRANCH , Centre:response.data.CENTRE, District:response.data.DISTRICT, State:response.data.STATE,Address:response.data.ADDRESS , Bank:response.data.BANK });
    }catch(error){
        console.log(error)
    }
})

app.listen(port , (req, res) => {
    console.log(`app is running on the port ${port}`); 
})