function calculateConsumption() {
    // 1. Get user input values
    let elecBase = parseFloat(document.getElementById('elec-base').value) || 0;
    let waterBase = parseFloat(document.getElementById('water-base').value) || 0;
    let supBase = parseFloat(document.getElementById('supplies-base').value) || 0;
    let cleanBase = parseFloat(document.getElementById('cleaning-base').value) || 0;

    // Variables to store accumulated totals
    let elecYear = 0, elecPeriod = 0;
    let waterYear = 0, waterPeriod = 0;
    let supYear = 0, supPeriod = 0;
    let cleanYear = 0, cleanPeriod = 0;

    // 2. Month-by-month seasonality algorithm
    // 1 = Jan, 2 = Feb... 8 = Aug (Summer close), 9 = Sept (Start of year)
    for (let month = 1; month <= 12; month++) {
        let elecFactor = 1.0;
        let waterFactor = 1.0;
        let supFactor = 1.0;
        let cleanFactor = 1.0;

        // Apply specific seasonal logic
        if (month === 8) {
            // AUGUST: Center is mostly closed
            elecFactor = 0.15; // Only servers and fridges
            waterFactor = 0.10; // Only base leaks
            supFactor = 0.0;    // No classes
            cleanFactor = 0.20; // Basic maintenance
        } else if (month === 7) {
            // JULY: Less activity, but intensive cleaning
            elecFactor = 0.8;
            waterFactor = 0.9;
            supFactor = 0.2;
            cleanFactor = 1.5; // Deep summer cleaning
        } else if (month === 12 || month === 1 || month === 2) {
            // WINTER: Heating and more artificial light
            elecFactor = 1.3;
        } else if (month === 9) {
            // SEPTEMBER: Start of the school year
            supFactor = 2.0; // Massive purchase of supplies
            cleanFactor = 1.2;
        }

        // Add to Annual Total
        elecYear += elecBase * elecFactor;
        waterYear += waterBase * waterFactor;
        supYear += supBase * supFactor;
        cleanYear += cleanBase * cleanFactor;

        // Add to School Period (Sept - June) -> Exclude July (7) and August (8)
        if (month !== 7 && month !== 8) {
            elecPeriod += elecBase * elecFactor;
            waterPeriod += waterBase * waterFactor;
            supPeriod += supBase * supFactor;
            cleanPeriod += cleanBase * cleanFactor;
        }
    }

    // 3. Display Results on the UI (Rounded)
    document.getElementById('results').style.display = 'block';

    document.getElementById('res-elec-year').innerText = Math.round(elecYear);
    document.getElementById('res-elec-period').innerText = Math.round(elecPeriod);

    document.getElementById('res-water-year').innerText = Math.round(waterYear);
    document.getElementById('res-water-period').innerText = Math.round(waterPeriod);

    document.getElementById('res-sup-year').innerText = Math.round(supYear);
    document.getElementById('res-sup-period').innerText = Math.round(supPeriod);

    document.getElementById('res-clean-year').innerText = Math.round(cleanYear);
    document.getElementById('res-clean-period').innerText = Math.round(cleanPeriod);

    // 4. Calculate the 30% Reduction Plan
    const reductionFactor = 0.70; // -30%

    document.getElementById('obj-elec').innerText = Math.round(elecYear * reductionFactor);
    document.getElementById('obj-water').innerText = Math.round(waterYear * reductionFactor);
    document.getElementById('obj-sup').innerText = Math.round(supYear * reductionFactor);
    document.getElementById('obj-clean').innerText = Math.round(cleanYear * reductionFactor);
}