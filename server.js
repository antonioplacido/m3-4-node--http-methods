"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const { customers } = require("./data/promo");

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
    let returncustomer = false;
    customers.forEach((Element) => {
      if (
        req.body.surname == Element.surname &&
        req.body.givenName == Element.givenName &&
        req.body.email == Element.email &&
        req.body.address == Element.address
      ) {
        returncustomer = true;
      }
    });
    if (req.body.order == "shirt" && req.body.size === "medium") {
      res.json({
        status: "error",
        error: "unavailable",
      });
    } else if (returncustomer === true) {
      res.json({
        status: "error",
        error: "repeat customer",
      });
    } else if (req.body.country.toLowercase() != "canada") {
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
      res,
        json({
          status: "error",
          error: "missing-data",
        });
    } else {
      res.json({
        status: "Success",
      });
      customers.push(req.body);
    }
  })

  .get("/order-confirmed", (req, res) => {
    res.render("order-confirmed", {
      givenName: customers[customers.length - 1].givenName,
      surname: customers[customers.length - 1].surname,
      email: customers[customers.length - 1].email,
      address: customers[customers.length - 1].address,
      city: customers[customers.length - 1].city,
      province: customers[customers.length - 1].province,
      postcode: customers[customers.length - 1].postcode,
    });
  })

  .get("*", (req, res) => res.send("Dang. 404."))
  .listen(8000, () => console.log(`Listening on port 8000`));
