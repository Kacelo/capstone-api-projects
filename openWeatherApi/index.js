import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_KEY = "66c292d74799d5094a23ace1a374b5e7";
const config = {
  headers: { "Content-Type": "application/json" },
};
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "" });
});

app.post("/get-forecast", async (req, res) => {
  const location = req.body.location;
  console.log(req.body);
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;

  try {
    const result = await axios.post(url);
    console.log(result.data[0]);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
    console.log(result.data.weather[0]);
  } catch (error) {
    res.render("index.ejs", { content: JSON.stringify(error) });
  }
});

app.listen(port, () => {
  console.log(`listening on port: ${port}`);
});
