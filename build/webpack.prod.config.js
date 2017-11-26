const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Chat For Github',
			favicon: './favicon.png',
			template: './assets/template/index.ejs',
			minify: {
				removeComments: true,
				collapseWhitespace: true
			}
		}),
	],
}
