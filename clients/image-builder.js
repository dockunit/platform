var image = function(req) {
	this.repository = req.url.replace(/\.svg$/g, '').replace(/^\/?projects\//g, '');
	console.log(this.repository);
};

image.prototype.toString = function() {
	return '';
};

module.exports = image;