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

        if (month === 8) { elecFactor = 0.15; waterFactor = 0.10; supFactor = 0.0; cleanFactor = 0.10; }
        else if (month === 7) { elecFactor = 0.8; waterFactor = 0.9; supFactor = 0.2; cleanFactor = 0.8; }
        else if (month === 12 || month === 1 || month === 2) { elecFactor = 1.3; }
        else if (month === 9) { supFactor = 2.0; cleanFactor = 1.2; }

        elecYear += elecBase * elecFactor;
        waterYear += waterBase * waterFactor;
        supYear += supBase * supFactor;
        cleanYear += cleanBase * cleanFactor;

        if (month !== 7 && month !== 8) {
            elecPeriod += elecBase * elecFactor;
            waterPeriod += waterBase * waterFactor;
            supPeriod += supBase * supFactor;
            cleanPeriod += cleanBase * cleanFactor;
        }
    }

    // --- RENDERITZAT BÀSIC (Secció 2) ---
    const resultsSection = document.getElementById('results');
    if (resultsSection) resultsSection.style.display = 'block';

    const updateElement = (id, value, suffix) => {
        const el = document.getElementById(id);
        if (el) el.innerText = Math.round(value).toLocaleString() + (suffix ? ' ' + suffix : '');
    };

    updateElement('res-elec-year', elecYear, 'kWh'); updateElement('res-elec-period', elecPeriod, 'kWh');
    updateElement('res-water-year', waterYear, 'L'); updateElement('res-water-period', waterPeriod, 'L');
    updateElement('res-sup-year', supYear, '€'); updateElement('res-sup-period', supPeriod, '€');
    updateElement('res-clean-year', cleanYear, '€'); updateElement('res-clean-period', cleanPeriod, '€');

    // --- CÀLCUL D'ACCIONS (Sliders) ---
    const calcularSliders = (prefix) => {
        let act1 = parseFloat(document.getElementById(`${prefix}-act1`).value) || 0;
        let act2 = parseFloat(document.getElementById(`${prefix}-act2`).value) || 0;
        let act3 = parseFloat(document.getElementById(`${prefix}-act3`).value) || 0;

        // Actualitzar els labels al costat del slider
        document.getElementById(`val-${prefix}-act1`).innerText = act1 + '%';
        document.getElementById(`val-${prefix}-act2`).innerText = act2 + '%';
        document.getElementById(`val-${prefix}-act3`).innerText = act3 + '%';

        let totalTarget = act1 + act2 + act3;
        document.getElementById(`${prefix}-total-pct`).innerText = totalTarget;

        return totalTarget;
    };

    let wPct = calcularSliders('w');
    let ePct = calcularSliders('e');
    let mPct = calcularSliders('m');
    let cPct = calcularSliders('c');

    // --- CÀLCUL TAULES 3 ANYS (IPC +3%) ---
    const costKWh = 0.25;
    const costLitre = 0.002;
    const ipcAnual = 1.03;

    const omplirTaulaProjeccio = (prefix, volumBase, preuUnitat, targetPct) => {
        let costFinalAny3 = 0;
        let unitat = (prefix === 'elec') ? 'kWh' : (prefix === 'water') ? 'L' : '€';

        // Any 0 (Base)
        updateElement(`${prefix}-y0-cons`, volumBase, unitat);
        updateElement(`${prefix}-y0-cost`, volumBase * preuUnitat, '€');

        // Distribuïm l'objectiu en 3 anys (1/3 per any)
        for (let any = 1; any <= 3; any++) {
            let percentatgeAny = (targetPct / 3) * any;

            let factorReduccio = 1 - (percentatgeAny / 100);
            let factorIpc = Math.pow(ipcAnual, any);

            let volumObjectiu = volumBase * factorReduccio;
            let reduccioAssolida = volumBase - volumObjectiu;
            let pressupostProjectat = volumObjectiu * preuUnitat * factorIpc;

            updateElement(`${prefix}-y${any}-cons`, volumObjectiu, unitat);
            updateElement(`${prefix}-y${any}-cost`, pressupostProjectat, '€');
            updateElement(`${prefix}-y${any}-red`, reduccioAssolida, unitat);

            if (any === 3) costFinalAny3 = pressupostProjectat;
        }
        return costFinalAny3;
    };

    let costRealY3Elec = omplirTaulaProjeccio('elec', elecYear, costKWh, ePct);
    let costRealY3Water = omplirTaulaProjeccio('water', waterYear, costLitre, wPct);
    let costRealY3Sup = omplirTaulaProjeccio('sup', supYear, 1, mPct);
    let costRealY3Clean = omplirTaulaProjeccio('clean', cleanYear, 1, cPct);

    // --- IMPACTE GLOBAL (Estalvi real Any 3 vs Inèrcia IPC) ---
    let pressupostBaseTotal = (elecYear * costKWh) + (waterYear * costLitre) + supYear + cleanYear;
    let pressupostInercialAny3 = pressupostBaseTotal * Math.pow(ipcAnual, 3);
    let pressupostAssolitAny3 = costRealY3Elec + costRealY3Water + costRealY3Sup + costRealY3Clean;

    let eurosEstalviatsReals = pressupostInercialAny3 - pressupostAssolitAny3;
    let co2Estalviat = (elecYear * (ePct/100)) * 0.25; // CO2 calculat només de l'estalvi elèctric assolit

    updateElement('estalvi-euros', eurosEstalviatsReals, '€');
    updateElement('estalvi-co2', co2Estalviat, 'Kg CO2');
}