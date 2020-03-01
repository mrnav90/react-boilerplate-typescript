import webpack from 'webpack';
import path from 'path';
import dotenv from 'dotenv';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

dotenv.config();

const DEVELOPMENT = process.env.NODE_ENV === 'development';

const baseConfig = {
  rules: [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    },
    {
      test: /\.ts(x?)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            logLevel: 'info',
          },
        },
      ],
    },
    {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
      ],
    },
    {
      test: /\.scss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'sass-loader',
      ],
    },
    {
      type: 'javascript/auto',
      test: /\.json$/,
      loader: 'json-loader',
    },
    {
      test: /\.(md)$/,
      use: [
        MiniCssExtractPlugin.loader,
        'html',
        'highlight',
        'markdown',
      ],
    },
    {
      test: /\.svg$/,
      use: [
        {
          loader: 'svg-url-loader',
          options: {
            limit: 10 * 1024,
            noquotes: true,
          },
        },
      ],
    },
    {
      test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)/,
      loader: 'url-loader',
    },
  ],
  alias: {
    jquery: path.join(__dirname, '../node_modules/jquery/dist/jquery'),
    components: path.resolve(__dirname, '../src/components'),
    containers: path.resolve(__dirname, '../src/containers'),
    config: path.resolve(__dirname, '../src/config'),
    api: path.resolve(__dirname, '../src/api'),
    styles: path.resolve(__dirname, '../src/styles'),
    pages: path.resolve(__dirname, '../src/pages'),
    i18n: path.resolve(__dirname, '../i18n'),
    utils: path.resolve(__dirname, '../src/utils'),
    assets: path.resolve(__dirname, '../assets'),
    stores: path.resolve(__dirname, '../src/stores'),
    src: path.resolve(__dirname, '../src'),
    modals: path.resolve(__dirname, '../src/modals'),
  },
  plugins: [
    new webpack.DefinePlugin({
      'API_URL': JSON.stringify(process.env.API_URL),
      'APP_URL': JSON.stringify(process.env.APP_URL),
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'PORT': JSON.stringify(process.env.PORT),
      'SSR': JSON.stringify(process.env.SSR),
    }),
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery',
    }),
    new webpack.NamedModulesPlugin(),
  ],
  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    historyApiFallback: true,
    host: '0.0.0.0',
    port: process.env.PORT || 8001,
    compress: !DEVELOPMENT,
    inline: DEVELOPMENT,
    hot: DEVELOPMENT,
    writeToDisk: true,
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: false,
      warnings: true,
      colors: {
        green: '\u001b[32m',
      },
    },
  }
};

export default baseConfig;
