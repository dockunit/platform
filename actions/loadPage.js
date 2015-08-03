'use strict';

module.exports = function(context, payload, done) {
	delete payload.handler;
	console.log(payload);

    context.dispatch('UPDATE_PAGE_TITLE', {
        pageTitle: payload.title,
		redirectPath: payload.redirectPath
    });
    
    done();
};
