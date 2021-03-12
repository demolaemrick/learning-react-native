const config = {
	preset: '@vue/cli-plugin-unit-jest',
	transform: { 
		'^.+\\.(js|jsx)?$': '<rootDir>/node_modules/babel-jest'
	 },
	transformIgnorePatterns: ['node_modules/(?!vee-validate|vue-radial-progress)']
};

module.exports = config;
