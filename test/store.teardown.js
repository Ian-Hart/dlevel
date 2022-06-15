
const del = require('del');
require('dotenv').config(); 
(() => {	
	try {
		const dir =  del.sync([process.env.LOCAL_STORE_TEST]);
		console.log(`./test/local_store containing db and logs deleted ready for testing`);
	} catch (err) {
		console.error(`Error while deleting ./local_store.`);
	}	
;
})();