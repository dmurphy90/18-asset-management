'use strict';

const server = require('../../lib/server');
const superagent = require('superagent');
const Auth = require('../../model/auth');
const faker = require('faker');
require('jest');

describe('POST /api/v1/signup', function() {
  let test = `:${process.env.PORT}/api/v1/signup`;
  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(() => Promise.all([Auth.remove()]));
  

  describe('Valid request and response', () => {
    beforeAll(() => {
      return superagent.post(test)
        .send(new Auth({
          username: faker.name.firstName(),
          password: faker.name.lastName(),
          email: faker.internet.email(),
        }))
        .then(res => this.response = res);
    });
  });

  it('Should respond with a status code of 201', () => {
    expect(this.response.status).toBe(201);
  });
  it('Should return a new object with a username, password, and email property', () => {
    expect(this.response.request._data).toHaveProperty('username');
    expect(this.response.request._data).toHaveProperty('password');
    expect(this.response.request._data).toHaveProperty('email');
  });

  
  describe('Invalid request and response', () => {
    it('should return a status 404 on bad path', () => {
      return superagent.post(':4000/api/v1/doesNotExist')
        .send(new Auth({
          username: faker.name.firstName(),
          password: faker.name.lastName(),
          email: faker.internet.email(),
        }))
        .catch(err => {
          expect(err.status).toBe(404);
        });
    });
    it('Should return a status code of 400 with a bad request body', () => {
      return superagent.post(test)
        .send(new Auth({
          username: '',
          password: faker.name.lastName(),
          email: faker.internet.email(),
        }))
        .catch(err => expect(err.status).toBe(400));
    });
  });
});