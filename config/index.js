const path = require('path');
const merge = require('webpack-merge');
const swConfig = require('./sw-config');

module.exports = (DEPLOY_ENV = 'dev') => {
    return merge({
        swConfig,
        resolve: {
            // 自动补充后缀
            extensions: ['.js', '.jsx', '.scss', '.json'],
            // 定义路径别名
            alias: {
                '@api': path.resolve(__dirname, '../src/api'),
                '@assets': path.resolve(__dirname, '../src/assets'),
                '@components': path.resolve(__dirname, '../src/components'),
                '@views': path.resolve(__dirname, '../src/views'),
                '@store': path.resolve(__dirname, '../src/store'),
                '@router': path.resolve(__dirname, '../src/router'),
            }
        },
        //类型静态资源访问路径
        jsPath: 'static/js/',
        cssPath: 'static/css/',
        imgPath: 'static/media/',
        publicPath: '',
    }, require(path.join(__dirname, DEPLOY_ENV)));
};
