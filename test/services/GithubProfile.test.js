import request from 'request-promise';
import GitHubProfile from '../../src/services/GitHubProfile';

jest.mock('request-promise');

test('GitHubProfile constructor: it should create the object with the given params', async () => {
  const testProfile = new GitHubProfile({login: 'testSubject', location: 'Test Location'});

  expect(testProfile.login).toBe('testSubject');
  expect(testProfile.location).toBe('Test Location');
});

test('GitHubProfile findUser(userName): it should throw an error on the request', async () => {
  request.mockImplementation(() => {
    throw {
      name: 'StatusCodeError',
      statusCode: 404,
      message: '404 - {"message":"Not Found","documentation_url":""}',
    };
  });

  await GitHubProfile.findUser('testSubject').catch((error) => {
    expect(error.name).toBe('StatusCodeError');
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('404 - {"message":"Not Found","documentation_url":""}');
  });
});

test('GitHubProfile findUser(userName): it should return an instance with the userData', async () => {
  request.mockImplementation(() => Promise.resolve({
    login: 'testSubject',
    repos_url: 'https://fakeapi.com/users/testSubject/repos',
    location: 'Test Location',
  }));

  const testProfile = await GitHubProfile.findUser('testSubject');

  expect(testProfile.login).toBe('testSubject');
  expect(testProfile.repos_url).toBe('https://fakeapi.com/users/testSubject/repos');
  expect(testProfile.location).toBe('Test Location');
});

test('GitHubProfile getReposCreationDates(): it should throw an error on missing attribute', async () => {
  const testProfile = new GitHubProfile({
    login: 'testSubject',
    location: 'Test Location',
  });

  await testProfile.getReposCreationDates().catch((error) => {
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('profile.repos_url is a required attribute');
  });
});

test('GitHubProfile getReposCreationDates(): it should throw an error on the request', async () => {
  request.mockImplementation(() => {
    throw {
      name: 'StatusCodeError',
      statusCode: 404,
      message: '404 - {"message":"Not Found","documentation_url":""}',
    };
  });

  const testProfile = new GitHubProfile({
    login: 'testSubject',
    location: 'Test Location',
    repos_url: 'https://api.fakeapi.com/users/testSubject/repos',
  });
  await testProfile.getReposCreationDates().catch((error) => {
    expect(error.name).toBe('StatusCodeError');
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('404 - {"message":"Not Found","documentation_url":""}');
  });
});

test('GitHubProfile getReposCreationDates(): it should return an array of dates', async () => {
  request.mockImplementation(() => Promise.resolve([{
    fork: false,
    created_at: '2000-01-01T00:00:00Z',
  }, {
    fork: false,
    created_at: '2000-01-01T00:00:00Z',
  }, {
    fork: true,
    created_at: '2000-01-01T00:00:00Z',
  }, {
    fork: false,
    created_at: '2000-01-01T00:00:00Z',
  }]
  ));

  const testProfile = new GitHubProfile({
    login: 'testSubject',
    location: 'Test Location',
    repos_url: 'https://api.fakeapi.com/users/testSubject/repos',
  });
  const testDates = await testProfile.getReposCreationDates();

  expect(testDates.length).toBe(3);
});

