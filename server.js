const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// ✅ DB CONNECTION
const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "password",   // 👈 apna MySQL password
    database: "alumnisql"
});

db.connect((err) => {
    if (err) {
        console.log("❌ DB Error:", err.message);
    } else {
        console.log("✅ MySQL Connected");
    }
});

// ✅ TEST ROUTE
app.get("/", (req, res) => {
    res.send("Server Running 🚀");
});

// =======================
// ✅ SIGNUP
// =======================
app.post("/signup", (req, res) => {

    const { name, email, password } = req.body;

    const sql = "INSERT INTO usersx (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, password], (err) => {
        if (err) {
            return res.json({ success: false, message: "User already exists or DB error" });
        }

        res.json({ success: true, message: "Signup Successful" });
    });
});

// =======================
// ✅ LOGIN
// =======================
app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM usersx WHERE email = ?";

    db.query(sql, [email], (err, result) => {

        if (err) {
            return res.json({ success: false, message: "DB Error" });
        }

        if (result.length === 0) {
            return res.json({ success: false, message: "User not found" });
        }

        const user = result[0];

        if (user.password !== password) {
            return res.json({ success: false, message: "Wrong password" });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    });
});

// =======================
// START SERVER
// =======================
app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});