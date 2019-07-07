import GitHubProfile from '../../src/services/GitHubProfile';
import getWeatherConditions from '../../src/services/weather';
import {getData} from '../../src/public/handler';
import BasicError from '../../src/utils/error/BasicError'

jest.mock('../../src/services/GitHubProfile');
jest.mock('../../src/services/weather');

test('getData(event): it should retrieve error status code & message', async () => {
  GitHubProfile.findUser.mockImplementation(() => {
    return {
      login: 'testSubject',
      repos_url: 'https://fakeapi.com/users/testSubject/repos',
      location: 'Test Location',
      getReposCreationDates: () => {throw new BasicError(400, 'testMessage')}
    }
  });
  getWeatherConditions.mockImplementation(() => {
    return 'data'
  });

  const result = await getData({queryStringParameters: {user: 'testSubject'}});

  expect(result.statusCode).toBe(400);
  expect(result.body).toBe('{"message":"testMessage"}');
});

test('getData(event): it should retrieve error status code & message', async () => {
  GitHubProfile.findUser.mockImplementation(() => {
    return {
      login: 'testSubject',
      repos_url: 'https://fakeapi.com/users/testSubject/repos',
      location: 'Test Location',
      getReposCreationDates: () => {throw new Error()}
    }
  });
  getWeatherConditions.mockImplementation(() => {
    return 'data'
  });

  const result = await getData({queryStringParameters: {user: 'testSubject'}});

  expect(result.statusCode).toBe(500);
  expect(result.body).toBe('{"message":"internal server error"}');
});

test('getData(event): it should retrieve the amount of repos and the avg temperature', async () => {
  GitHubProfile.findUser.mockImplementation(() => {
    return {
      login: 'testSubject',
      repos_url: 'https://fakeapi.com/users/testSubject/repos',
      location: 'Test Location',
      getReposCreationDates: () => {return [
        new Date('2000-01-01T00:00:00Z'),
        new Date('2000-01-01T00:00:00Z'),
        new Date('2000-01-01T00:00:00Z')
      ]}
    }
  });
  getWeatherConditions.mockImplementation(() => {
    return 24
  });

  const result = await getData({queryStringParameters: {user: 'testSubject'}});
  expect(result.statusCode).toBe(200);
  expect(result.body).toBe('{"repo_amount":3,"average_temperature":24}');
});
