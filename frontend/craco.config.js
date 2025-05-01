const webpack = require("webpack");

module.exports = {
  // Disable ESLint integration for CRACO/CRA:
  eslint: {
    enable: false,
  },
  webpack: {
    configure: (webpackConfig) => {
      // Provide fallbacks for Node core modules (if needed)
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        buffer: require.resolve("buffer/"),
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        util: require.resolve("util/"),
        vm: require.resolve("vm-browserify")
      };

      // Alias process references
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        process: "process",
        "process/browser": "process"
      };

      // Automatically provide global variables
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: "process",
          Buffer: ["buffer", "Buffer"]
        })
      );

      return webpackConfig;
    }
  }
};
