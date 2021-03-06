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
const NON_ADMIN_ID = process.env["NON_ADMIN_ID"];
const ADMIN_USERNAME = process.env["ADMIN_USERNAME"];
const ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"];
const ADMIN_ID = process.env["ADMIN_ID"];

suite("User tests", function () {
  this.timeout(3000);

  const idealUserObject = {
    firstName: "Name",
    lastName: "Surname",
    email: "validaddress@email.test",
    password: "Th1sp4ssword!sV4l!d",
  };

  suite("Creating users", function () {
    suite("Valid submission", function () {
      test("Can add a user with all fields filled out correctly", function (done) {
        assert.fail();
        // chai
        //   .request(app)
        //   .post("/api/users/")
        //   .send(idealUserObject)
        //   .end(function (err, res) {
        //     assert.isNull(err);
        //     assert.strictEqual(res.status, 200);
        //     assert.isObject(res.body);
        //     assert.propertyVal(res.body, "status", "success");
        //     assert.property(res.body, "data");
        //     assert.nestedPropertyVal(res.body, "data", null);
        //     done();
        //   });
      });
    });

    suite("Email tests", function () {
      test("Cannot add a user without an email address", function (done) {
        chai
          .request(app)
          .post("/api/users/")
          .send({ ...idealUserObject, email: undefined })
          .end(function (err, res) {
            assert.isNull(err);
            assert.strictEqual(res.status, 400);
            assert.isObject(res.body);
            assert.propertyVal(res.body, "status", "fail");
            assert.property(res.body, "data");
            assert.nestedPropertyVal(
              res.body,
              "data.email",
              "An email address must be supplied"
            );
            done();
          });
      });

      test("Cannot add a user with an email address that is not a string", function (done) {
        chai
          .request(app)
          .post("/api/users/")
          .send({ ...idealUserObject, email: 5 })
          .end(function (err, res) {
            assert.isNull(err);
            assert.strictEqual(res.status, 400);
            assert.isObject(res.body);
            assert.propertyVal(res.body, "status", "fail");
            assert.property(res.body, "data");
            assert.nestedPropertyVal(
              res.body,
              "data.email",
              "The supplied email address must be a string"
            );
            done();
          });
      });

      test("Cannot add a user with an invalid email address", function (done) {
        chai
          .request(app)
          .post("/api/users/")
          .send({ ...idealUserObject, email: "this is not a valid email" })
          .end(function (err, res) {
            assert.isNull(err);
            assert.strictEqual(res.status, 400);
            assert.isObject(res.body);
            assert.propertyVal(res.body, "status", "fail");
            assert.property(res.body, "data");
            assert.nestedPropertyVal(
              res.body,
              "data.email",
              "The supplied email address must be valid"
            );
            done();
          });
      });

      test("Cannot add a user with an email address that is already registered", function (done) {
        chai
          .request(app)
          .post("/api/users/")
          .send({ ...idealUserObject, email: "test@test.com" })
          .end(function (err, res) {
            assert.isNull(err);
            assert.strictEqual(res.status, 400);
            assert.isObject(res.body);
            assert.propertyVal(res.body, "status", "fail");
            assert.property(res.body, "data");
            assert.nestedPropertyVal(
              res.body,
              "data.email",
              "The supplied email address has already been registered"
            );
            done();
          });
      });
    });

    suite("Password tests", function () {
      test("Cannot add a user without a password", function (done) {
        chai
          .request(app)
          .post("/api/users/")
          .send({ ...idealUserObject, password: undefined })
          .end(function (err, res) {
            assert.isNull(err);
            assert.strictEqual(res.status, 400);
            assert.isObject(res.body);
            assert.propertyVal(res.body, "status", "fail");
            assert.property(res.body, "data");
            assert.nestedPropertyVal(
              res.body,
              "data.password",
              "A password must be supplied"
            );
            done();
          });
      });

      test("Cannot add a user with a password that is not a string", function (done) {
        chai
          .request(app)
          .post("/api/users/")
          .send({ ...idealUserObject, password: 5 })
          .end(function (err, res) {
            assert.isNull(err);
            assert.strictEqual(res.status, 400);
            assert.isObject(res.body);
            assert.propertyVal(res.body, "status", "fail");
            assert.property(res.body, "data");
            assert.nestedPropertyVal(
              res.body,
              "data.password",
              "The supplied password must be a string"
            );
            done();
          });
      });

      test("Cannot add a user with a password that is too short", function (done) {
        chai
          .request(app)
          .post("/api/users/")
          .send({ ...idealUserObject, password: "test" })
          .end(function (err, res) {
            assert.isNull(err);
            assert.strictEqual(res.status, 400);
            assert.isObject(res.body);
            assert.propertyVal(res.body, "status", "fail");
            assert.property(res.body, "data");
            assert.nestedPropertyVal(
              res.body,
              "data.password",
              "The supplied password must be >= 8 characters long"
            );
            done();
          });
      });
    });

    suite("First name tests", function () {
      test("Cannot add a user without a first name", function (done) {
        chai
          .request(app)
          .post("/api/users/")
          .send({ ...idealUserObject, firstName: undefined })
          .end(function (err, res) {
            assert.isNull(err);
            assert.strictEqual(res.status, 400);
            assert.isObject(res.body);
            assert.propertyVal(res.body, "status", "fail");
            assert.property(res.body, "data");
            assert.nestedPropertyVal(
              res.body,
              "data.firstName",
              "A first name must be supplied"
            );
            done();
          });
      });

      test("Cannot add a user with a first name that is not a string", function (done) {
        chai
          .request(app)
          .post("/api/users/")
          .send({ ...idealUserObject, firstName: 5 })
          .end(function (err, res) {
            assert.isNull(err);
            assert.strictEqual(res.status, 400);
            assert.isObject(res.body);
            assert.propertyVal(res.body, "status", "fail");
            assert.property(res.body, "data");
            assert.nestedPropertyVal(
              res.body,
              "data.firstName",
              "The supplied name must be a string"
            );
            done();
          });
      });

      test("Cannot add a user with a first name that contains invalid characters", function (done) {
        chai
          .request(app)
          .post("/api/users/")
          .send({ ...idealUserObject, firstName: "@!*" })
          .end(function (err, res) {
            assert.isNull(err);
            assert.strictEqual(res.status, 400);
            assert.isObject(res.body);
            assert.propertyVal(res.body, "status", "fail");
            assert.property(res.body, "data");
            assert.nestedPropertyVal(
              res.body,
              "data.firstName",
              "The supplied name contains invalid characters"
            );
            done();
          });
      });

      test("Cannot add a user with a first name that is too long", function (done) {
        chai
          .request(app)
          .post("/api/users/")
          .send({
            ...idealUserObject,
            firstName: "this is not a name it is an entire sentence",
          })
          .end(function (err, res) {
            assert.isNull(err);
            assert.strictEqual(res.status, 400);
            assert.isObject(res.body);
            assert.propertyVal(res.body, "status", "fail");
            assert.property(res.body, "data");
            assert.nestedPropertyVal(
              res.body,
              "data.firstName",
              "The supplied name must be <= 20 characters long"
            );
            done();
          });
      });
    });

    suite("Last name tests", function () {
      test("Cannot add a user without a last name", function (done) {
        chai
          .request(app)
          .post("/api/users/")
          .send({ ...idealUserObject, lastName: undefined })
          .end(function (err, res) {
            assert.isNull(err);
            assert.strictEqual(res.status, 400);
            assert.isObject(res.body);
            assert.propertyVal(res.body, "status", "fail");
            assert.property(res.body, "data");
            assert.nestedPropertyVal(
              res.body,
              "data.lastName",
              "A last name must be supplied"
            );
            done();
          });
      });

      test("Cannot add a user with a last name that is not a string", function (done) {
        chai
          .request(app)
          .post("/api/users/")
          .send({ ...idealUserObject, lastName: 5 })
          .end(function (err, res) {
            assert.isNull(err);
            assert.strictEqual(res.status, 400);
            assert.isObject(res.body);
            assert.propertyVal(res.body, "status", "fail");
            assert.property(res.body, "data");
            assert.nestedPropertyVal(
              res.body,
              "data.lastName",
              "The supplied name must be a string"
            );
            done();
          });
      });

      test("Cannot add a user with a last name that contains invalid characters", function (done) {
        chai
          .request(app)
          .post("/api/users/")
          .send({ ...idealUserObject, lastName: "@!*" })
          .end(function (err, res) {
            assert.isNull(err);
            assert.strictEqual(res.status, 400);
            assert.isObject(res.body);
            assert.propertyVal(res.body, "status", "fail");
            assert.property(res.body, "data");
            assert.nestedPropertyVal(
              res.body,
              "data.lastName",
              "The supplied name contains invalid characters"
            );
            done();
          });
      });

      test("Cannot add a user with a last name that is too long", function (done) {
        chai
          .request(app)
          .post("/api/users/")
          .send({
            ...idealUserObject,
            lastName: "this is not a name it is an entire sentence",
          })
          .end(function (err, res) {
            assert.isNull(err);
            assert.strictEqual(res.status, 400);
            assert.isObject(res.body);
            assert.propertyVal(res.body, "status", "fail");
            assert.property(res.body, "data");
            assert.nestedPropertyVal(
              res.body,
              "data.lastName",
              "The supplied name must be <= 20 characters long"
            );
            done();
          });
      });
    });

    suite("Combination tests", function () {
      test("Multiple validation errors are returned", function (done) {
        chai
          .request(app)
          .post("/api/users/")
          .send({})
          .end(function (err, res) {
            assert.isNull(err);
            assert.strictEqual(res.status, 400);
            assert.isObject(res.body);
            assert.propertyVal(res.body, "status", "fail");
            assert.property(res.body, "data");
            assert.nestedPropertyVal(
              res.body,
              "data.firstName",
              "A first name must be supplied"
            );
            assert.nestedPropertyVal(
              res.body,
              "data.lastName",
              "A last name must be supplied"
            );
            assert.nestedPropertyVal(
              res.body,
              "data.email",
              "An email address must be supplied"
            );
            assert.nestedPropertyVal(
              res.body,
              "data.password",
              "A password must be supplied"
            );
            done();
          });
      });
    });
  });

  suite("Reading users", function () {
    suite("Non-admin tests", function () {
      test("Non logged-in users cannot read another user's details", function (done) {
        const id = NON_ADMIN_ID;
        agent.get(`/api/users/${id}`).end(function (err, res) {
          assert.isNull(err);
          assert.strictEqual(res.status, 401);
          assert.isObject(res.body);
          assert.propertyVal(res.body, "status", "fail");
          assert.nestedPropertyVal(
            res.body,
            "data.user",
            "No user is currently logged in"
          );
          done();
        });
      });

      test("Non-admin users can read their own details", function (done) {
        agent
          .post("/api/auth/login")
          .send({
            email: NON_ADMIN_USERNAME,
            password: NON_ADMIN_PASSWORD,
          })
          .end(function (err, res) {
            const id = NON_ADMIN_ID;
            agent.get(`/api/users/${id}`).end(function (err, res) {
              // console.log(res.body);
              assert.isNull(err);
              assert.strictEqual(res.status, 200);
              assert.isObject(res.body);
              assert.propertyVal(res.body, "status", "success");
              assert.property(res.body, "data");
              assert.nestedPropertyVal(
                res.body,
                "data.email",
                NON_ADMIN_USERNAME
              );
              done();
            });
          });
      });

      test("Non-admin users cannot read another user's details", function (done) {
        agent
          .post("/api/auth/login")
          .send({
            email: NON_ADMIN_USERNAME,
            password: NON_ADMIN_PASSWORD,
          })
          .end(function (err, res) {
            const id = ADMIN_ID;
            agent.get(`/api/users/${id}`).end(function (err, res) {
              assert.isNull(err);
              assert.strictEqual(res.status, 403);
              assert.isObject(res.body);
              assert.propertyVal(res.body, "status", "fail");
              assert.nestedPropertyVal(
                res.body,
                "data.user",
                "The current user does not have permission to complete this action"
              );
              done();
            });
          });
      });
    });

    suite("Admin tests", function () {
      test("Admins can read their own details", function (done) {
        agent
          .post("/api/auth/login")
          .send({
            email: ADMIN_USERNAME,
            password: ADMIN_PASSWORD,
          })
          .end(function (err, res) {
            const id = ADMIN_ID;
            agent.get(`/api/users/${id}`).end(function (err, res) {
              assert.isNull(err);
              assert.strictEqual(res.status, 200);
              assert.isObject(res.body);
              assert.propertyVal(res.body, "status", "success");
              assert.property(res.body, "data");
              assert.nestedPropertyVal(res.body, "data.email", ADMIN_USERNAME);
              done();
            });
          });
      });

      test("Admins can read another user's details", function (done) {
        agent
          .post("/api/auth/login")
          .send({
            email: ADMIN_USERNAME,
            password: ADMIN_PASSWORD,
          })
          .end(function (err, res) {
            const id = NON_ADMIN_ID;
            agent.get(`/api/users/${id}`).end(function (err, res) {
              assert.isNull(err);
              assert.strictEqual(res.status, 200);
              assert.isObject(res.body);
              assert.propertyVal(res.body, "status", "success");
              assert.property(res.body, "data");
              assert.nestedPropertyVal(
                res.body,
                "data.email",
                NON_ADMIN_USERNAME
              );
              done();
            });
          });
      });
    });
  });

  suite("Updating users", function () {
    suite("Non-admin tests", function () {
      test("Non-admin users can modify their own details");
      test("Non-admin users cannot modify another user's details");
    });

    suite("Admin tests", function () {
      test("Admins can modify their own details");
      test("Admins can modify another user's details");
    });
  });

  suite("Deleting users", function () {
    suite("Non-admin tests", function () {
      test("Non-admin users can delete their own account");
      test("Non-admin users cannot delete another user's account");
    });

    suite("Admin tests", function () {
      test("Admins can delete their own account");
      test("Admins can delete another user's account");
    });
  });
});
