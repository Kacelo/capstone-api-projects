import express, { query } from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "vernon",
  host: "localhost",
  database: "countries",
  password: "admin",
  port: 5432,
});

db.connect();

const app = express();
const port = 3000;

async function getCountries() {
  const res = await db.query("SELECT * FROM visited_countries");
  let countriesVisitedresponse = {};

  let countryCodesArray = [];

  countriesVisitedresponse = res.rows;
  console.log(countriesVisitedresponse);
  countriesVisitedresponse.forEach((item) => {
    countryCodesArray.push(item.country_code);
  });

  console.log("ress", res);

  return countryCodesArray;
}

const search = (searchItem) => {
  console.log("at least it ran");

  // Assuming searchItem is a string
  searchItem = JSON.stringify(searchItem);

  // Remove single quotes from searchItem since it's already quoted in the SQL query
  searchItem = searchItem.slice(1, -1);

  // Use parameterized query to prevent SQL injection
  const query = {
    text: "SELECT country_code FROM countries WHERE country_name ILIKE $1",
    values: [`%${searchItem}%`],
  };
  console.log(query);

  db.query(query, (err, res) => {
    if (err) {
      console.error("Error executing query", err.stack);
    } else {
      let countries = res.rows;
      console.log(countries);
      insertData(countries[0].country_code);
    }
  });
};
const insertData = (dataToInsert) => {
  const query = {
    text: "INSERT INTO visited_countries (country_code) VALUES ($1)",
    values: [`${dataToInsert}`],
  };
  console.log(query);
  db.query(query, (err, res) => {
    if (err) {
      console.error("Error executing query", err.stack);
    } else {
      console.log("Data entry success");
    }
  });
};
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
let total = 0;
app.get("/", async (req, res) => {
  //Write your code here.
  const countries = await getCountries();
  // console.log(countries);
  res.render("index.ejs", { countries: countries, total: 1 });
});

app.post("/add", (req, res) => {
  const country_code = req.body.country;
  console.log(country_code);
  search(country_code);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
