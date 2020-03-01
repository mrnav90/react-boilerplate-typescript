import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import ErrorOverlayPlugin from 'error-overlay-webpack-plugin';
import webpack from 'webpack';
import path from 'path';

const webpackConfig = {
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'app.js',
    hotUpdateChunkFilename: 'hot/hot-update.js',
    hotUpdateMainFilename: 'hot/hot-update.json',
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
          }
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: path.join(__dirname, '../dist/index.html'),
      template: path.join(__dirname, '../index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: 'app.css',
      allChunks: true,
      ignoreOrder: true,
    }),
    new CopyWebpackPlugin([
      { from: path.join(__dirname, '../assets'), to: path.join(__dirname, '../dist') },
    ]),
    new ErrorOverlayPlugin(),
    new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }),
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/,
      failOnError: false,
    }),
  ],
};

export default webpackConfig;
