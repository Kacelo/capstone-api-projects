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
  const res = await db.query("SELECT * FROM countries_visited");
  let countriesVisitedresponse = {};

  let countryCodesArray = [];

  countriesVisitedresponse = res.rows;
  countriesVisitedresponse.forEach((item) => {
    countryCodesArray.push(item.country_code);
  });

  return countryCodesArray;
}

// const search = async (searchItem, response) => {
//   // Assuming searchItem is a string
//   searchItem = JSON.stringify(searchItem);

//   // Remove single quotes from searchItem since it's already quoted in the SQL query
//   searchItem = searchItem.slice(1, -1);

//   // Use parameterized query to prevent SQL injection
//   const query = {
//     text: "SELECT country_code FROM countries WHERE country_name ILIKE $1",
//     values: [`%${searchItem}%`],
//   };

//   await db.query(query, (err, res) => {
//     if (err) {
//       console.error("Error executing query", err.stack);
//     } else {
//       let countries = res.rows;
//       insertData(countries[0].country_code, response);
//     }
//   });
// };
// const insertData = async (dataToInsert, response) => {
//   const query = {
//     text: "INSERT INTO countries_visited (country_code) VALUES ($1)",
//     values: [`${dataToInsert}`],
//   };

//   try {
//     await db.query(query);
//   } catch (error) {
//     console.log("Error occurred", error);
//     const countries = await getCountries();
//     response.render("index.ejs", {
//       countries: countries,
//       total: countries.length,
//       error: error,
//     });
//   }
// };
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", async (req, res) => {
  //Write your code here.
  const countries = await getCountries();
  // console.log(countries);
  res.render("index.ejs", { countries: countries, total: countries.length });
});

app.post("/add", async (req, res) => {
  const country_code = req.body.country;
  // Assuming searchItem is a string
  let searchItem = JSON.stringify(country_code);

  // Remove single quotes from searchItem since it's already quoted in the SQL query
  searchItem = searchItem.slice(1, -1);

  // Use parameterized query to prevent SQL injection

  try {
    const searchQuery = {
      text: "SELECT country_code FROM countries WHERE country_name ILIKE $1",
      values: [`%${searchItem}%`],
    };
    const result = await db.query(searchQuery);
    let countries = result.rows;
    const dataToInsert = countries[0].country_code;
      const insertQuery = {
        text: "INSERT INTO countries_visited (country_code) VALUES ($1)",
        values: [`${dataToInsert}`],
      };
    try {
      await db.query(insertQuery);
      res.redirect("/");
    } catch (err) {
      console.log("Error occurred", err);
      const countries = await getCountries();
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: "This country has already been added",
      });
    }
  } catch (err) {
    const countries = await getCountries();
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      error: "Country not found, try again",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
