"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { stock, customers } = require("./data/promo");
express()
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("tiny"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")
  // endpoints
  .post("/order", (req, res) => {
    let returnCustomer = false;
    customers.forEach((element) => {
      if (
        (req.body.surname == element.surname &&
          req.body.givenName == element.givenName) ||
        req.body.email == element.email ||
        req.body.address == element.address
      ) {
        returnCustomer = true;
      }
    });
    if (req.body.order === "shirt" && req.body.size === "medium") {
      res.json({
        status: "error",
        error: "unavailable",
      });
    } else if (returnCustomer === true) {
      res.json({
        status: "error",
        error: "repeat-customer",
      });
    } else if (req.body.country.toLowerCase() != "canada") {
      res.json({
        status: "error",
        error: "undeliverable",
      });
    } else if (
      (req.body.order === "shirt" && req.body.size === "undefined") ||
      req.body.givenName === "undefined" ||
      req.body.surname === "undefined" ||
      req.body.email === "undefined" ||
      req.body.address === "undefined" ||
      req.body.city === "undefined" ||
      req.body.province === "undefined" ||
      req.body.postcode === "undefined" ||
      req.body.country === "undefined" ||
      req.body.order === "undefined"
    ) {
      res.json({
        status: "error",
        error: "missing-data",
      });
    } else {
      res.json({ status: "success" });
      customers.push(req.body);
    }
  })
  .get("/order-confirmed", (req, res) => {
    res.render("order-confirmed", {
      name:
        customers[customers.length - 1].givenName +
        " " +
        customers[customers.length - 1].surname,
      product: customers[customers.length - 1].order,
      province: customers[customers.length - 1].province,
    });
  })
  .get("*", (req, res) => res.send("Dang. 404."))
  .listen(8000, () => console.log(`Listening on port 8000`));
