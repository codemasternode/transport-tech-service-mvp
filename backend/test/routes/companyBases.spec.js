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

describe("get company bases by company_id", function() {
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
        assert(res.body.companyBases.length > 0, "Array is empty !!");
        done();
      });
  });

  it("should return 400 on wrong company with invalid ObjectId", function(done) {
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

describe("create or update company base", function() {
  it("should return 400 on wrong company with invalid ObjectId", function(done) {
    chai
      .request(server)
      .post(`/api/company-bases/abc`)
      .end((err, res) => {
        validResponse(err, res, 400);
        done();
      });
  });

  it("should return 404 on non existing company", function(done) {
    chai
      .request(server)
      .post("/api/company-bases/5d6ba203660fda8674725a89")
      .end((err, res) => {
        validResponse(err, res, 404);
        done();
      });
  });

  const companyBase = {
    name: "Tech Parking 2222",
    street: "ul.Bieżanowska 258B",
    postalCode: "30-856",
    city: "Cracow",
    location: {
      lng: 50.01744,
      lat: 20.033522
    },
    country: "5d6ba1d3b46b9b35d4878608"
  };

  it("should return 200 on creating new company base", function(done) {
    chai
      .request(server)
      .post(`/api/company-bases/${companyId}`)
      .send({
        ...companyBase
      })
      .end((err, res) => {
        validResponse(err, res, 200);
        done();
      });
  });

  it("should return 200 on creating new company base with vehicles", function(done) {
    const vehiclesNames = [`Truck ${uuid()}`, `Truck ${uuid()}`];
    const companyBaseName = `Company Base ${uuid()}`;
    chai
      .request(server)
      .post(`/api/company-bases/${companyId}`)
      .send({
        ...companyBase,
        name: companyBaseName,
        vehicles: [
          {
            name: vehiclesNames[0],
            combustion: 28,
            capacity: 9000,
            dimensionsOfTheHold: "7.80x2.40x2.40",
            deprecationPerYear: 15,
            valueOfTruck: 60000,
            fuel: "5d6ba1d3b46b9b35d4878635"
          },
          {
            name: vehiclesNames[1],
            combustion: 28,
            capacity: 9000,
            dimensionsOfTheHold: "7.80x2.40x2.40",
            deprecationPerYear: 15,
            valueOfTruck: 60000,
            fuel: "5d6ba1d3b46b9b35d4878635"
          }
        ]
      })
      .end(async (err, res) => {
        validResponse(err, res, 200);

        const companyBase = await CompanyBase.findOne({
          name: companyBaseName
        });
        assert(
          companyBase,
          `You don't insert company base: ${companyBaseName}`
        );

        const vehicles = await Vehicle.find({
          name: {
            $in: vehiclesNames
          }
        });
        assert(vehicles.length === 2, "You don't insert vehicles");

        done();
      });
  });

  it("should return 200 on update existing company base", function(done) {
    const vehiclesNames = [
      `Updated Truck ${uuid()}`,
      `Updated Truck ${uuid()}`
    ];
    const companyBaseName = `Updated Company Base ${uuid()}`;

    const toUpdate = {
      ...companyBase,
      name: companyBaseName,
      vehicles: [
        {
          name: vehiclesNames[0],
          combustion: 28,
          capacity: 9000,
          dimensionsOfTheHold: "7.80x2.40x2.40",
          deprecationPerYear: 15,
          valueOfTruck: 60000,
          fuel: "5d6ba1d3b46b9b35d4878635"
        },
        {
          name: vehiclesNames[1],
          combustion: 28,
          capacity: 9000,
          dimensionsOfTheHold: "7.80x2.40x2.40",
          deprecationPerYear: 15,
          valueOfTruck: 60000,
          fuel: "5d6ba1d3b46b9b35d4878635"
        }
      ]
    };

    Company.findOne({
      _id: new Types.ObjectId(companyId)
    }).then(company => {
      const companyBaseId = company.companyBases[0]._id;
      toUpdate._id = companyBaseId;
      chai
        .request(server)
        .post(`/api/company-bases/${companyId}`)
        .send(toUpdate)
        .end(async (err, res) => {
          validResponse(err, res, 200);

          const company = await Company.findOne({
            _id: new Types.ObjectId(companyId)
          });

          const companyBase = await CompanyBase.findOne({
            name: companyBaseName
          });
          assert(
            companyBase,
            `You don't update company base: ${companyBaseName}`
          );

          const vehicles = await Vehicle.find({
            name: {
              $in: vehiclesNames
            }
          });

          assert(vehicles.length === 2, "You don't insert vehicles");
          assert(
            vehiclesNames.includes(companyBase.vehicles[0].name) &&
              vehiclesNames.includes(companyBase.vehicles[1].name),
            "You don't update company bases vehicles in CompanyBase model"
          );

          done();
        });
    });
  });

  it("should return 400 on update not existing company base", function(done) {
    const vehiclesNames = [
      `Updated Truck ${uuid()}`,
      `Updated Truck ${uuid()}`
    ];
    const companyBaseName = `Updated Company Base ${uuid()}`;

    const toUpdate = {
      ...companyBase,
      name: companyBaseName,
      vehicles: [
        {
          name: vehiclesNames[0],
          combustion: 28,
          capacity: 9000,
          dimensionsOfTheHold: "7.80x2.40x2.40",
          deprecationPerYear: 15,
          valueOfTruck: 60000,
          fuel: "5d6ba1d3b46b9b35d4878635"
        },
        {
          name: vehiclesNames[1],
          combustion: 28,
          capacity: 9000,
          dimensionsOfTheHold: "7.80x2.40x2.40",
          deprecationPerYear: 15,
          valueOfTruck: 60000,
          fuel: "5d6ba1d3b46b9b35d4878635"
        }
      ]
    };

    Company.findOne({
      _id: new Types.ObjectId(companyId)
    }).then(company => {
      const companyBaseId = company.companyBases[0]._id;
      toUpdate._id = "5d6ed7033131281e46d6eb35";
      chai
        .request(server)
        .post(`/api/company-bases/${companyId}`)
        .send(toUpdate)
        .end(async (err, res) => {
          validResponse(err, res, 400);
          done();
        });
    });
  });

  it("should return 400 on update not existing company base with invalid ObjectId", function(done) {
    const vehiclesNames = [
      `Updated Truck ${uuid()}`,
      `Updated Truck ${uuid()}`
    ];
    const companyBaseName = `Updated Company Base ${uuid()}`;

    const toUpdate = {
      ...companyBase,
      name: companyBaseName,
      vehicles: [
        {
          name: vehiclesNames[0],
          combustion: 28,
          capacity: 9000,
          dimensionsOfTheHold: "7.80x2.40x2.40",
          deprecationPerYear: 15,
          valueOfTruck: 60000,
          fuel: "5d6ba1d3b46b9b35d4878635"
        },
        {
          name: vehiclesNames[1],
          combustion: 28,
          capacity: 9000,
          dimensionsOfTheHold: "7.80x2.40x2.40",
          deprecationPerYear: 15,
          valueOfTruck: 60000,
          fuel: "5d6ba1d3b46b9b35d4878635"
        }
      ]
    };

    Company.findOne({
      _id: new Types.ObjectId(companyId)
    }).then(company => {
      const companyBaseId = company.companyBases[0]._id;
      toUpdate._id = "aaaaa";
      chai
        .request(server)
        .post(`/api/company-bases/${companyId}`)
        .send(toUpdate)
        .end(async (err, res) => {
          validResponse(err, res, 400);
          done();
        });
    });
  });

  it("should return 200 on update some fields", function(done) {
    const vehiclesNames = [
      `Updated Truck ${uuid()}`,
      `Updated Truck ${uuid()}`
    ];

    const toUpdate = {
      location: {
        lng: Math.floor(Math.random() * 10 + 1),
        lat: Math.floor(Math.random() * 10 + 1)
      }
    };

    Company.findOne({
      _id: new Types.ObjectId(companyId)
    }).then(company => {
      const companyBaseId = company.companyBases[0]._id;
      toUpdate._id = companyBaseId;
      chai
        .request(server)
        .post(`/api/company-bases/${companyId}`)
        .send(toUpdate)
        .end(async (err, res) => {
          validResponse(err, res, 200);

          const company = await Company.findOne({
            _id: new Types.ObjectId(companyId)
          });

          const companyBase = await CompanyBase.findOne({
            _id: new Types.ObjectId(companyBaseId)
          });

          assert(companyBase, `You don't update company base`);
          expect(companyBase).to.have.property("name")
          assert(
            companyBase.location.lng === toUpdate.location.lng &&
              companyBase.location.lat === toUpdate.location.lat,
            "You don't modify company base in CompanyBase model"
          );

          for (let i = 0; i < company.companyBases.length; i++) {
            if (company.companyBases[i]._id === companyBaseId) {
              assert(
                company.companyBases[i].location.lng ===
                  toUpdate.location.lng &&
                  company.companyBases[i].location.lat ===
                    toUpdate.location.lat,
                "You don't modify company base in Company model"
              );
              expect(companyBase).to.eql(company.companyBases[i])
            }
          }
          done();
        });
    });
  });
});
