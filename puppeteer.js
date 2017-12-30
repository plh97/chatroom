const puppeteer = require('puppeteer');
(async () => {
		console.log('do something before')
		await setTimeout(() => {
			console.log(123)
		}, 2000);
		console.log('do something after')
})();