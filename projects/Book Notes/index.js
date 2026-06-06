import bodyParser from "body-parser";
import axios from "axios";
import express from "express";
import path from "path";
import passport from "passport";
import { Strategy} from "passport-local";
import { fileURLToPath } from 'url';
import session from "express-session";
import env from "dotenv";
import pg from "pg";


const app = express()
const port = 3000
env.config(); 

app.use(
    session({
        secret:process.env.SESSION_SECRET, 
        resave:false, 
        saveUninitialized:true,
    })
); 

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

db.connect().then(() => console.log("connected to postgreSQL")).catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// 2. Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(passport.initialize()) 
app.use(passport.session()); 
app.use('/bootstrap-css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/bootstrap-js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

async function getBooks() {
    const result = await db.query("select * from Books");
    let books = []

    result.rows.forEach((book) => {
        books.push(book)
    });
    return books;
}



app.get("/", async (req, res) => {
    const books = await getBooks();
    res.render("index.ejs", {
        Books: books
    });
});

app.get("/admin/add", async (req, res) => {
    if (req.isAuthenticated()){
        res.render("admin/new.ejs");
    }else{
        res.render("login.ejs", {message:"Access Denied"})
    }
});

app.get("/login", async (req, res) => {
    res.render("login.ejs");
});


app.post("/login",passport.authenticate("local", {
    successRedirect:"/admin/books", 
    failureRedirect: "/login",
})
);

app.get("/admin/books", async (req, res) => {
    if (req.isAuthenticated()){
        let books = await getBooks();
        console.log(books);
        res.render("index.ejs", { Books: books, user: { isAdmin: true } });
    }else{
    res.redirect("/login")
    }
});

app.post("/admin/add", async (req, res) => {
    if (req.isAuthenticated()) {
        let title = req.body.name;
        let author = req.body.author;
        let isbn = req.body.isbn;
        let rating = req.body.rating;
        let description = req.body.description;
        let article = req.body.article;
        let read_date = new Date().toISOString().slice(0, 10);
        console.log(rating);
        try {
            let result = await db.query("INSERT INTO books VALUES ($1, $2, $3, $4, $5 , $6) returning rating", [isbn, title, author, description, read_date, rating])
        } catch (err) {
            console.log(err);
        }
        try {
            let result = await db.query("INSERT into article(notes , isbn) VALUES ($1,$2)", [article, isbn]);
        } catch (err) {
            console.log(err);
        }
        res.redirect("/admin/books");
    } else {
        res.render("login.ejs", {message:"Access Denied"});
    }
});


app.post("/admin/delete/:isbn", async (req, res) => {
    if (req.isAuthenticated()){
        const isbn = req.params.isbn;
        try {
            let result = await db.query("delete from books WHERE isbn = $1", [isbn]);
        } catch (err) {
            console.log(err);
        }
        console.log("The book has been deleted successfully");
        res.redirect("/admin/books")
    } else {
        res.render("login.ejs", {message:"Acess Denied"});
    }
});

app.get("/admin/edit/:isbn", async (req, res) => {
    if (req.isAuthenticated()) {
        const isbn = req.params.isbn;
        try {
            const result = await db.query(
                "select b.isbn, b.title, b.author, b.description, b.read_date, b.rating, a.notes from books as b inner join article as a on b.isbn = a.isbn WHERE b.isbn = $1",
                [isbn]
            );
            if (result.rows.length === 0) {
                return res.send("<h1>Book not found</h1>");
            }
            res.render("admin/edit.ejs", {
                Books: result.rows[0]
            });
        } catch (err) {
            console.log(err);
            res.status(500).send("Server error");
        }
    } else {
       res.render("login.ejs", {message:"Acess Denied"});
    }
});

app.post("/admin/edit/:isbn", async (req, res) => {
    if (req.isAuthenticated()) {
        const isbn = req.params.isbn;
        const title = req.body.name;
        const author = req.body.author;
        const rating = req.body.rating;
        const description = req.body.description;
        const article = req.body.article;
        try {
            await db.query(
                "UPDATE books SET title = $1, author = $2, description = $3, read_date = $4, rating = $5 WHERE isbn = $6",
                [title, author, description, new Date().toISOString().slice(0, 10), rating, isbn]
            );
            await db.query(
                "UPDATE article SET notes = $1 WHERE isbn = $2",
                [article, isbn]
            );
            res.redirect("/admin/books");
        } catch (err) {
            console.log(err);
            res.status(500).send("Server error");
        }
    } else {
        res.render("login.ejs", {message:"Acess Denied"});
    }
});

app.get("/admin/logout", (req, res) => {
    req.logout(function(err){
        if(err){
            return next(err);
        }
        res.redirect("/");
    });
});

passport.use(
    "local", 
    new Strategy(async function verify(username, password, cb){
        const user = { username:username, password:password};
        if (username === process.env.ADMIN && password=== process.env.password){
            return cb(null, user);
        }else{
            return cb(null, false);
        }
    })
)

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) =>{
    cb(null, user);
});


app.listen(port, () => {
    console.log(`app is running at http://localhost:3000/`);
}); 