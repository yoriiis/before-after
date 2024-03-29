import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)

export default function webpackConfig(env, argv) {
	const isProduction = argv.mode === 'production'

	const config = {
		entry: {
			demo: resolveApp('demo/config.js')
		},
		watchOptions: {
			ignored: /node_modules/
		},
		devtool: isProduction ? false : 'source-map',
		output: {
			path: resolveApp('demo/dist/'),
			filename: 'scripts/[name].js'
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					include: [resolveApp('demo'), resolveApp('src')],
					use: [
						{
							loader: 'babel-loader'
						}
					]
				},
				{
					test: /\.css$/,
					include: [resolveApp('demo'), resolveApp('src')],
					use: [
						MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader'
						},
						{
							loader: 'postcss-loader',
							options: {
								postcssOptions: {
									config: resolveApp('config/postcss.config.cjs')
								}
							}
						}
					]
				},
				{
					test: /\.jpg/,
					type: 'asset/resource',
					generator: {
						filename: 'images/[name][ext]'
					}
				}
			]
		},
		resolve: {
			extensions: ['.js', '.css']
		},
		devServer: {
			static: {
				directory: resolveApp('demo')
			},
			historyApiFallback: true,
			port: 3000,
			compress: true,
			hot: true,
			open: true,
			headers: {
				'Cache-Control': 'no-store'
			}
		},
		context: appDirectory,
		plugins: [
			new MiniCssExtractPlugin({
				filename: 'styles/[name].css',
				chunkFilename: 'styles/[name].css'
			}),
			new HtmlWebpackPlugin({
				filename: 'index.html',
				template: resolveApp('demo/index.html'),
				chunks: ['demo']
			})
		],
		stats: {
			assets: true,
			colors: true,
			hash: false,
			timings: true,
			chunks: false,
			chunkModules: false,
			modules: false,
			children: false,
			entrypoints: false,
			excludeAssets: /.map$/,
			assetsSort: '!size'
		},
		optimization: {
			minimizer: [
				new TerserPlugin({
					extractComments: false,
					parallel: true,
					terserOptions: {
						compress: {
							// Drop console.log|console.info|console.debug
							// Keep console.warn|console.error
							pure_funcs: ['console.log', 'console.info', 'console.debug']
						},
						mangle: true
					}
				}),
				new CssMinimizerPlugin()
			],
			chunkIds: 'deterministic', // or 'named'
			removeAvailableModules: true,
			removeEmptyChunks: true,
			mergeDuplicateChunks: true,
			providedExports: false,
			splitChunks: false
		}
	}

	if (!isProduction) {
		config.plugins.push(new webpack.ProgressPlugin())
	}

	return config
}
