describe('something', () => {
    let a;
    it('when a is set to 3 it is 3', () => {
        a = 3;
        expect(a).toBe(3);
    });
    it('a is 5', () => {
        expect(a).toBe(5);
    });
    it('when a is set to 5 it is 5', () => {
        a = 5;
        expect(a).toBe(5);
    });
});