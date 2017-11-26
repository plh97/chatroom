const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');

module.exports = {
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Chat For Github',
			favicon: './favicon.png',
			template: './assets/template/index.ejs',
		})
	]
}
