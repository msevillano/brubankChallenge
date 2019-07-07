import request from 'request-promise';
import createOptions from '../utils/request/createOptionsObject';
import BasicError from '../utils/error/BasicError';

const WEATHER_API_URL = process.env.WEATHER_API_URL;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

/**
 * Retrieves weather info from the weather API.
 * @param {String} location - City, Country to retrieve temperature.
 * @param {String} date - Date to retrieve temperature.
 *
 * @return {Number} - temperature of the city-date given.
 */
async function howIsTheWeather(location, date) {
  if (!location) throw new BasicError(400, `location is required to perform this search`);
  const weather = await request(createOptions(
      `${WEATHER_API_URL}?q=${location}&date=${date}&&tp=24&format=json&key=${WEATHER_API_KEY}`));
  if (!weather.data.weather) throw new BasicError(400, `info for ${location} at ${date} is unavailable`);
  return parseInt(weather.data.weather[0].avgtempC);
}

export default howIsTheWeather;
