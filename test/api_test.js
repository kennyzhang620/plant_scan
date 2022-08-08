
var chai = require("chai")
var chaiHttp = require("chai-http")
var server = require("../server.js")
var should = chai.should()

chai.use(chaiHttp)

describe('Plant Identification', function(){//tests associated with plant identification function of api
  it('should get a json object containing plant id info on GET request for /plantscanner-api/plantid', function(done){
    chai.request(server).get('/plantscanner-api/plantid').end(function(error,res) {
      res.should.have.status(200);
      res.should.be.json;
      done();
    });
  });

});

describe('Plant Health Assessment', function(){//tests associated with plant health assessment function of api
  it('should get a json object containing plant id info on GET request for /plantscanner-api/plantid', function(done){
    chai.request(server).get('/plantscanner-api/planthealth').end(function(error,res) {
      res.should.have.status(200);
      res.should.be.json;
      done();
    });
  });

});

describe("login test", function () {
    it('should register a user into the database.', function (done) {

    }
});

