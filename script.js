function calculateConsumption() {
    // 1. Get user input values
    let elecBase = parseFloat(document.getElementById('elec-base').value) || 0;
    let waterBase = parseFloat(document.getElementById('water-base').value) || 0;
    let supBase = parseFloat(document.getElementById('supplies-base').value) || 0;
    let cleanBase = parseFloat(document.getElementById('cleaning-base').value) || 0;

    // 2. Seasonality Factors 
    // Electricity: higher in winter/summer due to climate control (+15% annual extra). 
    // The school period has less impact from August air conditioning.
    const seasonalityElecYear = 1.15; 
    const seasonalityElecPeriod = 1.05; 

    // Water: higher in summer (+10%).
    const seasonalityWaterYear = 1.10;
    
    // Supplies and Cleaning: High consumption during school months, almost zero in August.
    const activeSchoolMonths = 10; // September to June

    // 3. Calculation of the 8 indicators
    // ELECTRICITY
    let resElecYear = elecBase * 12 * seasonalityElecYear;
    let resElecPeriod = elecBase * activeSchoolMonths * seasonalityElecPeriod;

    // WATER
    let resWaterYear = waterBase * 12 * seasonalityWaterYear;
    let resWaterPeriod = waterBase * activeSchoolMonths; // No summer seasonality added

    // OFFICE SUPPLIES
    let resSupYear = (supBase * activeSchoolMonths) + (supBase * 2 * 0.1); // Summer is only 10%
    let resSupPeriod = supBase * activeSchoolMonths;

    // CLEANING PRODUCTS
    let resCleanYear = (cleanBase * activeSchoolMonths) + (cleanBase * 2 * 0.3); // Summer uses 30% for deep cleaning
    let resCleanPeriod = cleanBase * activeSchoolMonths;

    // 4. Display results on the web (rounded to 2 decimals)
    document.getElementById('results').style.display = 'block';
    
    document.getElementById('res-elec-year').innerText = resElecYear.toFixed(2);
    document.getElementById('res-elec-period').innerText = resElecPeriod.toFixed(2);
    
    document.getElementById('res-water-year').innerText = resWaterYear.toFixed(2);
    document.getElementById('res-water-period').innerText = resWaterPeriod.toFixed(2);
    
    document.getElementById('res-sup-year').innerText = resSupYear.toFixed(2);
    document.getElementById('res-sup-period').innerText = resSupPeriod.toFixed(2);
    
    document.getElementById('res-clean-year').innerText = resCleanYear.toFixed(2);
    document.getElementById('res-clean-period').innerText = resCleanPeriod.toFixed(2);

    // 5. Calculate the 30% Reduction Plan
    const reductionFactor = 0.70; // Keeping 70% means a 30% reduction
    
    document.getElementById('obj-elec').innerText = (resElecYear * reductionFactor).toFixed(2);
    document.getElementById('obj-water').innerText = (resWaterYear * reductionFactor).toFixed(2);
    document.getElementById('obj-sup').innerText = (resSupYear * reductionFactor).toFixed(2);
    document.getElementById('obj-clean').innerText = (resCleanYear * reductionFactor).toFixed(2);
}
