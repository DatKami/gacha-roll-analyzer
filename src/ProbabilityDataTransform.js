function ProbabilityDataTransform(properties) {
    properties = properties || {};
    const {probability, pityLimit} = properties;
    let {limit = 1000} = properties;
    if (!probability) { 
        throw new Error('Parameter probability is required');
    }
    let data = [], 
        i, 
        remainingProbability = 1;

    const probabilityMultiplier = 1 - probability;

    pityLimit && (limit = pityLimit);
    for (i = 1; i <= limit; ++i) {
        remainingProbability = remainingProbability * probabilityMultiplier;
        data.push({
            x: i,
            y: i === pityLimit ? 1 : 1 - remainingProbability
        });
    }
    return data;
}

export default ProbabilityDataTransform;