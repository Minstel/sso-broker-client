const webpack = require('webpack');

module.exports = function(env) {
    const filename = env === 'prod' ? 'sso-broker.min.js' : 'sso-broker.js';

    return {
        mode: env === 'prod' ? 'production' : 'development',
        entry: './index.js',
        output: {
            path: __dirname + '/assets',
            filename: filename,
            library: 'SSOBroker'
        },
        optimization: {
            minimize: env === 'prod'
        },
        node: {
            fs: "empty",
            net: "empty",
            child_process: "empty",
            tls: "empty"
        },
        plugins: [
            new webpack.optimize.OccurrenceOrderPlugin()
        ]
    };
}
