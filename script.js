 function calcularConsums() {
    let elecBase = parseFloat(document.getElementById('elec-base').value) || 0;
    let waterBase = parseFloat(document.getElementById('water-base').value) || 0;
    let supBase = parseFloat(document.getElementById('supplies-base').value) || 0;
    let cleanBase = parseFloat(document.getElementById('cleaning-base').value) || 0;

    document.getElementById('base-e-esc').innerText = Math.round(elecBase * 10).toLocaleString();
    document.getElementById('base-e-nat').innerText = Math.round(elecBase * 12).toLocaleString();
    document.getElementById('base-w-esc').innerText = Math.round(waterBase * 10).toLocaleString();
    document.getElementById('base-w-nat').innerText = Math.round(waterBase * 12).toLocaleString();
    document.getElementById('base-m-esc').innerText = Math.round(supBase * 10).toLocaleString();
    document.getElementById('base-m-nat').innerText = Math.round(supBase * 12).toLocaleString();
    document.getElementById('base-c-esc').innerText = Math.round(cleanBase * 10).toLocaleString();
    document.getElementById('base-c-nat').innerText = Math.round(cleanBase * 12).toLocaleString();

    const costKWh = 0.25;
    const costLitre = 0.002;
    const ipcAnual = 1.03;

    const weights = {
        w: [12, 6, 5, 4, 3], e: [10, 7, 5, 5, 3],
        m: [10, 8, 5, 4, 3], c: [10, 8, 5, 4, 3]
    };

    const getPct = (prefix) => {
        let totalPct = 0;
        for(let i=1; i<=5; i++) {
            let slider = document.getElementById(`${prefix}-act${i}`);
            let val = parseFloat(slider.value) || 0;
            document.getElementById(`val-${prefix}-act${i}`).innerText = val + '%';
            slider.style.background = `linear-gradient(90deg, #10b981 ${val}%, #cbd5e1 ${val}%)`;
            totalPct += (val / 100) * weights[prefix][i-1];
        }
        document.getElementById(`${prefix}-total-pct`).innerText = totalPct.toFixed(1);
        return totalPct;
    };

    let wPct = getPct('w'), ePct = getPct('e'), mPct = getPct('m'), cPct = getPct('c');

    const omplirTaula = (idPrefix, unitatsAnuals, preu, pctEstalvi, tipus) => {
        let costY3 = 0;
        for(let i = 0; i <= 3; i++) {
            let red = (pctEstalvi / 3) * i;
            let finalVol = unitatsAnuals * (1 - red / 100);
            let finalCost = (tipus === 'consum' ? finalVol * preu : unitatsAnuals * (1 - red / 100)) * Math.pow(ipcAnual, i);

            document.getElementById(idPrefix+'-y'+i+'-cost').innerText = Math.round(finalCost).toLocaleString() + ' €';
            if(i > 0) {
                let textRed = tipus === 'consum' ? Math.round(unitatsAnuals - finalVol).toLocaleString() + (idPrefix.includes('water') ? ' L' : ' kWh') : Math.round((unitatsAnuals * Math.pow(ipcAnual, i)) - finalCost).toLocaleString() + ' €';
                document.getElementById(idPrefix+'-y'+i+'-red').innerText = textRed;
            }
            if(i === 3) costY3 = finalCost;
        }
        return costY3;
    };

    let cY3Elec = omplirTaula('elec', elecBase*12, costKWh, ePct, 'consum');
    let cY3Water = omplirTaula('water', waterBase*12, costLitre, wPct, 'consum');
    let cY3Sup = omplirTaula('sup', supBase*12, 1, mPct, 'diners');
    let cY3Clean = omplirTaula('clean', cleanBase*12, 1, cPct, 'diners');

    let inercia = (elecBase*12*costKWh + waterBase*12*costLitre + supBase*12 + cleanBase*12) * Math.pow(ipcAnual, 3);
    let totalProjecte = cY3Elec + cY3Water + cY3Sup + cY3Clean;

    document.getElementById('estalvi-euros').innerText = Math.round(inercia - totalProjecte).toLocaleString() + ' €';
    document.getElementById('estalvi-co2').innerText = Math.round((elecBase*12 * (ePct/100)) * 0.25).toLocaleString() + ' Kg';

    document.getElementById('results').style.display = 'block';
    document.getElementById('btn-pdf').style.display = 'flex';
}

function generarPDF() {
    // Obrim totes les explicacions automàticament just abans d'imprimir
    document.querySelectorAll('details').forEach(d => d.open = true);

    setTimeout(() => {
        window.print();
    }, 300);
}