const HtmlWebPackPlugin    = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin           = require("copy-webpack-plugin"); 
const CssMinimzerPlugin    = require('css-minimizer-webpack-plugin');
const TerserPlugin         = require('terser-webpack-plugin');

module.exports = {
 
    mode: 'production',
    output: {
        clean: true,
        filename: 'main.[contenthash].js'
    },

    module:{

        rules: [
            //Sirven para decirle que hacer con los distintos tipos de archivo
            {
                //Es la condición que debe cumplir, se usan expresiones regulares
                test: /\.html$/i,
                loader: 'html-loader',
                options: {
                    sources: false,
                    minimize: false,
                },
            },
            {
                test: /\.css$/,
                exclude: /styles.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /styles.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },

            {
                test: /\.(png|jpe?g|gif)$/,
                loader: 'file-loader'
            },

            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
            }
        ],
    },

    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimzerPlugin(),
            new TerserPlugin(),
        ]
    },

    //Aquí se ejecuta la instancia que hemos creado antes para que copie el index html de la carpeta src a dist para cuando se suba a producción
    plugins:[
        new HtmlWebPackPlugin({
            template: './src/index.html',
            filename: './index.html'
        }),

        new MiniCssExtractPlugin({
            filename: '[name].[fullhash].css',
            ignoreOrder: false
        }),

        new CopyPlugin ({
            patterns: [
            {from: 'src/assets/', to: 'assets/'}
            ]
        })
    ]
 
}