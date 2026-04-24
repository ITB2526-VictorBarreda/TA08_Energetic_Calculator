let graficConsum = null;
let filtreActual = 'tots';

function filtrarGrafic(tipus, boto) {
    filtreActual = tipus;

    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    boto.classList.add('active');

    if (!graficConsum) return;

    let mostrarTots = (tipus === 'tots');

    graficConsum.setDatasetVisibility(0, mostrarTots || tipus === 'llum');
    graficConsum.setDatasetVisibility(1, mostrarTots || tipus === 'llum');

    graficConsum.setDatasetVisibility(2, mostrarTots || tipus === 'aigua');
    graficConsum.setDatasetVisibility(3, mostrarTots || tipus === 'aigua');

    graficConsum.setDatasetVisibility(4, mostrarTots || tipus === 'mat');
    graficConsum.setDatasetVisibility(5, mostrarTots || tipus === 'mat');

    graficConsum.setDatasetVisibility(6, mostrarTots || tipus === 'net');
    graficConsum.setDatasetVisibility(7, mostrarTots || tipus === 'net');

    graficConsum.update();
}

function restaurarDadesBase() {
    document.getElementById('elec-base').value = 12000;
    document.getElementById('water-base').value = 72000;
    document.getElementById('supplies-base').value = 300;
    document.getElementById('cleaning-base').value = 750;

    ['elec-base', 'water-base', 'supplies-base', 'cleaning-base'].forEach(id => {
        document.getElementById(id).setCustomValidity("");
    });

    calcularConsums();

    let btnBase = document.getElementById('btn-calc-base');
    if (btnBase) {
        btnBase.innerHTML = '🪄 CALCULATE NEW IMPACT';
        btnBase.style.backgroundColor = 'var(--eco-primary)';
    }
}

function validarInput(element) {
    let valor = parseFloat(element.value);
    if (element.value === "" || isNaN(valor) || valor < 0) {
        element.setCustomValidity("Please enter a real and positive number.");
    } else {
        element.setCustomValidity("");
    }
    element.reportValidity();
}

function marcarCanvis() {
    let btnBase = document.getElementById('btn-calc-base');
    if (btnBase) {
        btnBase.innerHTML = '⚠️ CALCULATE NEW IMPACT';
        btnBase.style.backgroundColor = '#d97706';
        btnBase.style.color = 'white';
    }
}

function actualitzarGrafic(valLlumBase, pctLlum, valAigBase, pctAig, valMatBase, pctMat, valNetBase, pctNet) {
    const ctx = document.getElementById('graficConsum').getContext('2d');
    const mesosBase = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const varLlum = [1.2, 1.2, 1.1, 1.0, 1.0, 0.9, 0.2, 0.1, 0.9, 1.0, 1.1, 1.2];
    const varAigua = [1.0, 1.0, 1.0, 1.1, 1.2, 1.2, 0.3, 0.1, 1.0, 1.0, 1.0, 1.0];
    const varMat = [1.5, 1.0, 1.0, 1.0, 1.0, 0.8, 0.1, 0.1, 1.5, 1.0, 1.0, 1.0];
    const varNet = [1.0, 1.0, 1.0, 1.0, 1.0, 1.2, 0.2, 0.2, 1.2, 1.0, 1.0, 1.0];

    let mesos = [];
    let dLlumBase = [], dLlumProj = [];
    let dAiguaBase = [], dAiguaProj = [];
    let dMatBase = [], dMatProj = [];
    let dNetBase = [], dNetProj = [];

    for (let any = 0; any < 3; any++) {
        let anyText = 2026 + any;
        let fraccioEstalvi = (any + 1) / 3;

        for (let m = 0; m < 12; m++) {
            mesos.push(mesosBase[m] + " '" + anyText.toString().slice(-2));

            let lB = valLlumBase * varLlum[m];
            let aB = valAigBase * varAigua[m];
            let mB = valMatBase * varMat[m];
            let nB = valNetBase * varNet[m];

            dLlumBase.push(lB);
            dAiguaBase.push(aB);
            dMatBase.push(mB);
            dNetBase.push(nB);

            dLlumProj.push(lB * (1 - (pctLlum / 100) * fraccioEstalvi));
            dAiguaProj.push(aB * (1 - (pctAig / 100) * fraccioEstalvi));
            dMatProj.push(mB * (1 - (pctMat / 100) * fraccioEstalvi));
            dNetProj.push(nB * (1 - (pctNet / 100) * fraccioEstalvi));
        }
    }

    if (graficConsum) {
        graficConsum.data.labels = mesos;
        graficConsum.data.datasets[0].data = dLlumBase;
        graficConsum.data.datasets[1].data = dLlumProj;
        graficConsum.data.datasets[2].data = dAiguaBase;
        graficConsum.data.datasets[3].data = dAiguaProj;
        graficConsum.data.datasets[4].data = dMatBase;
        graficConsum.data.datasets[5].data = dMatProj;
        graficConsum.data.datasets[6].data = dNetBase;
        graficConsum.data.datasets[7].data = dNetProj;
        graficConsum.update();
    } else {
        graficConsum = new Chart(ctx, {
            type: 'line',
            data: {
                labels: mesos,
                datasets: [
                    { label: '⚡ Electricity (Base)', data: dLlumBase, borderColor: 'rgba(234, 179, 8, 0.3)', borderDash: [5, 5], tension: 0.4, yAxisID: 'yLlum' },
                    { label: '⚡ Electricity (Measures)', data: dLlumProj, borderColor: '#eab308', backgroundColor: 'rgba(234, 179, 8, 0.1)', fill: true, tension: 0.4, yAxisID: 'yLlum' },

                    { label: '💧 Water (Base)', data: dAiguaBase, borderColor: 'rgba(59, 130, 246, 0.3)', borderDash: [5, 5], tension: 0.4, yAxisID: 'yAigua' },
                    { label: '💧 Water (Measures)', data: dAiguaProj, borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true, tension: 0.4, yAxisID: 'yAigua' },

                    { label: '📦 Supplies (Base)', data: dMatBase, borderColor: 'rgba(168, 85, 247, 0.3)', borderDash: [5, 5], tension: 0.4, yAxisID: 'yEuros' },
                    { label: '📦 Supplies (Measures)', data: dMatProj, borderColor: '#a855f7', backgroundColor: 'rgba(168, 85, 247, 0.1)', fill: true, tension: 0.4, yAxisID: 'yEuros' },

                    { label: '🧹 Hygiene (Base)', data: dNetBase, borderColor: 'rgba(20, 184, 166, 0.3)', borderDash: [5, 5], tension: 0.4, yAxisID: 'yEuros' },
                    { label: '🧹 Hygiene (Measures)', data: dNetProj, borderColor: '#14b8a6', backgroundColor: 'rgba(20, 184, 166, 0.1)', fill: true, tension: 0.4, yAxisID: 'yEuros' }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: {
                        display: false // Hides the legend above the chart
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                let value = Math.round(context.parsed.y).toLocaleString();
                                if (label.includes('Electricity')) return label + ': ' + value + ' kWh';
                                if (label.includes('Water')) return label + ': ' + value + ' L';
                                return label + ': ' + value + ' €';
                            }
                        }
                    }
                },
                scales: {
                    x: { ticks: { maxTicksLimit: 12 } },
                    yLlum: {
                        type: 'linear', display: 'auto', position: 'left',
                        title: { display: true, text: 'Electricity (kWh)' }, beginAtZero: false
                    },
                    yAigua: {
                        type: 'linear', display: 'auto', position: 'right',
                        title: { display: true, text: 'Water (Liters)' },
                        beginAtZero: false, grid: { drawOnChartArea: false }
                    },
                    yEuros: {
                        type: 'linear', display: 'auto', position: 'right',
                        title: { display: true, text: 'Supplies & Hygiene (€)' },
                        beginAtZero: false, grid: { drawOnChartArea: false }
                    }
                }
            }
        });

        let btnInicial = document.querySelector('.filter-btn.active');
        if(btnInicial) filtrarGrafic(filtreActual, btnInicial);
    }
}

function calcularConsums() {
    let btnBase = document.getElementById('btn-calc-base');
    if (btnBase && btnBase.innerHTML === '⚠️ CALCULATE NEW IMPACT') {
        btnBase.innerHTML = '✅ DATA UPDATED';
        btnBase.style.backgroundColor = 'var(--eco-primary)';
        setTimeout(() => { if (btnBase.innerHTML === '✅ DATA UPDATED') btnBase.innerHTML = '🪄 CALCULATE NEW IMPACT'; }, 3000);
    }

    let elecBase = Math.abs(parseFloat(document.getElementById('elec-base').value) || 0);
    let waterBase = Math.abs(parseFloat(document.getElementById('water-base').value) || 0);
    let supBase = Math.abs(parseFloat(document.getElementById('supplies-base').value) || 0);
    let cleanBase = Math.abs(parseFloat(document.getElementById('cleaning-base').value) || 0);

    // Update the figures in the results box below
    document.getElementById('base-e-esc').innerText = Math.round(elecBase * 10).toLocaleString();
    document.getElementById('base-e-nat').innerText = Math.round(elecBase * 12).toLocaleString();
    document.getElementById('base-w-esc').innerText = Math.round(waterBase * 10).toLocaleString();
    document.getElementById('base-w-nat').innerText = Math.round(waterBase * 12).toLocaleString();
    document.getElementById('base-m-esc').innerText = Math.round(supBase * 10).toLocaleString();
    document.getElementById('base-m-nat').innerText = Math.round(supBase * 12).toLocaleString();
    document.getElementById('base-c-esc').innerText = Math.round(cleanBase * 10).toLocaleString();
    document.getElementById('base-c-nat').innerText = Math.round(cleanBase * 12).toLocaleString();

    const costKWh = 0.25, costLitre = 0.002, ipcAnual = 1.03;
    const weights = { w: [12, 6, 5, 4, 3], e: [10, 7, 5, 5, 3], m: [10, 8, 5, 4, 3], c: [10, 8, 5, 4, 3] };

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

    actualitzarGrafic(
        elecBase, ePct,
        waterBase, wPct,
        supBase, mPct,
        cleanBase, cPct
    );
}

// Automatic initialization when the web opens
window.onload = () => {
    restaurarDadesBase();
};