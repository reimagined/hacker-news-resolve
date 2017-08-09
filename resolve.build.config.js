const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    extendWebpack: (clienConfig, serverConfig) => {
        clienConfig.module.rules = clienConfig.module.rules.concat([
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.(png|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
                loader: 'url-loader?limit=100000'
            }
        ]);

        clienConfig.plugins.push(new ExtractTextPlugin('bundle.css'));

        serverConfig.module.rules = serverConfig.module.rules.concat([
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.(png|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
                loader: 'url-loader?limit=100000'
            }
        ]);

        if (serverConfig.plugins) {
            serverConfig.plugins.push(new ExtractTextPlugin('bundle.css'));
        } else {
            serverConfig.plugins = [new ExtractTextPlugin('bundle.css')];
        }
    }
};
