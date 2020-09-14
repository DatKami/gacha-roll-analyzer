import ProbabilityDataTransform from './ProbabilityDataTransform';
it('should return an error when probability is not defined', () => {
    expect(() => ProbabilityDataTransform()).toThrow('Parameter probability is required');
});

describe('the result of passing probability of .03', () => {
    let result = ProbabilityDataTransform({probability: .03}),
        correctLength = 1000;

    it('should return a max of 1000 items by default', () => {
        expect(result).toHaveLength(correctLength);
    });

    it('should have the last value to have a correct value', () => {
        expect(result[correctLength - 1]).toEqual({
            x: 1000,
            y: 0.999999999999940880021663799180233470129639183840829249742577108
        });
    });
});

describe('the result of passing probability of .03, limit of 300', () => {
    let result = ProbabilityDataTransform({probability: .03, limit: 300}),
        correctLength = 300;

    it('should return a max of 300 items by default', () => {
        expect(result).toHaveLength(correctLength);
    });

    it('should have the last value to have a correct value', () => {
        expect(result[correctLength - 1]).toEqual({
            x: 300,
            y: 0.999892472318951
        });
    });
});

describe('the result of passing probability of .03, pity limit of 300', () => {
    let result = ProbabilityDataTransform({probability: .03, pityLimit: 300}),
        correctLength = 300;

    it('should return a max of 300 items because of pity limit', () => {
        expect(result).toHaveLength(correctLength);
    });

    it('should have the last value to be 1 because of pity limit', () => {
        expect(result[correctLength - 1]).toEqual({
            x: 300,
            y: 1
        });
    });

    it('should have the second to last value to have a correct value', () => {
        expect(result[correctLength - 2]).toEqual({
            x: 299,
            y: 0.9998891467205679621150802888189329362127926582992693693174145402
        });
    });
});