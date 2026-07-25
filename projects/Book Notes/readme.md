# 📚 BookNotes

A full-stack personal book tracking web app where I log books I've read along with personal notes, key takeaways, and ratings. Built with Node.js, Express, PostgreSQL, and EJS.

🔗 **Live Demo:** [your-app.onrender.com](https://your-app.onrender.com)

---

## Features

- 📖 Public book library with cover images from Open Library API
- ⭐ Personal rating system (1–10)
- 📝 Detailed notes and takeaways per book
- 🔐 Admin panel with secure login (bcrypt + Passport.js)
- 🛡️ Security headers via Helmet, rate limiting on login
- 🗜️ Gzip compression for fast page loads
- 🔍 SEO optimised — meta tags, Open Graph, sitemap.xml, robots.txt
- 📱 Fully responsive — Bootstrap 5.3

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express 5 |
| Frontend | EJS, Bootstrap 5.3 |
| Database | PostgreSQL (pg Pool) |
| Auth | Passport.js (Local Strategy), bcrypt |
| Session | express-session |
| Security | Helmet, express-rate-limit |
| SEO | sitemap.js, JSON-LD structured data |
| Deployment | Render (backend + DB) |

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL

### Installation

```bash
# Clone the repo
git clone https://github.com/poppy47/BookNotes.git
cd BookNotes

# Install dependencies
npm install
```

### Database Setup

Run the following SQL in your PostgreSQL client:

```sql
CREATE TABLE books (
    isbn        VARCHAR(20) PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    author      VARCHAR(255) NOT NULL,
    description TEXT,
    read_date   DATE,
    rating      INTEGER CHECK (rating >= 1 AND rating <= 10)
);

CREATE TABLE article (
    id    SERIAL PRIMARY KEY,
    notes TEXT,
    isbn  VARCHAR(20) REFERENCES books(isbn) ON DELETE CASCADE
);
```

### Environment Variables

Create a `.env` file in the root directory:

```env
SESSION_SECRET=your_strong_random_secret
ADMIN=your_admin_username
PASSWORD=your_bcrypt_hashed_password
PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=BookNotes
PG_PASSWORD=your_db_password
PG_PORT=5432
```

To generate a strong session secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

To generate a bcrypt password hash:
```bash
node -e "import('bcrypt').then(b => b.default.hash('yourpassword', 10).then(console.log))"
```

### Run Locally

```bash
npm start
```

Visit `http://localhost:3000`

---

## Project Structure

```
BookNotes/
├── index.js                  # Express server, all routes
├── public/
│   ├── robots.txt
│   └── styles/
│       └── main.css
├── views/
│   ├── index.ejs             # Home — book list
│   ├── login.ejs             # Admin login
│   ├── book-detail.ejs       # Single book notes page
│   ├── partials/
│   │   ├── header.ejs        # Shared head + navbar (SEO meta tags)
│   │   └── footer.ejs
│   └── admin/
│       ├── new.ejs           # Add book form
│       └── edit.ejs          # Edit book form
├── .env                      # Local environment variables (not committed)
├── .gitignore
└── package.json
```

---

## Deployment (Render)

1. Create a **PostgreSQL** database on Render and copy the **Internal Database URL**
2. Create a **Web Service** connected to this GitHub repo
3. Set build command: `npm install`
4. Set start command: `node index.js`
5. Add environment variables on Render:

| Key | Value |
|---|---|
| `DATABASE_URL` | Internal DB URL from Render PostgreSQL |
| `NODE_ENV` | `production` |
| `SESSION_SECRET` | Your strong secret |
| `ADMIN` | Your admin username |
| `PASSWORD` | Your bcrypt hash |
| `APP_URL` | `https://your-app.onrender.com` |

---

## Security

- Passwords hashed with **bcrypt** (salt rounds: 10)
- SQL injection prevented via **parameterized queries**
- HTTP security headers via **Helmet** (CSP, HSTS, X-Frame-Options, etc.)
- Login **rate limited** — 10 attempts per 15 minutes
- Sessions use `saveUninitialized: false`
- Credentials stored in `.env`, never committed to Git

---

## License

ISC