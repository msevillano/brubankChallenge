import request from 'request-promise';
import createOptions from '../utils/request/createOptionsObject';
import BasicError from '../utils/error/BasicError';

const GITHUB_API = process.env.GITHUB_API_URL;

/**
 * @typedef {Object} GitHubProfile.
 * @property {string} userName - The GitHub user.
 * @property {string} repos_url - URL from where the userRepos can be retrieved.
 * @property {string} location - Geographic location of the user.
 */
class GitHubProfile {
  /**
   * constructor GitHubProfile model, based on data retrieved from GitHub.
   * @param  {Object} gitHubUserData - Data retrieved from GitHub.
   */
  constructor(gitHubUserData) {
    Object.assign(this, gitHubUserData);
  }

  /**
   * Retrieves data from te given GitHub user.
   * @param {String} user - The GitHub user for whom repos will be searched.
   *
   * @return {GitHubProfile} - The GitHub user profile data.
   */
  static async findUser(user) {
    const gitHubData = await request(createOptions(`${GITHUB_API}/users/${user}`));
    return new GitHubProfile(gitHubData);
  }

  /**
   * Retrieves the creation date of a user's repositories.
   * {String} repos_url - URL from where the repos can be accessed.
   * This param must exist on the object to perform this search.
   *
   * @return {Date []} - Dates on where the user created a repo.
   */
  async getReposCreationDates() {
    if (!this.repos_url) throw new BasicError(400, 'profile.repos_url is a required attribute');
    const repoList = await request(createOptions(this.repos_url));
    return repoList.filter((repo) => !repo.fork).map((repo) => {
      return new Date(repo.created_at);
    });
  }
}

export default GitHubProfile;
