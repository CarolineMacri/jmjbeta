//CORE modules
const path = require("path");

//NPM
const express = require("express");
//--development
const morgan = require("morgan");
//-- express security
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

//-- mongo security
const mongoSanitize = require("express-mongo-sanitize");

//-- helpers
const compression = require("compression");
const pluralize = require("pluralize");
const camelcase = require("camelcase-es5");

// UITLS
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const apiModelRouters = getApiRouters(
  [
    "user",
    "family",
    "child",
    "year",
    "course",
    "teacher",
    "enrollment",
    "class",
    "payment",
  ], 
  "./routes",
  "/api/v1"
);
const viewRouter = require("./routes/viewRoutes");

const app = express();

// view middleware
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
//-------test to use pluralize in the front end pug
app.locals.pluralize = pluralize; 
app.locals.camelcase = camelcase;

// development middleware
if (process.env.NODE_ENV.toLowerCase() === "development") {
  app.use(morgan("dev"));
}

// safety
app.use(helmet());
app.use(
  "/api",
  rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, try again in an hour",
  })
);

//body parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// data sanitization
app.use(mongoSanitize());
app.use(xss());

// prevent parameter pollution - allow duplicates
app.use(hpp({ whitelist: [] }));

// compression
app.use(compression());

// add time to request
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  // testing
  console.log(req.cookies);
  next();
});

// routes
app.use("/", viewRouter);
useApiRoutes(app, apiModelRouters);

app.use("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

// finally handle other errors
app.use(globalErrorHandler);

module.exports = app;

function getApiRouters(modelNames, routesFilePath, apiPath) {
  const apiRouters = modelNames.map((modelName) => {
    const routeModelFile = `${routesFilePath}/${modelName}Routes`;
    return {
      router: require(routeModelFile), // require (./routes/childRoutes)
      path: `${apiPath}/${pluralize(modelName)}`, // api/vi/children
    };
  });
  return apiRouters;
}

function useApiRoutes(app, apiRouters) {
  apiRouters.forEach((apiRouter) => {
    app.use(apiRouter.path, apiRouter.router);
  });
}
