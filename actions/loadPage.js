'use strict';

module.exports = function(context, payload, done) {
    context.dispatch('UPDATE_PAGE_TITLE', {
        pageTitle: payload.config.title,
		redirectPath: payload.redirectPath
    });
    
    done();
};
