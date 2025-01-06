import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let data;

app.get("/", async (req, res) => {
    try {
        const response = await axios.get("https://bored-api.appbrewery.com/random");
        const result = response.data;
        res.render("index.ejs", { data: result });
    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", {
            error: error.message,
        });
    }
});

app.post("/submit", async (req, res) => {

    try {
        const response = await axios.get(`https://bored-api.appbrewery.com/filter?type=${req.body.type}&participants=${req.body.participants}`);

        const result = response.data;
        if (result.length === 0) {
            res.render("index.ejs", { data: null, error: "No activity matched user criteria" });
        }
        else {
            const randomActivity = result[Math.floor(Math.random() * result.length) + 1];
            res.render("index.ejs", { data: randomActivity });
        }
    }
    catch (error) {
        console.error("Failed to obtain such an activity", error.message);
        res.render("index.ejs", { data: null, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
