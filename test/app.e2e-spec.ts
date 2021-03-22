import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

const app = 'http://localhost:3000';

describe('GitHubController', () => {
  it('should return status 200', () => {
    jest.setTimeout(10000);
    return request(app)
      .get('/github/caioragazzi')
      .set('accept', 'application/json')
      .query('totalRepositories=1')
      .expect(HttpStatus.OK);
  });

  it('should return status 406', () => {
    jest.setTimeout(10000);
    return request(app)
      .get('/github/caioragazzi')
      .set('accept', 'application/xml')
      .query('totalRepositories=1')
      .expect(HttpStatus.NOT_ACCEPTABLE);
  });

  it('should return status 404', () => {
    jest.setTimeout(10000);
    return request(app)
      .get('/github/caioragazziiiiiii')
      .set('accept', 'application/json')
      .query('totalRepositories=1')
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should return one record', () => {
    jest.setTimeout(10000);
    return request(app)
      .get('/github/caioragazzi')
      .set('accept', 'application/json')
      .query('totalRepositories=1')
      .expect(({ body }) => {
        expect(body).toHaveLength(1);
      });
  });
});
