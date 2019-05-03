module.exports = {
    files: ['lib/**/*.js', '!lib/**/*.test.js'],
    jest: {
        config: './jest.config.js',
    },
    tests: ['lib/**/*.test.js'],
}
