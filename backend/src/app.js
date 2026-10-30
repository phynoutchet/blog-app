const express = require("express");
const cors = require("cors");
const prisma = require("./lib/prisma");
const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();

app.use(cors());
app.use(express.json());



app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);



// Handle requests to routes that do not exist
app.use((req, res) => {
  res.status(404).json({
    message: "API endpoint not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Something went wrong on the server",
  });
});


app.listen(3000, () => {
  console.log("API running at http://localhost:3000");
});