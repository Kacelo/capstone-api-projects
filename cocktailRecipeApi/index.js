import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { apiResponse: "waiting for data" });
});

app.post("/get-cocktail", async (req, res) => {
  const cocktail = req.body.cocktail.toLowerCase();

  //

  try {
    const searchAPI = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktail}`;
    const result = await axios.get(searchAPI);
    const drinks = result.data.drinks;
    res.render("index.ejs", { apiResponse: drinks });
  } catch (error) {
    res.render("index.ejs", { apiResponse: JSON.stringify(error) });
  }
});

app.post("/get-random-cocktail", async (req, res) => {
  try {
    const result = await axios.post(
      "https://www.thecocktaildb.com/api/json/v1/1/random.php"
    );

    const drinks = result.data.drinks;

    res.render("index.ejs", { apiResponse: drinks });
  } catch (error) {
    res.render("index.ejs", { apiResponse: JSON.stringify(error) });
  }
});
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
