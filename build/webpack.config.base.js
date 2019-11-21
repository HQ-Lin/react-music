const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

const {resolve} = require('./utils');

const webpackBaseConfig = function (DEPLOY_ENV = 'prod') {
    const config = require('../config')(DEPLOY_ENV);

    const webpackConfig = {
        // 定义入口文件
        entry: {
            app: resolve('src/index.jsx')
        },
        resolve: config.resolve,
        devtool: config.devtool,
        module: {
            // 定义loader
            rules: [
                {
                    test: /\.jsx?$/,
                    loader: 'babel-loader',
                    exclude: /(node_modules)/,
                },
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: 'html-loader',
                            options: { minimize: true }
                        }
                    ]
                },
                {
                    test: /\.(jpe?g|png|gif|webp|svg)$/,
                    loader: 'url-loader',
                    query: {
                        limit: 8192,
                        publicPath: config.publicPath + config.imgPath,
                        outputPath: config.imgPath,
                        useRelativePath: false,
                        name: config.filenameHash ? '[name].[hash].[ext]' : '[name].[ext]?[hash]'
                    }
                },
                {
                    test: /\.(ttf|eot|woff|woff2)$/,
                    loader: 'url-loader',
                    query: {
                        limit: 8192,
                        publicPath: config.publicPath + 'fonts/',
                        outputPath: 'fonts/',
                        useRelativePath: false,
                        name: config.filenameHash ? '[name].[hash].[ext]' : '[name].[ext]?[hash]'
                    }
                },
            ]
        },
        // 添加插件
        plugins: [
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: resolve('public/index.html'),
                favicon: resolve('public/favicon.ico'),
            }),
            new ProgressBarPlugin(),
            new SWPrecacheWebpackPlugin(config.swConfig),
        ],

        optimization: {
            // 持久化缓存
            runtimeChunk: {
                name: 'runtime',
            },
            splitChunks: {
                chunks: 'all',
                minSize: 0,
                maxInitialRequests: Infinity,
                cacheGroups: {
                    vendor: {
                        test: /node_modules/,
                        chunks: 'initial',
                        name: 'vendor',
                        priority: 10,
                        enforce: true
                    }
                }
            },
        }
    };

    if (config.eslint) {
        webpackConfig.module.rules.unshift({
            test: /\.jsx?$/,
            enforce: 'pre',
            exclude: /node_modules/,
            loader: 'eslint-loader',
        });
    }

    return webpackConfig;
};

module.exports = webpackBaseConfig;
