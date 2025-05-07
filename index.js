const express = require("express");
const bodyParser = require("body-parser");
const analysisRoute = require("./routes/analysisRoutes");
const { default: mongoose } = require("mongoose");
const { Route } = require("express");
const cors = require("cors");
const app = express();

// Enable All CORS Requests for development use
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

mongoose
  .connect(
    "mongodb+srv://yxzavquduxrqpfofws:uoWbBWkZ5JaVhvSG@cluster0.p8tfk2p.mongodb.net/lumensProject",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));


app.use("/analysis", analysisRoute);
app.use("/refresh", analysisRoute);



app.listen(process.env.PORT || 4000, function () {
  console.log("Express app running on port " + (process.env.PORT || 4000));
});