const config = {
	preset: '@vue/cli-plugin-unit-jest',
	// transform: {
	// 	'^.+\\.(js|jsx)?$': '<rootDir>/node_modules/babel-jest'
	//  },
	transformIgnorePatterns: ['node_modules/(?!vee-validate|vue-radial-progress)'],
	//transformIgnorePatterns: ["/node_modules/(?!@babel/runtime)"],
	// moduleNameMapper: {
	// 	'^@/(.*)$': '<rootDir>/$1',
	// 	'^~/(.*)$': '<rootDir>/$1',
	// 	'^vue$': 'vue/dist/vue.common.js'
	//   },
	moduleFileExtensions: ['js', 'vue', 'json'],
	transform: {
		'^.+\\.js$': 'babel-jest',
		'.*\\.(vue)$': 'vue-jest'
	},
	collectCoverage: true,
	collectCoverageFrom: ['<rootDir>/src/**/*.vue'],
	coverageReporters: ['text-summary', 'html', 'lcov', 'clover']
};

module.exports = config;
