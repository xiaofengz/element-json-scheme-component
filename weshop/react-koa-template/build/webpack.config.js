const webpack = require('webpack')
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 用于压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// 
// const copyWebpackPlugin = require('copy-webpack-plugin');

const isProd = process.env.BABEL_ENV === 'production'
const assetsPath = (...relativePath) => path.join(__dirname, '..', ...relativePath)

module.exports = {
    // 入口文件配置项
    entry: {
        'index': [path.resolve(__dirname, '../src/page/page1/index.js')].concat(isProd ? []: ['webpack-hot-middleware/client?reload=true']),
        // 'vendor': [path.resolve(__dirname, '../src/_polyfill.js')]
    },
    // 输出文件配置项
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename:'js/[name].[hash:6].js',
        chunkFilename: 'js/[name].chunk.[chunkhash:6].js',
        publicPath: ''
    },
    devtool: isProd ? false : 'source-map',
    // webpack4.x 环境配置项
    mode: process.env.BABEL_ENV,
    module: {
        rules: [
            {
				test: /\.(jsx|js)?$/,
				use: [
					'cache-loader',
					'babel-loader',
				],
				exclude: /node_modules/
			},
            {
                test: /\.css$/,
                use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                      sourceMap: isProd ? false : 'inline',
                      config: {
                            path: 'postcss.config.js'
                        }
                    }
                  }]
            },
            {
                test: /\.less$/,
                use: [
                    isProd ? MiniCssExtractPlugin.loader : {
                        loader: 'style-loader', 
                    },
                    {
                        loader: 'css-loader', 
                        options: {
                            importLoaders: 1,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            config: {
                                path: 'postcss.config.js'
                            }
                        }
                    },
                    {
                        loader: 'less-loader', 
                        options: { 
                            sourceMap: isProd ? false : true,
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,        // 小于8192字节的图片打包成base 64图片
                            name:'images/[name].[hash:8].[ext]',
                            // publicPath: isProd ? 'https://w1.weshop.com/wxcdn/bd3fc0/' : '../',
                            publicPath: '../'
                        }
                    }
                ]
            },
            {
                // 文件依赖配置项——字体图标
                test: /\.(woff|woff2|svg|eot|ttf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8192, 
                        name: 'fonts/[name].[ext]?[hash:8]',
                        publicPath:''
                    },
                }],
            }, {
                // 文件依赖配置项——音频
                test: /\.(wav|mp3|ogg)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8192, 
                        name: 'audios/[name].[ext]?[hash:8]',
                        publicPath:''
                    },
                }],
            }, {
                // 文件依赖配置项——视频
                test: /\.(ogg|mpeg4|webm)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8192, 
                        name: 'videos/[name].[ext]?[hash:8]',
                        publicPath:''
                    },
                }],
            },
            {
                test: /\.json$/,  //用于匹配loaders所处理文件拓展名的正则表达式
                use: 'json-loader', //具体loader的名称
                type: 'javascript/auto',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            '@': assetsPath('src/'),  // import路径别名
        }
    },
    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html', //输出文件的名称
            template: path.resolve(__dirname, '../src/index.html') //模板文件的路径
        }),
    ].concat(isProd ? [
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash:6].css',
            chunkFilename: 'css/[name].[hash:6].css',
        })
    ] : [
        new webpack.HotModuleReplacementPlugin()
    ]),
    optimization: Object.assign({
        splitChunks: {
            chunks: 'all', // 只对入口文件处理
            cacheGroups:{
                vendors: { 
                    test: /node_modules\//,
                    name: 'vendor',
                    priority: 10,
                    enforce: true,
                },
            }
        },
        runtimeChunk: {
            name: 'manifest'
        }
    }, isProd ? {
        minimizer: [ // 用于配置 minimizers 和选项
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    } : {})
}