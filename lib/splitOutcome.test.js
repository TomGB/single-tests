const { testResults } = require('../splitTestResults.json')

const findTest = name => testResults.find(
    t => t.assertionResults.find(
        r => r.fullName === name
    )
)

describe('The newly split tests', () => {
    it('fails the mockModule test', () => {
        const testOutcome = findTest('Mocking a module can have side effects has side effects from other tests')
        expect(testOutcome.status).toEqual('failed')
    })

    it('fails the mockModule test', () => {
        const testOutcome = findTest('something b has mock implementation')
        expect(testOutcome.status).toEqual('failed')
    })
})
