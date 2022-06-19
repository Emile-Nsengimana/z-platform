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
        res.body.message.should.be.eql("thank you for joining us, please login and upload ID image for verification");
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
  // it('should not register a user with an existing email address', (done) => {
  //   const user = {
  //     fullName: 'testUser',
  //     password: 'Test@Quickss12345!',
  //     email: 'test@example.com',
  //     confirmPassword: 'Test@Quickss12345!',
  //     phoneNo: '+250782057791',
  //   };
  //   chai
  //     .request(server)
  //     .post('/api/user/auth/signup')
  //     .send(user)
  //     .end((err, res) => {
  //       res.status.should.equal(409);
  //       res.body.error.should.equal('phone number has been used before');
  //       done();
  //     });
  // });
  // it('should not register a user with an existing email ', (done) => {
  //   const user = {
  //     fullName: 'testUser2',
  //     email: 'testuser@test.com',
  //     password: 'Test@Quickss12345!',
  //     confirmPassword: 'Test@Quickss12345!',
  //     phoneNo: '0700000002',
  //   };
  //   chai
  //     .request(server)
  //     .post('/api/user/auth/signup')
  //     .send(user)
  //     .end((err, res) => {
  //       res.status.should.equal(409);
  //       res.body.error.should.equal('email has been used before');
  //       done();
  //     });
  // });

  // it('should not register a user with an invalid phone number ', (done) => {
  //   const user = {
  //     fullName: 'testUser2',
  //     email: 'testuser2@test.com',
  //     password: 'Test@Quickss12345!',
  //     confirmPassword: 'Test@Quickss12345!',
  //     phoneNo: 'invalid phone number',
  //   };
  //   chai
  //     .request(server)
  //     .post('/api/user/auth/signup')
  //     .send(user)
  //     .end((err, res) => {
  //       res.status.should.equal(400);
  //       res.body.error[0].should.equal('invalid phone number');
  //       done();
  //     });
  // });

  // it('should not register a user with an un-confirmend password', (done) => {
  //   const user = {
  //     fullName: 'testUser2',
  //     email: 'testuser2@test.com',
  //     password: 'Test@Quickss12345!',
  //     confirmPassword: '1234512345aA',
  //     phoneNo: '0700000002',
  //   };
  //   chai
  //     .request(server)
  //     .post('/api/user/auth/signup')
  //     .send(user)
  //     .end((err, res) => {
  //       res.status.should.equal(400);
  //       res.body.error[0].should.equal('confirmPassword must be [ref:password]');
  //       done();
  //     });
  // });

  // it('should register a new user', (done) => {
  //   const user = {
  //     fullName: 'testUser2',
  //     email: 'testuser2@test.com',
  //     password: 'Test@Quickss12345!',
  //     confirmPassword: 'Test@Quickss12345!',
  //     phoneNo: '0700000002',
  //   };
  //   chai
  //     .request(server)
  //     .post('/api/user/auth/signup')
  //     .send(user)
  //     .end((err, res) => {
  //       res.status.should.equal(201);
  //       res.body.user.should.have.property('fullName');
  //       res.body.user.should.have.property('phoneNo');
  //       res.body.user.should.have.property('role');
  //       res.body.should.have.property('token');
  //       res.body.message.should.equal('thank you for joining us, Please check your phone for verification');
  //       done();
  //     });
  // });

  // login tests
  // it('should not login without phoneNumber and password', (done) => {
  //   const credentials = {
  //     phoneNo: '',
  //     password: '',
  //   };
  //   chai
  //     .request(server)
  //     .post('/api/user/auth/signin')
  //     .send(credentials)
  //     .end((err, res) => {
  //       res.status.should.equal(400);
  //       res.body.error[0].should.equal('phone number is not allowed to be empty');
  //       res.body.error[1].should.equal('password is not allowed to be empty');
  //       done();
  //     });
  // });

  // it('should not login unregistered user', (done) => {
  //   const credentials = {
  //     phoneNo: '+24500000000',
  //     password: 'Test@Quickss12345!',
  //   };
  //   chai
  //     .request(server)
  //     .post('/api/user/auth/signin')
  //     .send(credentials)
  //     .end((err, res) => {
  //       res.status.should.equal(404);
  //       res.body.error.should.equal(`${credentials.phoneNo} not found`);
  //       done();
  //     });
  // });

  // it('should not login unverified user', (done) => {
  //   const credentials = {
  //     phoneNo: '+250700000001',
  //     password: 'Test@Quickss12345!',
  //   };
  //   chai
  //     .request(server)
  //     .post('/api/user/auth/signin')
  //     .send(credentials)
  //     .end((err, res) => {
  //       res.status.should.equal(401);
  //       res.body.error.should.equal('account not verified, please check your phone message for verification');
  //       done();
  //     });
  // });

  // it('should not login with incorrect password', (done) => {
  //   const credentials = {
  //     phoneNo: '+250782057791',
  //     password: 'wrong_password',
  //   };
  //   chai
  //     .request(server)
  //     .post('/api/user/auth/signin')
  //     .send(credentials)
  //     .end((err, res) => {
  //       res.status.should.equal(401);
  //       res.body.error.should.equal('incorrect password');
  //       done();
  //     });
  // });

  // it('should login successful', (done) => {
  //   const credentials = {
  //     phoneNo: '+250782057791',
  //     password: 'Test@Quickss12345!',
  //   };
  //   chai
  //     .request(server)
  //     .post('/api/user/auth/signin')
  //     .send(credentials)
  //     .end((err, res) => {
  //       res.status.should.equal(200);
  //       res.body.message.should.equal('successfully logged in');
  //       res.body.user.should.have.property('fullName');
  //       res.body.user.should.have.property('phoneNo');
  //       res.body.user.should.have.property('role');
  //       res.body.should.have.property('token');
  //       done();
  //     });
  // });
});

// forgot password tests
// describe('Reset password', () => {
//   it('should not allow empty user account ', (done) => {
//     const userAccount = '';
//     chai
//       .request(server)
//       .post('/api/user/forgot-password')
//       .send(userAccount)
//       .end((err, res) => {
//         res.status.should.equal(400);
//         res.body.error[0].should.equal('userAccount is required');
//         done();
//       });
//   });

//   it('should send verification code to existing email', (done) => {
//     const forgotData = {
//       userAccount: 'testuser@test.com',
//     };
//     chai
//       .request(server)
//       .post('/api/user/forgot-password')
//       .send(forgotData)
//       .end((err, res) => {
//         res.status.should.equal(200);
//         res.body.message.should.equal('please check your email for password reset');
//         done();
//       });
//   });
//   it('should send verification code to existing phone number', (done) => {
//     const forgotData = {
//       userAccount: '+250782057791',
//     };
//     chai
//       .request(server)
//       .post('/api/user/forgot-password')
//       .send(forgotData)
//       .end((err, res) => {
//         res.status.should.equal(200);
//         res.body.message.should.equal(
//           `We\'ve sent verification code to ${forgotData.userAccount}.Enter that code to reset your password`,
//         );
//         done();
//       });
//   });

//   // reset password tests
//   it('should not reset with empty password', (done) => {
//     const payload = {
//       password: ' ',
//       usercode: '22223',
//     };
//     chai
//       .request(server)
//       .post(`/api/user/reset-password/${payload.usercode}`)
//       .send(payload)
//       .end((err, res) => {
//         res.status.should.equal(400);
//         res.body.error[0].should.equal(
//           'password must contain atleast 8 characters(upper/lower case, number & symbol)!',
//         );
//         done();
//       });
//   });


// });
