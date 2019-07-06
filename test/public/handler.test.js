import {getStatus} from '../../src/public/handler';

test('server returns 200', async () => {
  const result = await getStatus();
  expect(result.statusCode).toBe(200);
});
