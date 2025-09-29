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
    cookie: { secure: false }, // secure: true only with https
  })
);

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username == 'admin' && password == 'secret') {
    req.session.user = { username };
    return res.status(200).json({ message: "Login successful" });
  }
  return res.status(401).json({ message: "Invalid credentials" });
});

// Profile route (protected)
app.get('/profile', (req, res) => {
  if (req.session.user) {
    return res.status(200).json({ message: `Welcome, admin` });
  }
  return res.status(401).json({ message: 'Unauthorized' });
});

// Logout route
app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    return res.status(200).json({ message: "Logged out successfully" });
  }

  )
});

// Start server only if not in test mode
if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
}

export default app;
