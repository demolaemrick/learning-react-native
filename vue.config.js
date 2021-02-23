const config = {
	productionSourceMap: false,
	chainWebpack: (config) => {
		config.module
			.rule('vue')
			.use('vue-svg-inline-loader')
			.loader('vue-svg-inline-loader')
			.options({
				/* ... */
			});
	}
};

module.exports = config;
