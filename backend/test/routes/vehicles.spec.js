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
const companyId = "5d73e41fef646c40c16180d2"; //choose company_id with companyBases (min 2)

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
  let companyBases;
  const vehicleToCreate = {
    name: `Truck ${uuid()}`,
    combustion: 28,
    capacity: 9000,
    dimensionsOfTheHold: "7.80x2.40x2.40",
    deprecationPerYear: 15,
    valueOfTruck: 60000,
    fuel: "5d72b2ee032f1b682b740c87",
    companyBases: []
  };
  before(() => {
    return new Promise(resolve => {
      Company.distinct("companyBases._id", {
        _id: new Types.ObjectId(companyId)
      }).then(companyBases => {
        companyBases = companyBases;
        vehicleToCreate.companyBases.push(companyBases[0], companyBases[1]);
        resolve();
      });
    });
  });

  it("should return 200", function(done) {
    chai
      .request(server)
      .post(`/api/vehicles/${companyId}`)
      .send(vehicleToCreate)
      .end((err, res) => {
        validResponse(err, res, 200);
        done();
      });
  });

  it("should return 400 on invalid IDs", function(done) {
    chai
      .request(server)
      .post(`/api/vehicles/asd`)
      .send(vehicleToCreate)
      .end((err, res) => {
        validResponse(err, res, 400);
        done();
      });
  });

  it("should return 404 on non existing company", function(done) {
    chai
      .request(server)
      .post(`/api/vehicles/5d72c5df9f533a633ff26385`)
      .send(vehicleToCreate)
      .end((err, res) => {
        validResponse(err, res, 404);
        done();
      });
  });

  it("should return 404 on non existing one of the company base", function(done) {
    chai
      .request(server)
      .post(`/api/vehicles/${companyId}`)
      .send({
        ...vehicleToCreate,
        companyBases: [
          ...vehicleToCreate.companyBases,
          "5d72c7dab17a96f3d59490fd"
        ]
      })
      .end((err, res) => {
        validResponse(err, res, 404);
        done();
      });
  });

  it("should return 400 on foreign company base", function(done) {
    chai
      .request(server)
      .post(`/api/vehicles/${companyId}`)
      .send({
        ...vehicleToCreate,
        companyBases: [
          ...vehicleToCreate.companyBases,
          "5d72cb2ab3b2fa72269df566" //some foreign company base
        ]
      })
      .end((err, res) => {
        validResponse(err, res, 400);
        done();
      });
  });

  it("should return 400 on reach max number of vehicles", function(done) {
    const companyToTest = "5d72cb2ab3b2fa72269df573"; //some company with low number of vehicles

    Company.update(
      {
        _id: new Types.ObjectId(companyToTest)
      },
      {
        "plan.vehicles": 0
      }
    ).then(() => {
      chai
        .request(server)
        .post(`/api/vehicles/${companyToTest}`)
        .send({
          ...vehicleToCreate,
          companyBases: ["5d72cb2ab3b2fa72269df566"]
        })
        .end((err, res) => {
          validResponse(err, res, 400);
          done();
        });
    });
  });
});

describe("overwrite vehicles with company bases", function() {
  const companyId = "5d73e41fef646c40c16180dc"; // company id difference than above
  const companyBases = [
    {
      _id: "5d73e41fef646c40c16180cc", // some company base ID
      vehicles: [
        {
          name: "Truck 1",
          combustion: 28,
          capacity: 9000,
          dimensionsOfTheHold: "7.80x2.40x2.40",
          deprecationPerYear: 15,
          valueOfTruck: 60000,
          fuel: "5d73e4957a1c89d1c50d6fdf"
        },
        {
          name: "Truck 2",
          combustion: 28,
          capacity: 9000,
          dimensionsOfTheHold: "7.80x2.40x2.40",
          deprecationPerYear: 15,
          valueOfTruck: 60000,
          fuel: "5d73e4957a1c89d1c50d6fdf"
        }
      ]
    },
    {
      _id: "5d73e41fef646c40c16180cd", // some company base ID
      vehicles: [
        {
          name: "Truck 1",
          combustion: 28,
          capacity: 9000,
          dimensionsOfTheHold: "7.80x2.40x2.40",
          deprecationPerYear: 15,
          valueOfTruck: 60000,
          fuel: "5d73e4957a1c89d1c50d6fdf"
        },
        {
          name: "Truck 2",
          combustion: 28,
          capacity: 9000,
          dimensionsOfTheHold: "7.80x2.40x2.40",
          deprecationPerYear: 15,
          valueOfTruck: 60000,
          fuel: "5d73e4957a1c89d1c50d6fdf"
        },
        {
          name: "Truck 3",
          combustion: 28,
          capacity: 9000,
          dimensionsOfTheHold: "7.80x2.40x2.40",
          deprecationPerYear: 15,
          valueOfTruck: 60000,
          fuel: "5d73e4957a1c89d1c50d6fdf"
        }
      ]
    }
  ];

  it("should return 200", function(done) {
    chai
      .request(server)
      .post(`/api/vehicles/overwrite/${companyId}`)
      .send({ companyBases })
      .end((err, res) => {
        validResponse(err, res, 200);
        done();
      });
  });

  it("should return 400 on company base length 0 ", function(done) {
    chai
      .request(server)
      .post(`/api/vehicles/overwrite/${companyId}`)
      .send({ companyBases: [] })
      .end((err, res) => {
        validResponse(err, res, 400);
        done();
      });
  });

  it("should return 404 on non existing company", function(done) {
    chai
      .request(server)
      .post(`/api/vehicles/overwrite/5d73e5912ad7f47509d4049a`)
      .send({ companyBases })
      .end((err, res) => {
        validResponse(err, res, 404);
        done();
      });
  });

  it("should return 400 on wrong ID", function(done) {
    chai
      .request(server)
      .post(`/api/vehicles/overwrite/asd`)
      .send({ companyBases })
      .end((err, res) => {
        validResponse(err, res, 400);
        done();
      });
  });

  it("should return 400 on update foreign company base", function(done) {
    chai
      .request(server)
      .post(`/api/vehicles/overwrite/5d73e41fef646c40c16180dc`)
      .send({
        companyBases: [
          ...companyBases,
          { _id: "5d73fd82955107213ce3a8ba", vehicles: [] }
        ]
      })
      .end((err, res) => {
        console.log(res.body, 324);
        validResponse(err, res, 400);
        expect(res.body).to.have.property("msg")
        expect(res.body.msg).to.eql("You are trying to update non existing vehicle")
        done();
      });
  });
});
