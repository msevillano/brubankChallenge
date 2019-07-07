const envVars = {
  GITHUB_API_URL: 'https://api.fakegithub.com',
  WEATHER_API_URL: 'https://api.fakeweatherapi.com',
  WEATHER_API_KEY: '000000000000000000000000000000'
};

async function setupFunction() {
  process.env = Object.assign(envVars, process.env);
}

export default setupFunction;
