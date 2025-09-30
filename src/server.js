import express from "express";
import session from "express-session";

const app = express();
app.use(express.json());

// Setup session middleware
app.use(
  session({
    secret: "mysecretkey", // normally from env
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1*24*60*60*1000 }, // secure: true only with https
  })
);

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "secret") {
    req.session.username = username;
    return res.status(200).json({ message: "Login successful" });
  }
  return res.status(401).json({ message: "Invalid credentials" });
});

// Profile route (protected)
app.get("/profile", (req, res) => {
  const { username } = req.session;

  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.status(200).json({ message: "Welcome, admin", user: { username } });
});

// Logout route
app.post("/logout", (req, res) => {
  const { username } = req.session;

  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    return res.status(200).json({ message: "Logout successful" });
  });
});

// Start server only if not in test mode
if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
}

export default app;
