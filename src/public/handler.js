import GitHubProfile from '../services/GitHubProfile';
import getWeatherConditions from '../services/weather';
import formatDate from '../utils/date/formatDate';

/**
 * @param {Object} event - HTTP request info.
 * @param {String} event.queryStringParameters.user - userName of desired user.
 *
 * @return {Object} - it returns an HTTP response.
 */
export async function getData(event) {
  if (!event.queryStringParameters || !event.queryStringParameters.user) {
    return {
      statusCode: 400,
      body: JSON.stringify({message: 'user is a required parameter'}),
    };
  }
  try {
    const profile = await GitHubProfile.findUser(event.queryStringParameters.user);
    const reposData = await profile.getReposCreationDates();
    if (reposData.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          repo_amount: 0,
          average_temperature: null,
        }),
      };
    }
    const temperatures = await Promise.all(reposData.map( async (date) => {
      return await getWeatherConditions(profile.location, formatDate(date));
    }));
    return {
      statusCode: 200,
      body: JSON.stringify({
        repo_amount: reposData.length,
        average_temperature: temperatures.reduce((total, temp) => total + temp) / temperatures.length,
      }),
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({message: err.message || 'internal server error'}),
    };
  }
}
