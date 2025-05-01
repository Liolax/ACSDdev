const webpack = require("webpack");

module.exports = {
  eslint: {
    // Disable ESLint (temporarily disable linting)
    enable: false,
  },
  webpack: {
    configure: (webpackConfig) => {
      // Provide fallbacks for Node core modules
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
      
      // Optional: Exclude problematic modules from source-map-loader:
      webpackConfig.module.rules.forEach((rule) => {
        if (rule.use && Array.isArray(rule.use)) {
          rule.use = rule.use.map((u) => {
            if (typeof u === "object" && u.loader && u.loader.includes("source-map-loader")) {
              // Exclude directories that are causing missing module errors
              u.exclude = [
                /node_modules[\\/]@pmmmwh[\\/]react-refresh-webpack-plugin/,
                /node_modules[\\/]@formspree[\\/]react/,
                /node_modules[\\/]@svgr[\\/]webpack/,
              ];
            }
            return u;
          });
        }
      });

      return webpackConfig;
    }
  }
};
