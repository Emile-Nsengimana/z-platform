import chai from 'chai';
import server from '../src/server';
import chaiHttp from 'chai-http';
import fs from 'fs';

chai.use(chaiHttp);
chai.should();
chai.expect();

let token = null;
describe('User authentication tests', () => {
  before('login to obtain a token', (done) => {
    const credentials = {
      email: 'test@example.com',
      password: 'Password12345!',
    };
    chai.request(server)
      .post('/api/v1/auth/signin')
      .send(credentials)
      .end((err, res) => {
        token = res.body.data.token;
        res.status.should.equal(200);
        done();
      });
  });

  it('should not register a user with an existing email address', (done) => {
    chai.request(server)
      .post('/api/v1/auth/signup')
      .set('Content-Type', 'application/json')
      .field('firstName', 'Test')
      .field('lastName', 'User')
      .field('gender', 'Male')
      .field('dob', '2000-01-01')
      .field('age', '22')
      .field('maritalStatus', 'SINGLE')
      .field('email', 'test@example.com')
      .field('password', 'Password12345!')
      .field('confirmPassword', 'Password12345!')
      .field('nationality', 'Rwandan')
      // .attach('profilePicture', fs.readFileSync(`${__dirname}/mock/profile.png`), 'profile.png')
      .end((err, res) => {
        res.status.should.be.eql(409);
        res.body.should.have.property('error');
        res.body.error.should.be.eql('email has been used before');
        done();
      });
  });

  it('should register a user successfully', (done) => {
    chai.request(server)
      .post('/api/v1/auth/signup')
      .set('Content-Type', 'application/json')
      .field('firstName', 'Test')
      .field('lastName', 'User')
      .field('gender', 'Male')
      .field('dob', '2000-01-01')
      .field('age', '22')
      .field('maritalStatus', 'SINGLE')
      .field('email', 'test-two@example.com')
      .field('password', 'Password12345!')
      .field('confirmPassword', 'Password12345!')
      .field('nationality', 'Rwandan')
      .attach('profilePicture', fs.readFileSync(`${__dirname}/mock/profile.png`), 'profile.png')
      .end((err, res) => {
        res.status.should.be.eql(201);
        res.body.should.have.property('message');
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        res.body.data.should.have.property('token');
        res.body.message.should.be.eql("thank you for joining us, please check your email for the next step");
        done();
      });
  });

  it('should not upload ID image with missing ID number', (done) => {
    chai.request(server)
      .put('/api/v1/auth/users')
      .set('Content-Type', 'application/json')
      .attach('additionalDoc', fs.readFileSync(`${__dirname}/mock/profile.png`), 'profile.png')
      .end((err, res) => {
        res.status.should.be.eql(400);
        res.body.should.have.property('error');
        res.body.error.should.be.eql(["identificationNumber is required"]);
        done();
      });
  });

  it('should not upload ID image without a valid token', (done) => {
    chai.request(server)
      .put('/api/v1/auth/users')
      .set('Content-Type', 'application/json')
      .field('identificationNumber', '1234567890123457')
      .attach('additionalDoc', fs.readFileSync(`${__dirname}/mock/profile.png`), 'profile.png')
      .end((err, res) => {
        res.status.should.be.eql(401);
        res.body.should.have.property('RangeError');
        res.body.RangeError.should.be.eql("no token provided");
        done();
      });
  });

  it('should upload ID image successfully', (done) => {
    chai.request(server)
      .put('/api/v1/auth/users')
      .set('Content-Type', 'application/json')
      .set('x-access-token', token)
      .field('identificationNumber', '1234567890123457')
      .attach('additionalDoc', fs.readFileSync(`${__dirname}/mock/profile.png`), 'profile.png')
      .end((err, res) => {
        res.status.should.be.eql(200);
        res.body.should.have.property('message');
        res.body.message.should.be.eql("ID uploaded successfully");
        done();
      });
  });

  it('should not verify unregistered user', (done) => {
    const payload = {
      status: 'VERIFIED',
    };
    chai.request(server)
      .put('/api/v1/auth/verify?email=unregistered.user@example.com')
      .send(payload)
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.should.have.property('error');
        res.body.error.should.be.eql("user not found");
        done();
      });
  });

  it('should verify registered user', (done) => {
    const payload = {
      status: 'VERIFIED',
    };
    chai.request(server)
      .put('/api/v1/auth/verify?email=test@example.com')
      .send(payload)
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.should.have.property('data');
        res.body.should.have.property('message');
        res.body.message.should.be.eql("user verified successfully");
        done();
      });
  });

  it('should not send reset password link to unregistered user', (done) => {
    chai.request(server)
      .put('/api/v1/auth/forgot-password/test-one@example.com')
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.should.have.property('error');
        res.body.error.should.be.eql("user not found");
        done();
      });
  });

  it('should send link to use to reset password', (done) => {
    chai.request(server)
      .put('/api/v1/auth/forgot-password/test@example.com')
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.should.have.property('message');
        res.body.message.should.be.eql("reset password link has been sent to your email");
        done();
      });
  });
});
