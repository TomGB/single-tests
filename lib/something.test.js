describe('something', () => {
  let a

  const b = jest.fn()
  const c = jest.fn()

  it('when a is set to 3 it is 3', () => {
    a = 3
    expect(a).toBe(3)
  })

  it('when a is set to 5 it is 5', () => {
    a = 5
    expect(a).toBe(5)
  })

  it('a is 5', () => {
    expect(a).toBe(5)
  })

  it('setup b mock implementation', () => {
    b.mockImplementation(() => 'bananas')
    expect(b()).toBe('bananas')
  })

  it('b has mock implementation', () => {
    expect(b()).toBe('bananas')
  })

  it('c is called with "apples"', () => {
    c('apples')
    expect(c).toHaveBeenCalledWith('apples')
  })

  it('c has been called with "apples"', () => {
    expect(c).toHaveBeenCalledWith('apples')
  })
})
