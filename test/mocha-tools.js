//MOCHA TESTING
const config = require('../config');

var should = require('should');
var supertest = require('supertest');
var app = supertest.agent("http://localhost:3000");


describe("Test Home Page", function(){
  it("should return home page",function(done){
    // calling home page
    app
    .get("/")
    .expect("Content-type",/text/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      if(err){
        console.log(err);
      }
      else{
        console.log(res);
        res.status.should.equal(200);
      }

      done();
    });
  });
});
