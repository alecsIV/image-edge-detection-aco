const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')


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
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        publicPath: '../images',
                        emitFile: false
                    }
                }]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'main.css'
        }),
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
