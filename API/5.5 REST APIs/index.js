import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { compile } from "ejs";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";

// HINTs: Use the axios documentation as well as the video lesson to help you.
// https://axios-http.com/docs/post_example
// Use the Secrets API documentation to figure out what each route expects and how to work with it.
// https://secrets-api.appbrewery.com/

//TODO 1: Add your own bearer token from the previous lesson.
const yourBearerToken = "7469242e-ec75-4810-af84-3336777a58b9";
const config = {
  headers: { Authorization: `Bearer ${yourBearerToken}` },
};

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "Waiting for data..." });
});

app.post("/get-secret", async (req, res) => {
  const searchId = req.body.id;
  try {
    const result = await axios.get(API_URL + "/secrets/" + searchId, config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.render("index.ejs", { content: JSON.stringify(error.response.data) });
  }
});

app.post("/post-secret", async (req, res) => {
  // TODO 2: Use axios to POST the data from req.body to the secrets api servers.
  const secret = req.body.secret; 
  const score = req.body.score; 
  try{
    const response = await axios.post(
      "https://secrets-api.appbrewery.com/secrets", 
      {
        "secret" : `${secret}`,
        "score" : `${score}` 
      },
      {
        headers:{
          Authorization:`Bearer ${yourBearerToken}`
        }
      }
    );
   res.render("index.ejs", { content:json.stringify(response.data)} );
  } catch (error) {
    console.error("Action Failed",error);
  }finally{
    console.log("Request completed");
  }
});

app.post("/put-secret", async (req, res) => {
  const searchId = req.body.id;
  const secret = req.body.secret;
  const score = req.body.score;
  try{
    const response = await axios.put(
      `https://secrets-api.appbrewery.com/secrets/${searchId}` ,
      {
        'secret': `${secret}` ,
        'score': `${score}`
      },
      {
        headers:{
          Authorization:`Bearer ${yourBearerToken}`
        }
      }
    );
    console.log(response.data);
  }catch(error){
    console.error(error);
  }finally{
    console.log("Request completed");
  }
});

app.post("/patch-secret", async (req, res) => {
  const searchId = req.body.id;

  // TODO 4: Use axios to PATCH the data from req.body to the secrets api servers.
});

app.post("/delete-secret", async (req, res) => {
  const searchId = req.body.id;
  try{
  const response = await axios.delete(
    `https://secrets-api.appbrewery.com/secrets/${searchId}`,
  );
  console.log(response.data); 
}catch (error){
  console.error(error);
}finally{
  console.log("Request completed");
}
  // TODO 5: Use axios to DELETE the item with searchId from the secrets api servers.
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
