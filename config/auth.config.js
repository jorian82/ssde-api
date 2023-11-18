module.exports = {
    secret: 'random-test-key',
    // jwtExpiration: 3600,           // 1 hour
    // jwtRefreshExpiration: 86400,   // 24 hours
    /* for test */
    // jwtExpiration: 60,          // 1 minute
    // jwtRefreshExpiration: 120,  // 2 minutes
    jwtExpiration: 300,         // 5 minutes
    jwtRefreshExpiration: 360   // 6 minutes
  }