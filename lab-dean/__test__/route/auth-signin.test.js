'use strict';

const server = require('../../lib/server.js');
const superagent = require('superagent');
const Auth = require('../../model/auth.js');
const faker = require('faker');
require('jest');

describe('GET /api/v1/signup', function () {
  let test = `:${process.env.PORT}/api/v1/signin`;
  let signup = `:${process.env.PORT}/api/v1/signup`;
  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(() => Promise.all([Auth.remove()]));

  describe('Valid Request and Response', () => {
    beforeAll(() => {
      return superagent.post(signup)
        .send(new Auth({
          username: faker.internet.userName(),
          password: faker.internet.password(),
          email: faker.internet.email(),
        }))
        .then(res => this.response = res)
        .then(() => {
          return superagent.get(test)
            .auth(this.response.request._data.username, this.response.request._data.password)
            .then(res => this.test = res);
        });
    });
  });

  it('Should respond with a status code of 200', () => {
    expect(this.test.status).toBe(200);
  });
  it('Should respond with a status of 401 if the user cannot be authenticated', () => {
    return superagent.get(test)
      .auth('tim', 'dog')
      .catch(err => {
        expect(err.status).toBe(401);
      });
  });
});