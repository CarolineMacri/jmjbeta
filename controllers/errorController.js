const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.message}!`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate index ${JSON.stringify(
    err.keyValue
  )}.  Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorsDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(", ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token.  Please log in again", 401);

const handleJWTExpiredError = () =>
  new AppError("Token expired.  Please log in again", 401);

const sendErrorDev = (err, req, res) => {
  if (isApiError(req)) {
    return getApiErrorDevResponse(err, res);
  }
  return getRenderErrorDevResponse(err, res);
};

const sendErrorProd = (err, req, res) => {
  // API
  if (isApiError(req)) {
    if (err.isOperational) {
      return getApiOperationalErrorProdResponse(err, res);
    }
    console.error("ERROR 🔥", err);
    return getApiSystemErrorProdResponse(err, res);
  }
  // fall through to rendered website
  if (err.isOperational) {
    return getRenderOperationalErrorProdResponse(err, res);
  }

  console.error("ERROR 🔥", err);
  return getRenderSystemErrorProdResponse(err, res);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // internal server error
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.assign({}, err);
    error.message = err.message;

    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === "ValidationError") error = handleValidationErrorsDB(error);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
function isApiError(req) {
  return req.originalUrl.startsWith("/api");
}

function getApiErrorDevResponse(err, res) {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

function getRenderErrorDevResponse(err, res) {
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: err.message,
  });
}

function getApiOperationalErrorProdResponse(err, res) { 
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
}

function getApiSystemErrorProdResponse(err, res) {
  return res.status(500).json({
    status: "error",
    message: err.message,
  });
}

function getRenderOperationalErrorProdResponse(err, res) {
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: err.message,
  });
}

function getRenderSystemErrorProdResponse(err, res) {
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: "Please try again later",
  });
}
