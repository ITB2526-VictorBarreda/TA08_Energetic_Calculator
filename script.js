function calcularConsums() {
    if (!document.getElementById('elec-base')) return;

    let elecBase = parseFloat(document.getElementById('elec-base').value) || 0;
    let waterBase = parseFloat(document.getElementById('water-base').value) || 0;
    let supBase = parseFloat(document.getElementById('supplies-base').value) || 0;
    let cleanBase = parseFloat(document.getElementById('cleaning-base').value) || 0;

    let elecYear = 0, elecPeriod = 0;
    let waterYear = 0, waterPeriod = 0;
    let supYear = 0, supPeriod = 0;
    let cleanYear = 0, cleanPeriod = 0;

    // 1. Càlcul normalitzat (Estacionalitat)
    for (let month = 1; month <= 12; month++) {
        let elecFactor = 1.0, waterFactor = 1.0, supFactor = 1.0, cleanFactor = 1.0;

        if (month === 8) { // Agost
            elecFactor = 0.15; waterFactor = 0.10; supFactor = 0.0; cleanFactor = 0.10;
        } else if (month === 7) { // Juliol
            elecFactor = 0.8; waterFactor = 0.9; supFactor = 0.2; cleanFactor = 0.8;
        } else if (month === 12 || month === 1 || month === 2) { // Hivern
            elecFactor = 1.3;
        } else if (month === 9) { // Setembre
            supFactor = 2.0; cleanFactor = 1.2;
        }

        elecYear += elecBase * elecFactor;
        waterYear += waterBase * waterFactor;
        supYear += supBase * supFactor;
        cleanYear += cleanBase * cleanFactor;

        // Període lectiu
        if (month !== 7 && month !== 8) {
            elecPeriod += elecBase * elecFactor;
            waterPeriod += waterBase * waterFactor;
            supPeriod += supBase * supFactor;
            cleanPeriod += cleanBase * cleanFactor;
        }
    }

    // 2. Càlcul de Fuites basat en la realitat de les factures
    // S'estima un 25% de fuita estructural (basat en els 104 m³ d'estiu del JSON/Factures)
    let waterFuitaYear = waterYear * 0.25;
    // Assumim que els PCs encesos de nit suposen el 15% del total elèctric
    let elecFantasmaYear = elecYear * 0.15;

    // --- RENDERITZAT ---
    const resultsSection = document.getElementById('results');
    if (resultsSection) resultsSection.style.display = 'block';

    const updateElement = (id, value, suffix) => {
        const el = document.getElementById(id);
        if (el) el.innerText = Math.round(value).toLocaleString() + (suffix ? ' ' + suffix : '');
    };

    updateElement('res-elec-year', elecYear, 'kWh');
    updateElement('res-elec-period', elecPeriod, 'kWh');
    updateElement('res-water-year', waterYear, 'L');
    updateElement('res-water-period', waterPeriod, 'L');
    updateElement('res-sup-year', supYear, '€');
    updateElement('res-sup-period', supPeriod, '€');
    updateElement('res-clean-year', cleanYear, '€');
    updateElement('res-clean-period', cleanPeriod, '€');

    updateElement('anomalia-water', waterFuitaYear, 'L');
    updateElement('anomalia-elec', elecFantasmaYear, 'kWh');

    // 3. Objectius del Pla (Reducció)
    // Aigua: Eliminem el 25% de fuites + 5% estalvi d'aixetes temporitzades
    let objWater = waterYear - waterFuitaYear - (waterYear * 0.05);
    // Llum: Eliminem consum fantasma (15%) + estalvi del 15% amb plaques solars al CPD
    let objElec = elecYear - elecFantasmaYear - (elecYear * 0.15);

    let objSup = supYear * 0.70;
    let objClean = cleanYear * 0.70;

    updateElement('obj-water', objWater, '');
    updateElement('obj-elec', objElec, '');
    updateElement('obj-sup', objSup, '');
    updateElement('obj-clean', objClean, '');

    // 4. Impacte Global i Retorn Econòmic/Ecològic
    const estalviElec = elecYear - objElec;
    const estalviAigua = waterYear - objWater;
    const estalviMaterial = supYear - objSup;
    const estalviNeteja = cleanYear - objClean;

    const eurosEstalviats = (estalviElec * 0.25) + (estalviAigua * 0.002) + estalviMaterial + estalviNeteja;
    const co2Estalviat = estalviElec * 0.25;

    updateElement('estalvi-euros', eurosEstalviats, '€');
    updateElement('estalvi-co2', co2Estalviat, 'Kg');
}