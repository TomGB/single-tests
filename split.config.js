module.exports = {
    files: ['exampleTests', '!**/*.test.js', 'node_modules'],
    jest: {
        config: './jest.config.js',
    },
    tests: ['**/*.test.js', '!split-tmp'],
}
