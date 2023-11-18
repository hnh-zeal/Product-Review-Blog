const express = require("express");

const routes = require("./routes");

const morgan = require("morgan"); // Http request logger middleware for node js

const rateLimit = require("express-rate-limit"); // Used to limit repeated requests to public APIs and/or endpoints.

const helmet = require("helmet"); // Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!

const mongosanitize = require("express-mongo-sanitize"); // This module searches for any keys in objects that begin with a $ sign or contain a ., from req.body, req.query or req.params.

const bodyParser = require("body-parser"); // Parses incoming request bodies in a middleware before your handlers, available under the req.body property.

const cors = require("cors"); // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

const cookieParser = require("cookie-parser"); // Parse Cookie header and populate req.cookies with an object keyed by the cookie names.

const session = require("cookie-session"); // Simple cookie-based session middleware.

const dotenv = require("dotenv");
dotenv.config();

// App
const app = express();

// middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(cookieParser());

// Setup express response and body parser configurations
app.use(express.json({ limit: "10kb" })); // Controls the maximum request body size.
app.use(bodyParser.json()); // Returns middleware that only parses json
app.use(
  bodyParser.urlencoded({
    extended: true, // Returns middleware that only parses urlencoded bodies
  })
);

app.use(
  session({
    secret: "keyboard cat",
    proxy: true,
    resave: true,
    saveUnintialized: true,
    cookie: {
      secure: false,
    },
  })
);

app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
};

const limiter = rateLimit({
  max: 3000,
  windowMs: 60 * 60 * 1000, // In one hour
  message: "Too many requests from this IP, Please try again in an hour!",
});

app.use("/product-review-blog", limiter);

app.use(
  express.urlencoded({
    extended: true,
  })
);  // Returns middleware that only parses urlencoded bodies

app.use(mongosanitize());

// Routes
app.use(routes);

app.get("/", (req, res) => {
  res.send("Hello to Product Review Blog API!");
});

module.exports = app;
