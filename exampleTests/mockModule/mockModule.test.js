jest.mock('./myModule')

const myModule = require('./myModule')

describe('Mocking a module can have side effects', () => {
    it('is mocked', () => {
        const result = myModule()

        expect(result).toEqual(undefined)
    })

    it('can have a mock setup', () => {
        myModule.mockReturnValue('mock response')
        const result = myModule()

        expect(result).toEqual('mock response')
    })

    it('has side effects from other tests', () => {
        const result = myModule()

        expect(result).toEqual('mock response')
    })
})
