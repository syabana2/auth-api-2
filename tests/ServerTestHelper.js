/* istanbul ignore file */
const Jwt = require('@hapi/jwt');

const ServerTestHelper = {
  async getAccessToken(payload) {
    return Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
  }
};

module.exports = ServerTestHelper;
