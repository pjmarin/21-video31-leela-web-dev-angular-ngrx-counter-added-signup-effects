import "dotenv/config";
import "./database/connectdb.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";

const app = express();

app.use(function (req, res, next) {
  req.headers.origin = req.headers.origin || req.headers.host;
  next();
});

// app.use(cors({ origin:true, credentials:true }));

app.use(
    cors({
        origin: function(origin, callback) {
          const whiteList = process.env.ORIGIN1.split(",");
          whiteList.map(string => string.trim());

          if (whiteList.includes(origin) !== -1) {
              return callback(null, origin); // el primer argumento es el error (si la IP de origen no esta dentro de nuestro array)
          }
          return callback("No autorizado por CORS"); // el primer argumento es el error (si la IP de origen no esta dentro de nuestro array)
        },
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true, limit: '3mb'}))

app.use(function(req, res, next) {
  if(req.originalUrl.includes("api") || req.originalUrl.includes("html")) {
    console.log(`pasamos por aqui - todas las peticiones - ${req.originalUrl} - ${new Date(Date.now()).toISOString()}`);
  }
  
  next();
});

app.use("/api/v1/auth", authRoutes);

app.use(express.static("public/src"));

app.use(function(err, req, res, next) {
  console.error("err.stack", err.stack);
  return res.send(500, { message: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log("😍😍😲 http://localhost:" + PORT));