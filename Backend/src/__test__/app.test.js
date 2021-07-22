// import supertest from 'supertest';
// import app from '../index.js';

// const request = supertest(app);


// describe('GET /', function() {
//   // Using Promise (Testing for the full json returned)
//   it('responds with json object', function(done) {
//     request
//       .get('/')
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(200, {"status":"success", "message":"Welcome to our Book-lending app."}, done);
//   })

//   // Using promise (Testing for a property of returned json)
//   it('responds with json', async () => {
//     const response = await request.get("/");
//     expect('/json/');
//     expect(200);
//     expect(response.body.message).toBe("Welcome to our Book-lending app.");
//   })
// });