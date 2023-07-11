const express = require("express");
const app = express();

app.use(express.static(__dirname + "/static"));
app.use(express.urlencoded({ extended: true }));

app.get("", (req, res) => {
  res.render("index.ejs", { content: "Welcome to the most secure website!", xss: null });
});

app.post("/unprotected", (req, res) => {
  let xss = req.body.no_csp;
  res.render("index.ejs", { xss: xss, content: "" });
});

app.post("/protected", (req, res) => {
  let xss = req.body.with_csp;
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'",
    "script-src 'self'"
  );
  res.render("index.ejs", { xss: xss, content: "" });
});

app.get("/newsite", (req, res) => {
  res.render("index.ejs", { content: "Welcome to the new website!", xss: null });
});

app.all("/redirect", (req, res) => {
  let newurl = req.query.newurl;
  res.redirect(302, newurl);
});

app.post("/home", (req, res) => {
  let userInput = req.body.string;
  res.render("index.ejs", { xss: userInput, content: "" });
});


app.use(function (req, res) {
  res.status(404).render("404.ejs");
});

const port = process.env.PORT || 5000;

app.listen(port, "0.0.0.0", () => console.log(`Listening on port ${port}...!!!`));
