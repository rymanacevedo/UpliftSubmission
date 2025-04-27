it('should approve a claim', async() => {
    const processor = new ClaimProcessor();
    processor.evaluateClaim({}, []);
    expect(processor.getClaimStatus()).toBe('approved');
});