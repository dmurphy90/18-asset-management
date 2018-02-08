'use strict';

const faker = require('faker');
const mocks = require('../lib/mocks');
const superagent = require('superagent');
const server = require('../../lib/server');
require('jest');

describe('GET api/v1/gallery', function() {
  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mocks.user.removeAll);
  afterAll(mocks.gallery.removeAll);

  beforeAll(() => mocks.user.createOne().then(data => this.mockUser = data));
  beforeAll(() => mocks.gallery.createOne().then(data => this.mockGallery = data));

  describe('Valid request and response', () => {
    it('Should return a single gallery belonging to an ID', () => {
      return superagent.put(`:${process.env.PORT}/api/v1/gallery/${this.mockGallery.gallery._id}`)
        .set('Authorization', `Bearer ${this.mockUser.token}`)
        .send({
          name: faker.lorem.word(),
          description: faker.name.findName(),
        })
        .then(res => {
          expect(res.status).toEqual(204);
        });
    }); 
  });
  

  describe('Invalid request', () => {
    it('Should respond with a status code of 401 when given a bad token', () => {
      return superagent.put(`:${process.env.PORT}/api/v1/gallery/${this.mockGallery.gallery._id}`)
        .set('Authorization', 'Bearer BADTOKEN')
        .catch(err => expect(err.status).toEqual(401));
    });

    it('Should respond with a status code of 400 when given an invalid body', () => {
      return superagent.put(`:${process.env.PORT}/api/v1/gallery/${this.mockGallery.gallery._id}`)
        .set('Authorization', `Bearer ${this.mockUser.token}`)
        .send({
          pepper: faker.lorem.word(),
        })
        .catch(err => expect(err.status).toEqual(400));
    });
    it('Should respond with a status code of 404 when given a bad ID', () => {
      return superagent.put(`:${process.env.PORT}/api/v1/gallery/${this.mockGallery.gallery}`)
        .set('Authorization', `Bearer ${this.mockUser.token}`)
        .send({
          name: faker.lorem.word(),
          description: faker.name.findName(),
        })
        .catch(err => expect(err.status).toEqual(404));
    });

  });
});