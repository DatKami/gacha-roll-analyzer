function routine(probability) {
	let runs = 0,
		currentPityRuns = 0,
		pities = 0;
		
	while (pities < 1) {
		runs += 1;
		currentPityRuns += 1;
		if(Math.random() < probability || currentPityRuns === 90) {
			return runs; 
		}
	}
	return runs;
}

function GenshinDataTransform(properties) {
    properties = properties || {};
    let {probability} = properties;

    let buckets = [],
        cumulativeBuckets = [],
        sumRuns = 0,
        numRuns = 100000,
        data = [];

    if (!probability) { 
        // throw new Error('Parameter probability is required');
        probability = 0;
    }

    // make empty buckets
    for (let j = 0; j < 91; ++j) {
        buckets[j] = 0;
        cumulativeBuckets[j] = 0;
    }

    // count runs
    for (let i = 0; i < numRuns; ++i) {
        let run = routine(probability);
        buckets[run] += 1;
        
        sumRuns += run;
    }

    // make cumulative runs
    for (let k = 1; k <= 90; ++k) {
        cumulativeBuckets[k] = cumulativeBuckets[k-1] + buckets[k];
    }

    // normalize and transform data
    for (let l = 1; l <= 90; ++l) {
        data.push({
            x: l,
            y: cumulativeBuckets[l] / numRuns * 100
        });
    }

    return data;
}

export default GenshinDataTransform;