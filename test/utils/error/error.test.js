import BasicError from '../../../src/utils/error/BasicError';

test('createOptions: it should return the correct options object', async () => {
  const error = new BasicError(404, 'testMessage');

  expect(error.statusCode).toBe(404);
  expect(error.message).toBe('testMessage');
});
