import "babel-polyfill";
import chai, { assert } from "chai";
import server from "../../src/index";
import chaiHttp from "chai-http";
import Company from "../../src/models/company";
import Country from "../../src/models/country";
import { Types } from "mongoose";
import uuid from "uniqid";

const { expect } = chai;

chai.use(chaiHttp);

function validResponse(err, res, status) {
  expect(err).to.be.null;
  expect(res).to.have.status(status);
  expect(res).to.be.json;
  expect(res.body).to.be.an("object");
}

describe("get company bases by company_id", function() {
  const companyId = "5d6ba1d4b46b9b35d4878643"; //choose company_id with companyBases
  it("should return 200", function(done) {
    chai
      .request(server)
      .get(`/api/company-bases/${companyId}`)
      .end((err, res) => {
        validResponse(err, res, 200);
        expect(res.body.companyBases).to.be.an("array");
        done();
      });
  });

  it("should return 200 with company bases", function(done) {
    chai
      .request(server)
      .get(`/api/company-bases/${companyId}`)
      .end((err, res) => {
        validResponse(err, res, 200);
        expect(res.body.companyBases).to.be.an("array");
        assert(res.body.companyBases.length > 0, "Array is empty !!")
        done();
      });
  });

  it("should return 400 on wrong company id", function(done) {
    chai
      .request(server)
      .get(`/api/company-bases/abc`)
      .end((err, res) => {
        validResponse(err, res, 400);
        done();
      });
  });

  it("should return 404 on non existing company", function(done) {
    chai
      .request(server)
      .get("/api/company-bases/5d6ba203660fda8674725a89")
      .end((err, res) => {
        validResponse(err, res, 404);
        done();
      });
  });
});
