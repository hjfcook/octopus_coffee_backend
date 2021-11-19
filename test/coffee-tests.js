require("dotenv").config();
process.env.NODE_ENV = "test";

const chai = require("chai");
const assert = chai.assert;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const app = require("../app");
const agent = chai.request.agent(app);

const NON_ADMIN_USERNAME = process.env["NON_ADMIN_USERNAME"];
const NON_ADMIN_PASSWORD = process.env["NON_ADMIN_PASSWORD"];
const ADMIN_USERNAME = process.env["ADMIN_USERNAME"];
const ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"];

suite("Coffee tests", function () {
  this.timeout(3000);

  const idealCoffeeObject = {
    name: "Test Coffee",
    continent: "Africa",
    country: "Ethiopia",
    process: "Natural",
    price: 7.5,
    roast: "Light",
    descriptor1: "Black Tea",
    descriptor2: "Lemon",
    descriptor3: "Malted Biscuit",
    description: "Short test description",
  };

  const lowerCaseCoffeeObject = {
    name: "test coffee",
    continent: "Africa",
    country: "Ethiopia",
    process: "Natural",
    price: 7.5,
    roast: "Light",
    descriptor1: "black tea",
    descriptor2: "lemon",
    descriptor3: "malted biscuit",
    description: "Short test description",
  };

  const idealCoffeeResponse = {
    name: "Test Coffee",
    continent: "Africa",
    country: "Ethiopia",
    process: "Natural",
    price: 7.5,
    roast: "Light",
    descriptors: ["Black Tea", "Lemon", "Malted Biscuit"],
    description: "Short test description",
  };

  suite("Ideal submission", function () {
    test("Cannot add a coffee if not logged in", function (done) {
      chai
        .request(app)
        .post("/api/coffee")
        // .type('form')
        .send(idealCoffeeObject)
        .end(function (err, res) {
          assert.isNull(err);
          assert.strictEqual(
            res.status,
            401,
            "Response should be sent with a 401 HTTP status"
          );
          assert.isObject(res.body, "Response body should be an object");
          assert.propertyVal(
            res.body,
            "status",
            "fail",
            'Response body should contain the property "status", which should be equal to "fail"'
          );
          assert.property(
            res.body,
            "data",
            'Response body should contain the property "data"'
          );
          assert.nestedPropertyVal(
            res.body,
            "data.user",
            "No user is currently logged in",
            'Response body should contain the nested property "data.user", which should be equal to "No user is currently logged in"'
          );
          done();
        });
    });

    test("Cannot add a coffee if not admin", function (done) {
      agent
        .post("/api/auth/login")
        .send({
          email: NON_ADMIN_USERNAME,
          password: NON_ADMIN_PASSWORD,
        })
        .end(function (err, res) {
          agent
            .post("/api/coffee")
            // .type('form')
            .send(idealCoffeeObject)
            .end(function (err, res) {
              assert.isNull(err);
              assert.strictEqual(
                res.status,
                403,
                "Response should be sent with a 403 HTTP status"
              );
              assert.isObject(res.body, "Response body should be an object");
              assert.propertyVal(
                res.body,
                "status",
                "fail",
                'Response body should contain the property "status", which should be equal to "fail"'
              );
              assert.property(
                res.body,
                "data",
                'Response body should contain the property "data"'
              );
              assert.nestedPropertyVal(
                res.body,
                "data.user",
                "The current user does not have permission to complete this action",
                'Response body should contain the nested property "data.user", which should be equal to "The current user does not have permission to complete this action"'
              );
              done();
            });
        });
    });

    test("Can add a coffee with all fields filled out correctly", function (done) {
      agent
        .post("/api/auth/login")
        .send({
          email: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
        })
        .end(function (err, res) {
          agent
            .post("/api/coffee")
            // .type('form')
            .send(idealCoffeeObject)
            .end(function (err, res) {
              assert.isNull(err);
              assert.strictEqual(
                res.status,
                200,
                "Response should be sent with a 200 HTTP status"
              );
              assert.isObject(res.body, "Response body should be an object");
              assert.propertyVal(
                res.body,
                "status",
                "success",
                'Response body should contain the property "status", which should be equal to "success"'
              );
              assert.property(
                res.body,
                "data",
                'Response body should contain the property "data"'
              );
              // needs to be deepInclude because of descriptors array
              assert.deepInclude(
                res.body.data,
                idealCoffeeResponse,
                "Returned coffee data should correspond to the sent data"
              );
              agent
                .delete(`/api/coffee/${res.body.data._id}`)
                .end(function (err, res) {
                  done();
                });
            });
        });
    });

    test("Can add a coffee with all fields filled out in lower case", function (done) {
      agent
        .post("/api/auth/login")
        .send({
          email: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
        })
        .end(function (err, res) {
          agent
            .post("/api/coffee")
            // .type('form')
            .send(lowerCaseCoffeeObject)
            .end(function (err, res) {
              assert.isNull(err);
              assert.strictEqual(
                res.status,
                200,
                "Response should be sent with a 200 HTTP status"
              );
              assert.isObject(res.body, "Response body should be an object");
              assert.propertyVal(
                res.body,
                "status",
                "success",
                'Response body should contain the property "status", which should be equal to "success"'
              );
              assert.property(
                res.body,
                "data",
                'Response body should contain the property "data"'
              );
              // needs to be deepInclude because of descriptors array
              assert.deepInclude(
                res.body.data,
                idealCoffeeResponse,
                "Returned coffee data should correspond to the sent data"
              );
              agent
                .delete(`/api/coffee/${res.body.data._id}`)
                .end(function (err, res) {
                  done();
                });
            });
        });
    });
  });

  suite("Name tests", function () {
    test("Cannot add a coffee that is already in the database", function (done) {
      agent
        .post("/api/auth/login")
        .send({
          email: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
        })
        .end(function (err, res) {
          agent
            .post("/api/coffee")
            // .type('form')
            .send({ ...idealCoffeeObject, name: "Bulessa" })
            .end(function (err, res) {
              assert.isNull(err);
              assert.strictEqual(
                res.status,
                400,
                "Response should be sent with a 400 HTTP status"
              );
              assert.isObject(res.body, "Response body should be an object");
              assert.propertyVal(
                res.body,
                "status",
                "fail",
                'Response body should contain the property "status", which should be equal to "fail"'
              );
              assert.property(
                res.body,
                "data",
                'Response body should contain the property "data"'
              );
              assert.nestedPropertyVal(
                res.body,
                "data.name",
                "A coffee with this name already exists",
                'Response body should contain the nested property "data.name", which should be equal to "A coffee with this name already exists"'
              );
              done();
            });
        });
    });

    test("Cannot add a coffee with no name", function (done) {
      agent
        .post("/api/auth/login")
        .send({
          email: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
        })
        .end(function (err, res) {
          agent
            .post("/api/coffee")
            // .type('form')
            .send({ ...idealCoffeeObject, name: undefined })
            .end(function (err, res) {
              assert.isNull(err);
              assert.strictEqual(
                res.status,
                400,
                "Response should be sent with a 400 HTTP status"
              );
              assert.isObject(res.body, "Response body should be an object");
              assert.propertyVal(
                res.body,
                "status",
                "fail",
                'Response body should contain the property "status", which should be equal to "fail"'
              );
              assert.property(
                res.body,
                "data",
                'Response body should contain the property "data"'
              );
              assert.nestedPropertyVal(
                res.body,
                "data.name",
                "A name must be supplied",
                'Response body should contain the nested property "data.name", which should be equal to "A name must be supplied"'
              );
              done();
            });
        });
    });

    test("Cannot add a coffee with a name that's too long", function (done) {
      agent
        .post("/api/auth/login")
        .send({
          email: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
        })
        .end(function (err, res) {
          agent
            .post("/api/coffee")
            // .type('form')
            .send({
              ...idealCoffeeObject,
              name: "this is a test name that is clearly way too long for a coffee",
            })
            .end(function (err, res) {
              assert.isNull(err);
              assert.strictEqual(
                res.status,
                400,
                "Response should be sent with a 400 HTTP status"
              );
              assert.isObject(res.body, "Response body should be an object");
              assert.propertyVal(
                res.body,
                "status",
                "fail",
                'Response body should contain the property "status", which should be equal to "fail"'
              );
              assert.property(
                res.body,
                "data",
                'Response body should contain the property "data"'
              );
              assert.nestedPropertyVal(
                res.body,
                "data.name",
                "The supplied name must be <= 20 characters long",
                'Response body should contain the nested property "data.name", which should be equal to "The supplied name must be < 20 characters long"'
              );
              done();
            });
        });
    });

    test("Cannot add a coffee with a name that is not a string", function (done) {
      agent
        .post("/api/auth/login")
        .send({
          email: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
        })
        .end(function (err, res) {
          agent
            .post("/api/coffee")
            // .type('form')
            .send({ ...idealCoffeeObject, name: 5 })
            .end(function (err, res) {
              assert.isNull(err);
              assert.strictEqual(
                res.status,
                400,
                "Response should be sent with a 400 HTTP status"
              );
              assert.isObject(res.body, "Response body should be an object");
              assert.propertyVal(
                res.body,
                "status",
                "fail",
                'Response body should contain the property "status", which should be equal to "fail"'
              );
              assert.property(
                res.body,
                "data",
                'Response body should contain the property "data"'
              );
              assert.nestedPropertyVal(
                res.body,
                "data.name",
                "The supplied name must be a string",
                'Response body should contain the nested property "data.name", which should be equal to "The supplied name must be a string'
              );
              done();
            });
        });
    });
  });

  suite("Dropdown tests", function () {
    suite("Continent", function () {
      test("Cannot add a coffee with a continent that is not an accepted value", function (done) {
        agent
          .post("/api/auth/login")
          .send({
            email: ADMIN_USERNAME,
            password: ADMIN_PASSWORD,
          })
          .end(function (err, res) {
            agent
              .post("/api/coffee")
              // .type('form')
              .send({ ...idealCoffeeObject, continent: "Europe" })
              .end(function (err, res) {
                assert.isNull(err);
                assert.strictEqual(
                  res.status,
                  400,
                  "Response should be sent with a 400 HTTP status"
                );
                assert.isObject(res.body, "Response body should be an object");
                assert.propertyVal(
                  res.body,
                  "status",
                  "fail",
                  'Response body should contain the property "status", which should be equal to "fail"'
                );
                assert.property(
                  res.body,
                  "data",
                  'Response body should contain the property "data"'
                );
                assert.nestedPropertyVal(
                  res.body,
                  "data.continent",
                  'The continent must be one of "N/A", "Africa", "Americas", or "Asia"',
                  'Response body should contain the nested property "data.continent", which should be equal to "The continent must be one of "N/A", "Africa", "Americas", or "Asia"'
                );
                done();
              });
          });
      });

      test("Cannot add a coffee with no continent", function (done) {
        agent
          .post("/api/auth/login")
          .send({
            email: ADMIN_USERNAME,
            password: ADMIN_PASSWORD,
          })
          .end(function (err, res) {
            agent
              .post("/api/coffee")
              // .type('form')
              .send({ ...idealCoffeeObject, continent: undefined })
              .end(function (err, res) {
                assert.isNull(err);
                assert.strictEqual(
                  res.status,
                  400,
                  "Response should be sent with a 400 HTTP status"
                );
                assert.isObject(res.body, "Response body should be an object");
                assert.propertyVal(
                  res.body,
                  "status",
                  "fail",
                  'Response body should contain the property "status", which should be equal to "fail"'
                );
                assert.property(
                  res.body,
                  "data",
                  'Response body should contain the property "data"'
                );
                assert.nestedPropertyVal(
                  res.body,
                  "data.continent",
                  "A continent must be supplied",
                  'Response body should contain the nested property "data.continent", which should be equal to "A continent must be supplied"'
                );
                done();
              });
          });
      });
    });

    suite("Country", function () {
      test("Cannot add a coffee with a country that is not an accepted value", function (done) {
        agent
          .post("/api/auth/login")
          .send({
            email: ADMIN_USERNAME,
            password: ADMIN_PASSWORD,
          })
          .end(function (err, res) {
            agent
              .post("/api/coffee")
              // .type('form')
              .send({ ...idealCoffeeObject, country: "this is not a country" })
              .end(function (err, res) {
                assert.isNull(err);
                assert.strictEqual(
                  res.status,
                  400,
                  "Response should be sent with a 400 HTTP status"
                );
                assert.isObject(res.body, "Response body should be an object");
                assert.propertyVal(
                  res.body,
                  "status",
                  "fail",
                  'Response body should contain the property "status", which should be equal to "fail"'
                );
                assert.property(
                  res.body,
                  "data",
                  'Response body should contain the property "data"'
                );
                assert.nestedPropertyVal(
                  res.body,
                  "data.country",
                  "The country supplied is not an accepted value",
                  'Response body should contain the nested property "data.country", which should be equal to "The country supplied is not an accepted value"'
                );
                done();
              });
          });
      });

      test("Cannot add a coffee with no country", function (done) {
        agent
          .post("/api/auth/login")
          .send({
            email: ADMIN_USERNAME,
            password: ADMIN_PASSWORD,
          })
          .end(function (err, res) {
            agent
              .post("/api/coffee")
              // .type('form')
              .send({ ...idealCoffeeObject, country: undefined })
              .end(function (err, res) {
                assert.isNull(err);
                assert.strictEqual(
                  res.status,
                  400,
                  "Response should be sent with a 400 HTTP status"
                );
                assert.isObject(res.body, "Response body should be an object");
                assert.propertyVal(
                  res.body,
                  "status",
                  "fail",
                  'Response body should contain the property "status", which should be equal to "fail"'
                );
                assert.property(
                  res.body,
                  "data",
                  'Response body should contain the property "data"'
                );
                assert.nestedPropertyVal(
                  res.body,
                  "data.country",
                  "A country must be supplied",
                  'Response body should contain the nested property "data.country", which should be equal to "A country must be supplied"'
                );
                done();
              });
          });
      });
    });

    suite("Process", function () {
      test("Cannot add a coffee with a process that is not an accepted value", function (done) {
        agent
          .post("/api/auth/login")
          .send({
            email: ADMIN_USERNAME,
            password: ADMIN_PASSWORD,
          })
          .end(function (err, res) {
            agent
              .post("/api/coffee")
              // .type('form')
              .send({ ...idealCoffeeObject, process: "this is not a process" })
              .end(function (err, res) {
                assert.isNull(err);
                assert.strictEqual(
                  res.status,
                  400,
                  "Response should be sent with a 400 HTTP status"
                );
                assert.isObject(res.body, "Response body should be an object");
                assert.propertyVal(
                  res.body,
                  "status",
                  "fail",
                  'Response body should contain the property "status", which should be equal to "fail"'
                );
                assert.property(
                  res.body,
                  "data",
                  'Response body should contain the property "data"'
                );
                assert.nestedPropertyVal(
                  res.body,
                  "data.process",
                  'The process must be one of "N/A", "Honey", "Natural", "Pulped Natural", or "Washed"',
                  'Response body should contain the nested property "data.process", which should be equal to "The process must be one of "N/A", "Honey", "Natural", "Pulped Natural", or "Washed"'
                );
                done();
              });
          });
      });

      test("Cannot add a coffee with no process", function (done) {
        agent
          .post("/api/auth/login")
          .send({
            email: ADMIN_USERNAME,
            password: ADMIN_PASSWORD,
          })
          .end(function (err, res) {
            agent
              .post("/api/coffee")
              // .type('form')
              .send({ ...idealCoffeeObject, process: undefined })
              .end(function (err, res) {
                assert.isNull(err);
                assert.strictEqual(
                  res.status,
                  400,
                  "Response should be sent with a 400 HTTP status"
                );
                assert.isObject(res.body, "Response body should be an object");
                assert.propertyVal(
                  res.body,
                  "status",
                  "fail",
                  'Response body should contain the property "status", which should be equal to "fail"'
                );
                assert.property(
                  res.body,
                  "data",
                  'Response body should contain the property "data"'
                );
                assert.nestedPropertyVal(
                  res.body,
                  "data.process",
                  "A process must be supplied",
                  'Response body should contain the nested property "data.process", which should be equal to "A process must be supplied"'
                );
                done();
              });
          });
      });
    });

    suite("Roast", function () {
      test("Cannot add a coffee with a roast that is not an accepted value", function (done) {
        agent
          .post("/api/auth/login")
          .send({
            email: ADMIN_USERNAME,
            password: ADMIN_PASSWORD,
          })
          .end(function (err, res) {
            agent
              .post("/api/coffee")
              // .type('form')
              .send({ ...idealCoffeeObject, roast: "this is not a roast" })
              .end(function (err, res) {
                assert.isNull(err);
                assert.strictEqual(
                  res.status,
                  400,
                  "Response should be sent with a 400 HTTP status"
                );
                assert.isObject(res.body, "Response body should be an object");
                assert.propertyVal(
                  res.body,
                  "status",
                  "fail",
                  'Response body should contain the property "status", which should be equal to "fail"'
                );
                assert.property(
                  res.body,
                  "data",
                  'Response body should contain the property "data"'
                );
                assert.nestedPropertyVal(
                  res.body,
                  "data.roast",
                  'The roast must be one of "N/A", "Light", "Medium", "Medium-dark", or "Dark"',
                  'Response body should contain the nested property "data.roast", which should be equal to "The roast must be one of "N/A", "Light", "Medium", "Medium-dark", or "Dark"'
                );
                done();
              });
          });
      });

      test("Cannot add a coffee with no roast", function (done) {
        agent
          .post("/api/auth/login")
          .send({
            email: ADMIN_USERNAME,
            password: ADMIN_PASSWORD,
          })
          .end(function (err, res) {
            agent
              .post("/api/coffee")
              // .type('form')
              .send({ ...idealCoffeeObject, roast: undefined })
              .end(function (err, res) {
                assert.isNull(err);
                assert.strictEqual(
                  res.status,
                  400,
                  "Response should be sent with a 400 HTTP status"
                );
                assert.isObject(res.body, "Response body should be an object");
                assert.propertyVal(
                  res.body,
                  "status",
                  "fail",
                  'Response body should contain the property "status", which should be equal to "fail"'
                );
                assert.property(
                  res.body,
                  "data",
                  'Response body should contain the property "data"'
                );
                assert.nestedPropertyVal(
                  res.body,
                  "data.roast",
                  "A roast must be supplied",
                  'Response body should contain the nested property "data.roast", which should be equal to "A roast must be supplied"'
                );
                done();
              });
          });
      });
    });
  });

  suite("Price tests", function () {
    test("Cannot add a coffee with a price that is outside of the range £0 - £30", function (done) {
      agent
        .post("/api/auth/login")
        .send({
          email: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
        })
        .end(function (err, res) {
          agent
            .post("/api/coffee")
            // .type('form')
            .send({ ...idealCoffeeObject, price: 1500 })
            .end(function (err, res) {
              assert.isNull(err);
              assert.strictEqual(
                res.status,
                400,
                "Response should be sent with a 400 HTTP status"
              );
              assert.isObject(res.body, "Response body should be an object");
              assert.propertyVal(
                res.body,
                "status",
                "fail",
                'Response body should contain the property "status", which should be equal to "fail"'
              );
              assert.property(
                res.body,
                "data",
                'Response body should contain the property "data"'
              );
              assert.nestedPropertyVal(
                res.body,
                "data.price",
                "The price must be a number between 0 and 30",
                'Response body should contain the nested property "data.price", which should be equal to "The price must be a number between 0 and 30"'
              );
              done();
            });
        });
    });

    test("Cannot add a coffee with a price with more than 2 decimal places", function (done) {
      agent
        .post("/api/auth/login")
        .send({
          email: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
        })
        .end(function (err, res) {
          agent
            .post("/api/coffee")
            // .type('form')
            .send({ ...idealCoffeeObject, price: 7.546 })
            .end(function (err, res) {
              assert.isNull(err);
              assert.strictEqual(
                res.status,
                400,
                "Response should be sent with a 400 HTTP status"
              );
              assert.isObject(res.body, "Response body should be an object");
              assert.propertyVal(
                res.body,
                "status",
                "fail",
                'Response body should contain the property "status", which should be equal to "fail"'
              );
              assert.property(
                res.body,
                "data",
                'Response body should contain the property "data"'
              );
              assert.nestedPropertyVal(
                res.body,
                "data.price",
                "The price must be a number with 2 decimal places or less",
                'Response body should contain the nested property "data.price", which should be equal to "The price must be a number with 2 decimal places or less"'
              );
              done();
            });
        });
    });

    test("Cannot add a coffee with no price", function (done) {
      agent
        .post("/api/auth/login")
        .send({
          email: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
        })
        .end(function (err, res) {
          agent
            .post("/api/coffee")
            // .type('form')
            .send({ ...idealCoffeeObject, price: undefined })
            .end(function (err, res) {
              assert.isNull(err);
              assert.strictEqual(
                res.status,
                400,
                "Response should be sent with a 400 HTTP status"
              );
              assert.isObject(res.body, "Response body should be an object");
              assert.propertyVal(
                res.body,
                "status",
                "fail",
                'Response body should contain the property "status", which should be equal to "fail"'
              );
              assert.property(
                res.body,
                "data",
                'Response body should contain the property "data"'
              );
              assert.nestedPropertyVal(
                res.body,
                "data.price",
                "A price must be supplied",
                'Response body should contain the nested property "data.price", which should be equal to "A price must be supplied"'
              );
              done();
            });
        });
    });

    test("Cannot add a coffee with a price that is not a number", function (done) {
      agent
        .post("/api/auth/login")
        .send({
          email: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
        })
        .end(function (err, res) {
          agent
            .post("/api/coffee")
            // .type('form')
            .send({ ...idealCoffeeObject, price: "7.5" })
            .end(function (err, res) {
              assert.isNull(err);
              assert.strictEqual(
                res.status,
                400,
                "Response should be sent with a 400 HTTP status"
              );
              assert.isObject(res.body, "Response body should be an object");
              assert.propertyVal(
                res.body,
                "status",
                "fail",
                'Response body should contain the property "status", which should be equal to "fail"'
              );
              assert.property(
                res.body,
                "data",
                'Response body should contain the property "data"'
              );
              assert.nestedPropertyVal(
                res.body,
                "data.price",
                "The supplied price must be a number",
                'Response body should contain the nested property "data.price", which should be equal to "The supplied price must be a number"'
              );
              done();
            });
        });
    });
  });

  suite("Descriptor tests", function () {
    test("Cannot add a coffee with descriptors that are too long", function (done) {
      agent
        .post("/api/auth/login")
        .send({
          email: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
        })
        .end(function (err, res) {
          agent
            .post("/api/coffee")
            // .type('form')
            .send({
              ...idealCoffeeObject,
              descriptor1:
                "this is a test descriptor that is clearly way too long for a coffee",
            })
            .end(function (err, res) {
              assert.isNull(err);
              assert.strictEqual(
                res.status,
                400,
                "Response should be sent with a 400 HTTP status"
              );
              assert.isObject(res.body, "Response body should be an object");
              assert.propertyVal(
                res.body,
                "status",
                "fail",
                'Response body should contain the property "status", which should be equal to "fail"'
              );
              assert.property(
                res.body,
                "data",
                'Response body should contain the property "data"'
              );
              assert.nestedPropertyVal(
                res.body,
                "data.descriptor1",
                "The supplied descriptor must be <= 15 characters long",
                'Response body should contain the nested property "data.descriptor1", which should be equal to "The supplied descriptor must be <= 15 characters long"'
              );
              done();
            });
        });
    });

    test("Cannot add a coffee with descriptors that contain invalid characters", function (done) {
      agent
        .post("/api/auth/login")
        .send({
          email: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
        })
        .end(function (err, res) {
          agent
            .post("/api/coffee")
            // .type('form')
            .send({ ...idealCoffeeObject, descriptor1: "£$@%&#*" })
            .end(function (err, res) {
              assert.isNull(err);
              assert.strictEqual(
                res.status,
                400,
                "Response should be sent with a 400 HTTP status"
              );
              assert.isObject(res.body, "Response body should be an object");
              assert.propertyVal(
                res.body,
                "status",
                "fail",
                'Response body should contain the property "status", which should be equal to "fail"'
              );
              assert.property(
                res.body,
                "data",
                'Response body should contain the property "data"'
              );
              assert.nestedPropertyVal(
                res.body,
                "data.descriptor1",
                "The supplied descriptor contains invalid characters",
                'Response body should contain the nested property "data.descriptor1", which should be equal to "The supplied descriptor contains invalid characters"'
              );
              done();
            });
        });
    });

    test("Cannot add a coffee with a descriptor that is not a string", function (done) {
      agent
        .post("/api/auth/login")
        .send({
          email: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
        })
        .end(function (err, res) {
          agent
            .post("/api/coffee")
            // .type('form')
            .send({ ...idealCoffeeObject, descriptor1: 5 })
            .end(function (err, res) {
              assert.isNull(err);
              assert.strictEqual(
                res.status,
                400,
                "Response should be sent with a 400 HTTP status"
              );
              assert.isObject(res.body, "Response body should be an object");
              assert.propertyVal(
                res.body,
                "status",
                "fail",
                'Response body should contain the property "status", which should be equal to "fail"'
              );
              assert.property(
                res.body,
                "data",
                'Response body should contain the property "data"'
              );
              assert.nestedPropertyVal(
                res.body,
                "data.descriptor1",
                "The supplied descriptor must be a string",
                'Response body should contain the nested property "data.descriptor1", which should be equal to "The supplied descriptor must be a string'
              );
              done();
            });
        });
    });

    test("Cannot add a coffee with missing descriptors", function (done) {
      agent
        .post("/api/auth/login")
        .send({
          email: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
        })
        .end(function (err, res) {
          agent
            .post("/api/coffee")
            // .type('form')
            .send({ ...idealCoffeeObject, descriptor1: undefined })
            .end(function (err, res) {
              assert.isNull(err);
              assert.strictEqual(
                res.status,
                400,
                "Response should be sent with a 400 HTTP status"
              );
              assert.isObject(res.body, "Response body should be an object");
              assert.propertyVal(
                res.body,
                "status",
                "fail",
                'Response body should contain the property "status", which should be equal to "fail"'
              );
              assert.property(
                res.body,
                "data",
                'Response body should contain the property "data"'
              );
              assert.nestedPropertyVal(
                res.body,
                "data.descriptor1",
                "3 descriptors must be supplied",
                'Response body should contain the nested property "data.desciptor1", which should be equal to "3 descriptors be supplied"'
              );
              done();
            });
        });
    });
  });

  suite("Description tests", function () {
    test("Cannot add a coffee with a description that is not a string", function (done) {
      agent
        .post("/api/auth/login")
        .send({
          email: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
        })
        .end(function (err, res) {
          agent
            .post("/api/coffee")
            // .type('form')
            .send({ ...idealCoffeeObject, description: 5 })
            .end(function (err, res) {
              assert.isNull(err);
              assert.strictEqual(
                res.status,
                400,
                "Response should be sent with a 400 HTTP status"
              );
              assert.isObject(res.body, "Response body should be an object");
              assert.propertyVal(
                res.body,
                "status",
                "fail",
                'Response body should contain the property "status", which should be equal to "fail"'
              );
              assert.property(
                res.body,
                "data",
                'Response body should contain the property "data"'
              );
              assert.nestedPropertyVal(
                res.body,
                "data.description",
                "The supplied description must be a string",
                'Response body should contain the nested property "data.description", which should be equal to "The supplied description must be a string'
              );
              done();
            });
        });
    });

    test("Cannot add a coffee with no description", function (done) {
      agent
        .post("/api/auth/login")
        .send({
          email: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
        })
        .end(function (err, res) {
          agent
            .post("/api/coffee")
            // .type('form')
            .send({ ...idealCoffeeObject, description: undefined })
            .end(function (err, res) {
              assert.isNull(err);
              assert.strictEqual(
                res.status,
                400,
                "Response should be sent with a 400 HTTP status"
              );
              assert.isObject(res.body, "Response body should be an object");
              assert.propertyVal(
                res.body,
                "status",
                "fail",
                'Response body should contain the property "status", which should be equal to "fail"'
              );
              assert.property(
                res.body,
                "data",
                'Response body should contain the property "data"'
              );
              assert.nestedPropertyVal(
                res.body,
                "data.description",
                "A description must be supplied",
                'Response body should contain the nested property "data.description", which should be equal to "A description must be supplied"'
              );
              done();
            });
        });
    });
  });

  suite("Combination test", function () {
    test("Multiple validation errors are returned", function (done) {
      agent
        .post("/api/auth/login")
        .send({
          email: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
        })
        .end(function (err, res) {
          agent
            .post("/api/coffee")
            // .type('form')
            .send({})
            .end(function (err, res) {
              assert.isNull(err);
              assert.strictEqual(
                res.status,
                400,
                "Response should be sent with a 400 HTTP status"
              );
              assert.isObject(res.body, "Response body should be an object");
              assert.propertyVal(
                res.body,
                "status",
                "fail",
                'Response body should contain the property "status", which should be equal to "fail"'
              );
              assert.property(
                res.body,
                "data",
                'Response body should contain the property "data"'
              );
              assert.nestedPropertyVal(
                res.body,
                "data.name",
                "A name must be supplied",
                'Response body should contain the nested property "data.name", which should be equal to "A name must be supplied"'
              );
              assert.nestedPropertyVal(
                res.body,
                "data.continent",
                "A continent must be supplied",
                'Response body should contain the nested property "data.continent", which should be equal to "A continent must be supplied"'
              );
              assert.nestedPropertyVal(
                res.body,
                "data.country",
                "A country must be supplied",
                'Response body should contain the nested property "data.country", which should be equal to "A country must be supplied"'
              );
              assert.nestedPropertyVal(
                res.body,
                "data.process",
                "A process must be supplied",
                'Response body should contain the nested property "data.process", which should be equal to "A process must be supplied"'
              );
              assert.nestedPropertyVal(
                res.body,
                "data.roast",
                "A roast must be supplied",
                'Response body should contain the nested property "data.roast", which should be equal to "A roast must be supplied"'
              );
              assert.nestedPropertyVal(
                res.body,
                "data.price",
                "A price must be supplied",
                'Response body should contain the nested property "data.price", which should be equal to "A price must be supplied"'
              );
              assert.nestedPropertyVal(
                res.body,
                "data.descriptor1",
                "3 descriptors must be supplied",
                'Response body should contain the nested property "data.desciptor1", which should be equal to "3 descriptors be supplied"'
              );
              assert.nestedPropertyVal(
                res.body,
                "data.descriptor2",
                "3 descriptors must be supplied",
                'Response body should contain the nested property "data.desciptor1", which should be equal to "3 descriptors be supplied"'
              );
              assert.nestedPropertyVal(
                res.body,
                "data.descriptor3",
                "3 descriptors must be supplied",
                'Response body should contain the nested property "data.desciptor1", which should be equal to "3 descriptors be supplied"'
              );
              assert.nestedPropertyVal(
                res.body,
                "data.description",
                "A description must be supplied",
                'Response body should contain the nested property "data.description", which should be equal to "A description must be supplied"'
              );
              done();
            });
        });
    });
  });
});
