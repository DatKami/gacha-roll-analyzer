function ProbabilityDataTransform(properties) {
    properties = properties || {};
    let {probability, pityLimit} = properties;
    let {limit = 1000} = properties;
    if (!probability) { 
        // throw new Error('Parameter probability is required');
        probability = 0;
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
            y: (i === pityLimit ? 1 : 1 - remainingProbability) * 100
        });
    }
    return data;
}

export default ProbabilityDataTransform;
