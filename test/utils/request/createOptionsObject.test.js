import createOptions from '../../../src/utils/request/createOptionsObject';

test('createOptions: it should return the correct options object', async () => {
  const result = createOptions('myURL');

  expect(result.uri).toBe('myURL');
});
