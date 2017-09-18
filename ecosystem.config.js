module.exports = {
  apps : [
    {
      name      : 'API',
      script    : 'app.js',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'deployment'
      }
    }
  ]
};
