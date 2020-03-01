import dotenv from 'dotenv';
import path from 'path';
import webpackBaseConfig from './base';
import webpackProductionConfig from './production';
import webpackDevConfig from './dev';
// import serverConfig from './server';

dotenv.config();

const DEVELOPMENT = process.env.NODE_ENV === 'development';
const DEBUG = process.env.DEBUG === 'yes';
const SSR = process.env.SSR === 'yes';

const webpackConfig = {
  entry: './src/app.tsx',
  output: DEVELOPMENT ? webpackDevConfig.output : webpackProductionConfig.output,
  module: {
    rules: [
      ...webpackBaseConfig.rules,
      ...(DEVELOPMENT ? webpackDevConfig.module : webpackProductionConfig.module)
    ],
  },
  mode: process.env.NODE_ENV,
  resolve: {
    extensions: ['.js', '.jsx', '.react.js', '.ts', '.tsx'],
    modules: ['node_modules', 'src'],
    alias: webpackBaseConfig.alias,
  },
  performance: { hints: false },
  node: {
    fs: 'empty',
    child_process: 'empty',
    global: true,
    process: true,
    Buffer: true,
    __filename: true,
    __dirname: true,
    setImmediate: false,
  },
  stats: {
    children: false,
    colors: {
      green: '\u001b[32m',
    },
  },
  plugins: [
    ...webpackBaseConfig.plugins,
    ...(DEVELOPMENT ? webpackDevConfig.plugins : webpackProductionConfig.plugins)
  ],
  devtool: DEBUG ? 'eval-source-map' : 'source-map',
};

if (DEVELOPMENT && !SSR) {
  webpackConfig.devServer = webpackBaseConfig.devServer;
}

export default webpackConfig;

// export default SSR ? [webpackConfig, serverConfig] : webpackConfig;
