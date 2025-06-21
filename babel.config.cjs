module.exports = function (api) {
  const isProduction = api.env('production');
  const isDevelopment = api.env('development');

  return {
    presets: [
      ['@babel/preset-env', { modules: false }]
    ],
    comments: true, // 🔥 주석 무조건 유지!
  };
};
