const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');

const DEFAULT_HEADERS = {
    referer: 'https://c.y.qq.com/',
    host: 'c.y.qq.com'
};

module.exports = {
    devServer: {
        before(app) {
            app.use(bodyParser.urlencoded({ extended: true }));

            app.get('/api/getRecommend', (req, res) => {
                const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
                axios.get(url, {
                    headers: DEFAULT_HEADERS,
                    params: req.query
                }).then(response => res.json(response.data))
                    .catch(err => console.error('/api/getRecommend err: ', err));
            });

            app.get('/api/getDiscList', (req, res) => {
                const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
                axios.get(url, {
                    headers: DEFAULT_HEADERS,
                    params: req.query
                }).then(response => res.json(response.data))
                    .catch(err => console.error('/api/getDiscList err: ', err));
            });

            app.get('/api/getCdInfo', (req, res) => {
                const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';
                axios.get(url, {
                    headers: DEFAULT_HEADERS,
                    params: req.query,
                }).then(response => {
                    let ret = response.data;
                    if (typeof ret === 'string') {
                        const reg = /^\w+\(({.+})\)$/;
                        const matches = ret.match(reg);
                        if (matches) {
                            ret = JSON.parse(matches[1]);
                        }
                    }
                    res.json(ret);
                }).catch(err => console.error('/api/getCdInfo err: ', err));
            });

            app.get('/api/lyric', (req, res) => {
                const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
                axios.get(url, {
                    headers: DEFAULT_HEADERS,
                    params: req.query
                }).then(response => {
                    let ret = response.data;
                    if (typeof ret === 'string') {
                        const reg = /^\w+\(({.+})\)$/;
                        const matches = ret.match(reg);
                        if (matches) {
                            ret = JSON.parse(matches[1]);
                        }
                    }
                    res.json(ret);
                }).catch(err => console.error('/api/lyric err:', err));
            });

            app.post('/api/getPurlUrl', bodyParser.json(), (req, res) => {
                const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';
                axios.post(url, req.body, {
                    headers: {
                        referer: 'https://y.qq.com/',
                        origin: 'https://y.qq.com',
                        'Content-type': 'application/x-www-form-urlencoded'
                    }
                }).then(response => res.json(response.data))
                    .catch(err => console.error('/api/getPurlUrl err: ', err));
            });
        },
        historyApiFallback: true,
        overlay: {
            warnings: false,
            errors: true
        },
        contentBase: path.resolve(__dirname, '../dist/'),
        port: 9999,
        host: '0.0.0.0',
        open: true,
        hot: true,
    },
    devtool: 'cheap-module-eval-source-map',
    filenameHash: false,    // 生成带hash文件名
};
