import "babel-polyfill";
import chai, { assert } from "chai";
import server from "../../src/index";
import chaiHttp from "chai-http";
import Company from "../../src/models/company";
import Vehicle from "../../src/models/vehicle";
import CompanyBase from "../../src/models/companyBase";
import Country from "../../src/models/country";
import { Types } from "mongoose";
import uuid from "uniqid";
import { isEqual } from "../../src/helpers/object";

const { expect } = chai;

chai.use(chaiHttp);

function validResponse(err, res, status) {
  expect(err).to.be.null;
  expect(res).to.have.status(status);
  expect(res).to.be.json;
  expect(res.body).to.be.an("object");
}
const companyId = "5d6ed24d8c333c46bf516f3f"; //choose company_id with companyBases

describe("get vehicles by company", function() {
  it("should return 200", function(done) {
    chai
      .request(server)
      .get(`/api/vehicles/${companyId}`)
      .end((err, res) => {
        validResponse(err, res, 200);
        expect(res.body.vehicles).to.be.an("array");
        done();
      });
  });

  it("should return 200, but non existing company", function(done) {
    chai
      .request(server)
      .get(`/api/vehicles/5d6ee0432970f4af2739316c`)
      .end((err, res) => {
        validResponse(err, res, 200);
        expect(res.body.vehicles).to.be.an("array");
        done();
      });
  });

  it("should return 400, with invalid ObjectId", function(done) {
    chai
      .request(server)
      .get(`/api/vehicles/asd`)
      .end((err, res) => {
        validResponse(err, res, 400);
        done();
      });
  });
});

describe("get vehicles with company bases", function() {
  it("should return 200", function(done) {
    chai
      .request(server)
      .get(`/api/vehicles/by-company-bases/${companyId}`)
      .end((err, res) => {
        validResponse(err, res, 200);
        expect(res.body.companyBases).to.be.an("array");
        done();
      });
  });

  it("should return 404, on non existing company", function(done) {
    chai
      .request(server)
      .get(`/api/vehicles/by-company-bases/5d6ee2f54c7cc1c50e3e6bec`)
      .end((err, res) => {
        validResponse(err, res, 404);
        done();
      });
  });

  it("should return 400, with invalid ObjectId", function(done) {
    chai
      .request(server)
      .get(`/api/vehicles/by-company-bases/asd`)
      .end((err, res) => {
        validResponse(err, res, 400);
        done();
      });
  });
});

describe("create vehicle", function() {
  it("should return 404, on missing company id and comp", function(done) {
    chai
      .request(server)
      .get(`/api/vehicles/${companyId}/`)
      .end((err, res) => {
        validResponse(err, res, 200);
        expect(res.body.companyBases).to.be.an("array");
        done();
      });
  });
});
