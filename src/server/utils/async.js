'use strict';

/**
 * sleep
 * @param  {async}
 * @return  间隔1s再进行下一步
 */

class sleep{
	async sleep(time){
		console.log(`now to sleep ${time}ms`);
		return new Promise( next=> {
			setTimeout(()=> {
				next();
			}, time);
		})
	};
}

module.exports = new sleep();