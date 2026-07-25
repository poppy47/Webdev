import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import express from "express";
import path from "path";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import { fileURLToPath } from 'url';
import session from "express-session";
import helmet from "helmet";
import env from "dotenv";
import https from "https"
import { SitemapStream, streamToPromise } from "sitemap";
import compression from "compression";
import pg from "pg";


env.config();
const app = express();
app.set("trust proxy", 1); 
const port = process.env.PORT || 3000;


app.use(
    session({
        secret: process.env.SESSION_SECRET || "fallback-secret-change-this",
        resave: false,
        saveUninitialized: false,
    })
);

// Use DATABASE_URL (Render) if available, else fall back to individual vars (local)
const db = new pg.Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

db.connect().then(() => console.log("connected to postgreSQL")).catch((err) => console.log(err));

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 10,
    message: "Too many login attempts. Try again in 15 minutes.",
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(compression());
app.use(express.static("public"));
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: [
                    "'self'",
                    "data:",
                    "https://covers.openlibrary.org",
                    "https://placehold.co",
                    "https://books.google.com",           // ← add
                    "https://books.googleusercontent.com", // ← add
                ],
                fontSrc: ["'self'"],
                connectSrc: ["'self'"],
            },
        },
    })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/bootstrap-css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/bootstrap-js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

setInterval(()=>{
    https.get(process.env.APP_URL,(res) =>{
        console.log(`self-ping:${res.statusCode}`); 
    }).on("error", (err) =>{
        console.log("self-ping error:", err.message);
    });
}, 10*60*1000) //every 10 minutes

async function getBooks() {
    const result = await db.query("SELECT * FROM books");
    return result.rows;
}

// Sitemap
app.get("/sitemap.xml", async (req, res) => {
    try {
        const books = await db.query("SELECT isbn FROM books");
        const hostname = process.env.APP_URL || "https://your-app.onrender.com";
        const smStream = new SitemapStream({ hostname });

        smStream.write({ url: "/", changefreq: "weekly", priority: 1.0 });
        books.rows.forEach(book => {
            smStream.write({ url: `/books/${book.isbn}`, changefreq: "monthly", priority: 0.8 });
        });

        smStream.end();
        const data = await streamToPromise(smStream);
        res.header("Content-Type", "application/xml");
        res.send(data);
    } catch (err) {
        res.status(500).end();
    }
});

// Home
app.get("/", async (req, res) => {
    const books = await getBooks();
    res.render("index.ejs", {
        Books: books,
        title: "BookNotes — My Personal Reading Archive",
        description: "A curated collection of books I've read, with personal notes, key takeaways, and ratings.",
    });
});

// Book detail
app.get("/books/:isbn", async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const result = await db.query(
            "SELECT b.isbn, b.title, b.author, b.description, b.read_date, b.rating, a.notes FROM books AS b INNER JOIN article AS a ON b.isbn = a.isbn WHERE b.isbn = $1",
            [isbn]
        );
        if (result.rows.length === 0) return res.status(404).send("Book Not Found");

        const book = result.rows[0];
        res.render("book-detail.ejs", {
            book,
            user: req.isAuthenticated() ? { isAdmin: true } : null,
            title: `${book.title} by ${book.author} — BookNotes`,
            description: book.description?.slice(0, 155) || `My notes and review of ${book.title}.`,
            ogImage: `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

// Login
app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.post("/login", loginLimiter, passport.authenticate("local", {
    successRedirect: "/admin/books",
    failureRedirect: "/login",
}));

// Admin — view books
app.get("/admin/books", async (req, res) => {
    if (req.isAuthenticated()) {
        const books = await getBooks();
        res.render("index.ejs", {
            Books: books,
            user: { isAdmin: true },
            title: "Admin — BookNotes",
            description: "Manage your book collection.",
        });
    } else {
        res.render("login.ejs", { message: "Access Denied" });
    }
});

// Admin — add book
app.get("/admin/add", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("admin/new.ejs");
    } else {
        res.render("login.ejs", { message: "Access Denied" });
    }
});

app.post("/admin/add", async (req, res) => {
    if (req.isAuthenticated()) {
        const { name: title, author, isbn, rating, description, article } = req.body;
        const read_date = new Date().toISOString().slice(0, 10);
        try {
            await db.query(
                "INSERT INTO books VALUES ($1, $2, $3, $4, $5, $6)",
                [isbn, title, author, description, read_date, rating]
            );
            await db.query(
                "INSERT INTO article(notes, isbn) VALUES ($1, $2)",
                [article, isbn]
            );
            res.redirect("/admin/books");
        } catch (err) {
            console.log(err);
            res.status(500).send("Server error");
        }
    } else {
        res.render("login.ejs", { message: "Access Denied" });
    }
});

// Admin — delete book
app.post("/admin/delete/:isbn", async (req, res) => {
    if (req.isAuthenticated()) {
        const isbn = req.params.isbn;
        try {
            await db.query("DELETE FROM books WHERE isbn = $1", [isbn]);
            console.log("Book deleted successfully");
            res.redirect("/admin/books");
        } catch (err) {
            console.log(err);
            res.status(500).send("Server error");
        }
    } else {
        res.render("login.ejs", { message: "Access Denied" });
    }
});

// Admin — edit book
app.get("/admin/edit/:isbn", async (req, res) => {
    if (req.isAuthenticated()) {
        const isbn = req.params.isbn;
        try {
            const result = await db.query(
                "SELECT b.isbn, b.title, b.author, b.description, b.read_date, b.rating, a.notes FROM books AS b INNER JOIN article AS a ON b.isbn = a.isbn WHERE b.isbn = $1",
                [isbn]
            );
            if (result.rows.length === 0) return res.status(404).send("<h1>Book not found</h1>");
            res.render("admin/edit.ejs", { Books: result.rows[0] });
        } catch (err) {
            console.log(err);
            res.status(500).send("Server error");
        }
    } else {
        res.render("login.ejs", { message: "Access Denied" });
    }
});

app.post("/admin/edit/:isbn", async (req, res) => {
    if (req.isAuthenticated()) {
        const isbn = req.params.isbn;
        const { name: title, author, rating, description, article } = req.body;
        try {
            await db.query(
                "UPDATE books SET title = $1, author = $2, description = $3, read_date = $4, rating = $5 WHERE isbn = $6",
                [title, author, description, new Date().toISOString().slice(0, 10), rating, isbn]
            );
            await db.query("UPDATE article SET notes = $1 WHERE isbn = $2", [article, isbn]);
            res.redirect("/admin/books");
        } catch (err) {
            console.log(err);
            res.status(500).send("Server error");
        }
    } else {
        res.render("login.ejs", { message: "Access Denied" });
    }
});

// Logout
app.get("/admin/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);
        res.redirect("/");
    });
});

// Passport
passport.use(
    "local",
    new Strategy(async function verify(username, password, cb) {
        
        if (username !== process.env.ADMIN) return cb(null, false);
        const isMatch = await bcrypt.compare(password, process.env.PASSWORD);
        console.log("Password match:", isMatch);
        return isMatch ? cb(null, { username }) : cb(null, false);
    })
);

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}/`);
});
