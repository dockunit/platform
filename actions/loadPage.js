'use strict';

module.exports = function(context, payload, done) {
    context.dispatch('UPDATE_PAGE_TITLE', {
        pageTitle: payload.title,
		redirectPath: payload.redirectPath
    });
    
    done();
};
