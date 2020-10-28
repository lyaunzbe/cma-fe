const standard = require('@neutrinojs/standardjs');
const node = require('@neutrinojs/node');
const react = require('@neutrinojs/react');
const jest = require('@neutrinojs/jest');
const Dotenv = require('dotenv-webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = {
  options: {
    root: __dirname,

  },
  use: [
    standard(),
    react({
      publicPath: '/',
      html: {
        title: 'Computer.Make.Art ',
      },
      style: {
        test: /\.(css|sass|scss)$/,
        modulesTest: /\.module\.(css|sass|scss)$/,
        loaders: [
          {
            loader: 'sass-loader',
            useId: 'sass'
          }
        ]
      },
      babel: {
        plugins: [
          [
            'module-resolver',
            {
              root: ['./src'],
              alias: {
                test: './test',
                components: './src/components',
                routes: './src/routes',
                style: './src/style',
                hooks: './src/hooks',
                api: './src/api',
                utils: './src/utils'
              }
            }
          ]
        ]
      }
    }),
    jest(),
    (neutrino) => {
      neutrino.config.node.set('Buffer', true)
      // Use .env to populate environment variables
      neutrino.config.plugin('dotenv').use(Dotenv)
      // Generate bundle analysis on build
      if (process.env.NODE_ENV === 'production') {
        neutrino.config.plugin('analyzer')
          .use(BundleAnalyzerPlugin, [{
            reportFilename: '_report.html',
            analyzerMode: 'static',
            openAnalyzer: false,
            logLevel: 'silent'
          }])
      }
    }
  ],
};
