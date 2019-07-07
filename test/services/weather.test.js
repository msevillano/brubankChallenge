import request from 'request-promise';
import howIsTheWeather from '../../src/services/weather';

jest.mock('request-promise');

test('howIsTheWeather(location, date): it should throw if temp in ºC is missing', async () => {
  request.mockImplementation(() => Promise.resolve({
    data: {
      error: [
        {
          msg: 'Unable to find any matching weather location to the query submitted!',
        }
      ]
    }
  }));
  await howIsTheWeather('testLocation', '2000-1-1').catch((error) => {
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('info for testLocation at 2000-1-1 is unavailable');
  });
});

test('howIsTheWeather(location, date): it should throw an error on the request', async () => {
  request.mockImplementation(() => {
    throw {
      name: 'StatusCodeError',
      statusCode: 401,
      message:{
        data: {
          error: [
            {
              msg:'testError'
            }
          ]
        }
      }
    }
  });
  await howIsTheWeather('testLocation', '2000-1-1').catch((error) => {
    expect(error.statusCode).toBe(401);
    expect(error.message.data.error[0].msg).toBe('testError');
  });
});

test('howIsTheWeather(location, date): it should return temp in ºC', async () => {
  request.mockImplementation(() => Promise.resolve({
    data: {
      weather: [
        {
          date: '2019-01-03',
          avgtempC: '24',
        }
      ]
    }
  }));
  const testTemperature = await howIsTheWeather('testLocation', '2000-1-1');

  expect(testTemperature).toBe(24);
});
