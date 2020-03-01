import CompressionPlugin from 'compression-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import HtmlWebpackPrefixPlugin from 'html-webpack-prefix-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import MomentLocalesPlugin from 'moment-locales-webpack-plugin';
import webpack from 'webpack';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const webpackConfig = {
  output: {
    path: path.join(__dirname, '../public'),
    filename: 'app.[contenthash:6].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|ico)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              hash: 'sha512',
              digest: 'hex',
              name: '[hash].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                quality: 65,
              },
              optipng: {
                optimizationLevel: 7,
              },
              gifsicle: {
                interlaced: false,
              },
              pngquant: {
                quality: '65-90',
                speed: 4,
              }
            },
          }
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 10,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
            )[1];
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
    nodeEnv: process.env.NODE_ENV,
    sideEffects: true,
    concatenateModules: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          warnings: false,
          compress: {
            comparisons: false,
          },
          parse: {},
          mangle: true,
          output: {
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
        cache: true,
        sourceMap: true,
      }),
    ],
  },
  plugins: [
    new MomentLocalesPlugin(),
    new OptimizeCSSAssetsPlugin({}),
    new HtmlWebpackPlugin({
      filename: path.join(__dirname, '../public/index.html'),
      template: path.join(__dirname, '../index.html'),
      prefix: process.env.APP_URL,
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new HtmlWebpackPrefixPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new MiniCssExtractPlugin({
      filename: 'app.[chunkhash:6].css',
      allChunks: true,
      ignoreOrder: true,
    }),
    new CompressionPlugin({
      filename: '[path]',
      algorithm: 'gzip',
      test: /\.js$|\.css$/,
      minRatio: 0.8,
    }),
    new CopyWebpackPlugin([
      { from: path.join(__dirname, '../assets'), to: path.join(__dirname, '../public') },
    ]),
    new ManifestPlugin({
      filter: ({ name }) => ['main.js', 'main.css'].indexOf(name) !== -1,
    }),
  ],
};

export default webpackConfig;
