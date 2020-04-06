const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
    entry: ['./src/app.js', './src/app.scss'],
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        sourceMapFilename: "[file].map?[contenthash]"
    },
    devServer: {
        stats: {
            children: false,
            maxModules: 0
        },
        contentBase: './dist',
        port: 9901
    },
    devtool: '#eval-source-map',
    module: {
        rules: [{
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(sa|sc)ss$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'main.css'
        }),
        new CopyPlugin([{
                from: './src/assets',
                to: './assets'
            },
        ]),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html'
        })
    ],
    node: {
        global: true,
        fs: 'empty'
    }
};
