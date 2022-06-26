const express = require("express");
const app = express();

const {
  getScoreboard,
  getFlagSubmissionForm,
  submitFlag,
} = require("./controllers");

app.set("view engine", "pug");

app.use(express.static("styles"));
app.use(express.urlencoded({ extended: false }));

app.get("", (req, res) => res.redirect("/scoreboard"));

app.get("/scoreboard", getScoreboard);

app.get("/flag", getFlagSubmissionForm);

app.post("/flag", submitFlag);

const port = Number.parseInt(process.env.PORT ?? "8080");
app.listen(port, () => {
  console.log(`Listening on ${port} ...`);
});
