(() => {
    // Catálogo oficial ordenado do MENOR ao MAIOR salário inicial (Volts Go por último como autônomo)
    const PROFESSIONS_CATALOG = [
        {
            id: 1,
            name: 'Coletor de Lixo',
            salaryMin: 1821,
            salaryMax: 4250,
            autonomo: false,
            sede: 'Depósito Municipal — Willowfield',
            desc: 'Coleta urbana, triagem de resíduos e limpeza dos bairros de Los Santos. Trabalho em equipe com rotas automáticas e contratos comerciais.',
            ranks: [
                'Auxiliar de Coleta',
                'Coletor Urbano',
                'Operador de Triagem',
                'Especialista Ambiental',
                'Coordenador de Rota',
                'Inspetor de Gestão de Resíduos'
            ],
            icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`
        },
        {
            id: 2,
            name: 'Entregador',
            salaryMin: 1900,
            salaryMax: 4850,
            autonomo: false,
            sede: 'Centro de Distribuição — Ocean Docks',
            desc: 'Logística de encomendas residenciais, comerciais e frágeis pela cidade. Exige organização de rota, pontualidade e cuidado com pacotes sensíveis.',
            ranks: [
                'Entregador Local',
                'Entregador Expresso',
                'Agente de Logística',
                'Especialista em Cargas Sensíveis',
                'Supervisor de Distribuição',
                'Diretor Operacional de Entregas'
            ],
            icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`
        },
        {
            id: 4,
            name: 'Mecânico',
            salaryMin: 2150,
            salaryMax: 6100,
            autonomo: false,
            sede: 'Oficina Central — Idlewood',
            desc: 'Inspeção técnica, diagnóstico de defeitos, troca de peças e manutenção preventiva de veículos. A qualidade do reparo define sua reputação.',
            ranks: [
                'Aprendiz de Oficina',
                'Mecânico Auxiliar',
                'Mecânico Pleno',
                'Especialista em Diagnóstico',
                'Mecânico Sênior',
                'Mestre de Oficina'
            ],
            icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`
        },
        {
            id: 6,
            name: 'Minerador',
            salaryMin: 2200,
            salaryMax: 6900,
            autonomo: false,
            sede: 'Pedreira Hunter Quarry — Bone County',
            desc: 'Exploração geológica, análise de amostras e extração de minerais industriais. Alta remuneração nos cargos superiores mediante técnica e segurança.',
            ranks: [
                'Ajudante de Mina',
                'Minerador de Superfície',
                'Operador de Extração',
                'Técnico de Jazida',
                'Especialista em Mineração',
                'Engenheiro de Operações'
            ],
            icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4l6 6"/><path d="M3 21l9-9"/><path d="M12 12l4-4"/><path d="M7 5c3-2 7-2 10 1s3 7 1 10"/></svg>`
        },
        {
            id: 3,
            name: 'Caminhoneiro',
            salaryMin: 2350,
            salaryMax: 6600,
            autonomo: false,
            sede: 'Pátio de Cargas Pesadas — Ocean Docks',
            desc: 'Transporte rodoviário de cargas pesadas, refrigeradas e especiais por todo o estado. Exige inspeção pré-viagem, controle de combustível e atenção na pista.',
            ranks: [
                'Motorista de Carga Leve',
                'Motorista Regional',
                'Carreteiro Rodoviário',
                'Condutor de Cargas Especiais',
                'Mestre de Frota Pesada',
                'Comandante Logístico'
            ],
            icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`
        },
        {
            id: 5,
            name: 'Volts Go (Aplicativo)',
            salaryMin: 0,
            salaryMax: 0,
            autonomo: true,
            sede: 'Aplicativo Volts Go (Celular)',
            desc: 'Parceiro autônomo de transporte urbano por aplicativo. Ganhos por corrida concluída, categorias executivas, metas dinâmicas e avaliações dos passageiros.',
            ranks: [
                'Parceiro Urbano',
                'Parceiro Verificado',
                'Motorista Conforto',
                'Motorista Executivo',
                'Parceiro Corporativo',
                'Embaixador Volts VIP'
            ],
            icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`
        }
    ];

    const state = {
        activeTab: 'agencia',
        selectedProfId: 1,
        player: {
            name: 'Cidadão',
            bank: 0,
            profId: 0,
            cargoName: '-',
            level: 1,
            cargo: 1,
            xp: 0,
            xpNext: 60,
            bonusExpPct: 0,
            salary: 0,
            reputation: 60,
            servCargo: 0,
            servTotal: 0,
            totalWorkSec: 0,
            cycleOnlineSec: 0,
            cycleWorkSec: 0,
            warnings: 0,
            canPromote: false,
            promoNivelMin: 4,
            promoServMin: 10,
            promoRepMin: 65,
            promoReason: ''
        },
        blocksMinutes: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
        history: [],
        feedbackTimer: null
    };

    const el = {
        headerPlayerName: document.getElementById('headerPlayerName'),
        headerPlayerBank: document.getElementById('headerPlayerBank'),
        btnClosePref: document.getElementById('btnClosePref'),
        prefFeedback: document.getElementById('prefFeedback'),

        navTabs: document.querySelectorAll('.nav-tab'),
        panelAgencia: document.getElementById('panelAgencia'),
        panelCarteira: document.getElementById('panelCarteira'),
        panelHistorico: document.getElementById('panelHistorico'),

        jobsList: document.getElementById('jobsList'),
        detailHeaderTitle: document.getElementById('detailHeaderTitle'),
        detailIcon: document.getElementById('detailIcon'),
        detailName: document.getElementById('detailName'),
        detailBadge: document.getElementById('detailBadge'),
        detailDesc: document.getElementById('detailDesc'),
        detailSede: document.getElementById('detailSede'),
        detailSalary: document.getElementById('detailSalary'),
        detailRanks: document.getElementById('detailRanks'),
        btnHireJob: document.getElementById('btnHireJob'),
        detailFooterNote: document.getElementById('detailFooterNote'),

        walletUnemployed: document.getElementById('walletUnemployed'),
        walletActive: document.getElementById('walletActive'),
        walletProfName: document.getElementById('walletProfName'),
        walletCargoName: document.getElementById('walletCargoName'),
        walletRep: document.getElementById('walletRep'),
        walletLevelLabel: document.getElementById('walletLevelLabel'),
        walletXpLabel: document.getElementById('walletXpLabel'),
        walletXpBar: document.getElementById('walletXpBar'),
        walletCycleBlock: document.getElementById('walletCycleBlock'),
        walletCycleLabel: document.getElementById('walletCycleLabel'),
        walletCycleBar: document.getElementById('walletCycleBar'),
        walletSalaryRef: document.getElementById('walletSalaryRef'),
        walletPerfBonus: document.getElementById('walletPerfBonus'),
        walletAutonomoNote: document.getElementById('walletAutonomoNote'),
        walletHours: document.getElementById('walletHours'),
        walletServices: document.getElementById('walletServices'),
        walletWarnBox: document.getElementById('walletWarnBox'),
        walletWarnings: document.getElementById('walletWarnings'),

        reqNivel: document.getElementById('reqNivel'),
        reqServicos: document.getElementById('reqServicos'),
        reqRep: document.getElementById('reqRep'),
        promoStatusMsg: document.getElementById('promoStatusMsg'),
        btnRequestPromo: document.getElementById('btnRequestPromo'),

        historyEmpty: document.getElementById('historyEmpty'),
        historyGrid: document.getElementById('historyGrid')
    };

    function emitToServer(eventName, payload = '') {
        if (typeof cef !== 'undefined' && typeof cef.emit === 'function') {
            cef.emit(eventName, String(payload));
            return true;
        }
        return false;
    }

    function formatBRL(value) {
        const num = Number(value) || 0;
        return `R$ ${num.toLocaleString('pt-BR')}`;
    }

    function formatHours(seconds) {
        const safe = Math.max(0, Number(seconds) || 0);
        const h = Math.floor(safe / 3600);
        const m = Math.floor((safe % 3600) / 60);
        return `${h}h ${String(m).padStart(2, '0')}m`;
    }

    function getProfessionById(id) {
        return PROFESSIONS_CATALOG.find((p) => p.id === Number(id)) || null;
    }

    function getJobStatus(profId) {
        if (state.player.profId === profId) {
            return { key: 'current', label: 'EMPREGO ATUAL', cls: 'is-current' };
        }

        const blockMins = Number(state.blocksMinutes[profId]) || 0;
        if (blockMins > 0) {
            const h = Math.floor(blockMins / 60);
            const m = blockMins % 60;
            const tempo = h > 0 ? `${h}h ${m}m` : `${m}m`;
            return { key: 'blocked', label: `BLOQUEADO (${tempo})`, cls: 'is-blocked' };
        }

        return { key: 'available', label: 'DISPONÍVEL', cls: 'is-available' };
    }

    function showFeedback(type, message) {
        if (!el.prefFeedback) return;

        if (state.feedbackTimer) clearTimeout(state.feedbackTimer);

        el.prefFeedback.className = `pref-feedback ${type || 'warning'}`;
        el.prefFeedback.textContent = message;
        el.prefFeedback.classList.remove('hidden');

        state.feedbackTimer = setTimeout(() => {
            el.prefFeedback.classList.add('hidden');
        }, 5000);
    }

    /* =========================================================
       RENDERIZAÇÃO: ABA 1 (AGÊNCIA DE EMPREGOS)
       ========================================================= */

    function renderJobsList() {
        if (!el.jobsList) return;
        el.jobsList.innerHTML = '';

        PROFESSIONS_CATALOG.forEach((prof) => {
            const status = getJobStatus(prof.id);
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `job-row${state.selectedProfId === prof.id ? ' selected' : ''}`;
            btn.setAttribute('role', 'option');
            btn.setAttribute('aria-selected', String(state.selectedProfId === prof.id));

            const salaryText = prof.autonomo
                ? 'Autônomo • Por Corrida'
                : `${formatBRL(prof.salaryMin)}/mês (ref.)`;

            btn.innerHTML = `
                <div class="job-row-left">
                    <div class="job-icon">${prof.icon}</div>
                    <div class="job-row-info">
                        <span class="job-row-name">${prof.name}</span>
                        <span class="job-row-sal">${salaryText}</span>
                    </div>
                </div>
                <span class="status-pill ${status.cls}">${status.label}</span>
            `;

            btn.addEventListener('click', () => {
                state.selectedProfId = prof.id;
                renderJobsList();
                renderJobDetails();
            });

            el.jobsList.appendChild(btn);
        });
    }

    function renderJobDetails() {
        const prof = getProfessionById(state.selectedProfId) || PROFESSIONS_CATALOG[0];
        if (!prof) return;

        const status = getJobStatus(prof.id);

        el.detailHeaderTitle.textContent = `DETALHES DA CARREIRA — ${prof.name.toUpperCase()}`;
        el.detailIcon.innerHTML = prof.icon;
        el.detailName.textContent = prof.name;
        el.detailBadge.className = `status-pill ${status.cls}`;
        el.detailBadge.textContent = status.label;
        el.detailDesc.textContent = prof.desc;
        el.detailSede.textContent = prof.sede;

        if (prof.autonomo) {
            el.detailSalary.textContent = 'Parceiro Autônomo (ganhos por corrida + categorias e metas)';
        } else {
            el.detailSalary.textContent = `Inicial: ${formatBRL(prof.salaryMin)}/mês • Teto Cargo 6: ${formatBRL(prof.salaryMax)}/mês`;
        }

        el.detailRanks.innerHTML = prof.ranks
            .map((r, idx) => `<span class="rank-chip">C${idx + 1}: ${r}</span>`)
            .join('');

        if (status.key === 'current') {
            el.btnHireJob.disabled = true;
            el.btnHireJob.textContent = 'VÍNCULO ATIVO NESTA PROFISSÃO';
        } else if (status.key === 'blocked') {
            el.btnHireJob.disabled = true;
            el.btnHireJob.textContent = 'RECONTRATAÇÃO BLOQUEADA (JUSTA CAUSA)';
        } else {
            el.btnHireJob.disabled = false;
            el.btnHireJob.textContent = prof.autonomo
                ? 'ATIVAR CADASTRO VOLTS GO'
                : 'ASSINAR CONTRATO E IR À SEDE';
        }

        el.detailFooterNote.textContent = prof.autonomo
            ? 'Motoristas Volts Go operam de forma autônoma pelo aplicativo no celular, sem teleporte.'
            : 'Ao assinar, você será encaminhado à sede da empresa. Rescisões são feitas no RH local.';
    }

    /* =========================================================
       RENDERIZAÇÃO: ABA 2 (CARTEIRA DE TRABALHO)
       ========================================================= */

    function renderWallet() {
        const p = state.player;
        const prof = getProfessionById(p.profId);

        if (!prof) {
            el.walletUnemployed.classList.remove('hidden');
            el.walletActive.classList.add('hidden');
            return;
        }

        el.walletUnemployed.classList.add('hidden');
        el.walletActive.classList.remove('hidden');

        el.walletProfName.textContent = prof.name;
        el.walletCargoName.textContent = `${p.cargoName} • Cargo ${p.cargo} de 6`;
        el.walletRep.textContent = `${p.reputation} / 100`;

        el.walletLevelLabel.textContent = `Nível Profissional ${p.level} / 18`;
        if (p.level >= 18) {
            el.walletXpLabel.textContent = `NÍVEL MÁXIMO • Bônus +${p.bonusExpPct}%`;
            el.walletXpBar.style.width = '100%';
        } else {
            const pctXp = p.xpNext > 0 ? Math.min(100, Math.round((p.xp / p.xpNext) * 100)) : 0;
            el.walletXpLabel.textContent = `${p.xp} / ${p.xpNext} XP • Bônus +${p.bonusExpPct}%`;
            el.walletXpBar.style.width = `${pctXp}%`;
        }

        if (prof.autonomo) {
            el.walletCycleBlock.classList.add('hidden');
            el.walletAutonomoNote.classList.remove('hidden');
            el.walletWarnBox.classList.add('hidden');
        } else {
            el.walletCycleBlock.classList.remove('hidden');
            el.walletAutonomoNote.classList.add('hidden');
            el.walletWarnBox.classList.remove('hidden');

            const onMin = Math.floor(p.cycleOnlineSec / 60);
            const workMin = Math.floor(p.cycleWorkSec / 60);
            const cyclePct = Math.min(100, Math.round((p.cycleOnlineSec / 2100) * 100));

            let perfBonus = 0;
            if (p.cycleWorkSec >= 2100) perfBonus = 30;
            else if (p.cycleWorkSec >= 1200) perfBonus = 15;

            el.walletCycleLabel.textContent = `${onMin}/35 min online • ${workMin}/35 min trabalhados`;
            el.walletCycleBar.style.width = `${cyclePct}%`;
            el.walletSalaryRef.textContent = `Salário ref. mensal: ${formatBRL(p.salary)}`;
            el.walletPerfBonus.textContent = `Bônus de desempenho atual: +${perfBonus}%`;
            el.walletWarnings.textContent = `${p.warnings} / 3`;
        }

        el.walletHours.textContent = formatHours(p.totalWorkSec);
        el.walletServices.textContent = String(p.servTotal);

        // Requisitos de Promoção
        if (p.cargo >= 6) {
            el.reqNivel.className = 'promo-req-item met';
            el.reqNivel.querySelector('.req-text').textContent = 'Cargo máximo da carreira alcançado';
            el.reqServicos.classList.add('hidden');
            el.reqRep.classList.add('hidden');
            el.promoStatusMsg.textContent = 'Você já ocupa o cargo máximo desta profissão.';
            el.btnRequestPromo.disabled = true;
            el.btnRequestPromo.textContent = 'CARGO MÁXIMO';
        } else {
            el.reqServicos.classList.remove('hidden');
            el.reqRep.classList.remove('hidden');

            const okNivel = p.level >= p.promoNivelMin;
            const okServ = p.servCargo >= p.promoServMin;
            const okRep = p.reputation >= p.promoRepMin;

            el.reqNivel.className = `promo-req-item${okNivel ? ' met' : ''}`;
            el.reqNivel.querySelector('.req-text').textContent = `Nível mínimo: ${p.level} / ${p.promoNivelMin}`;

            el.reqServicos.className = `promo-req-item${okServ ? ' met' : ''}`;
            el.reqServicos.querySelector('.req-text').textContent = `Serviços no cargo: ${p.servCargo} / ${p.promoServMin}`;

            el.reqRep.className = `promo-req-item${okRep ? ' met' : ''}`;
            el.reqRep.querySelector('.req-text').textContent = `Reputação mínima: ${p.reputation} / ${p.promoRepMin}`;

            el.btnRequestPromo.disabled = !p.canPromote;
            el.btnRequestPromo.textContent = p.canPromote ? 'SOLICITAR PROMOÇÃO AGORA' : 'REQUISITOS PENDENTES';
            el.promoStatusMsg.textContent = p.canPromote
                ? 'Todos os requisitos foram cumpridos! Você já pode subir de cargo.'
                : (p.promoReason || 'Complete os requisitos acima para liberar a promoção.');
        }
    }

    /* =========================================================
       RENDERIZAÇÃO: ABA 3 (HISTÓRICO PROFISSIONAL)
       ========================================================= */

    function renderHistory() {
        if (!state.history.length) {
            el.historyEmpty.classList.remove('hidden');
            el.historyGrid.innerHTML = '';
            return;
        }

        el.historyEmpty.classList.add('hidden');
        el.historyGrid.innerHTML = '';

        state.history.forEach((item) => {
            const prof = getProfessionById(item.profId);
            const profName = prof ? prof.name : `Profissão #${item.profId}`;
            const isActive = state.player.profId === item.profId;

            const card = document.createElement('article');
            card.className = `history-card${isActive ? ' is-active' : ''}`;
            card.innerHTML = `
                <div class="history-card-top">
                    <h3>${profName}</h3>
                    ${isActive ? '<span class="status-pill is-current">ATIVA</span>' : ''}
                </div>
                <span class="history-cargo">${item.cargoName} (Cargo ${item.cargo}/6)</span>
                <div class="history-metrics">
                    <div class="history-metric">
                        <span>Nível</span>
                        <strong>${item.level} / 18</strong>
                    </div>
                    <div class="history-metric">
                        <span>Horas Trab.</span>
                        <strong>${formatHours(item.workSec)}</strong>
                    </div>
                    <div class="history-metric">
                        <span>Serviços</span>
                        <strong>${item.services}</strong>
                    </div>
                    <div class="history-metric">
                        <span>Reputação</span>
                        <strong>${item.reputation} / 100</strong>
                    </div>
                </div>
            `;
            el.historyGrid.appendChild(card);
        });
    }

    function renderAll() {
        el.headerPlayerName.textContent = state.player.name;
        el.headerPlayerBank.textContent = formatBRL(state.player.bank);
        renderJobsList();
        renderJobDetails();
        renderWallet();
        renderHistory();
    }

    /* =========================================================
       NAVEGAÇÃO E AÇÕES DO USUÁRIO
       ========================================================= */

    function switchTab(tabName) {
        state.activeTab = tabName;

        el.navTabs.forEach((btn) => {
            const active = btn.getAttribute('data-tab') === tabName;
            btn.classList.toggle('active', active);
            btn.setAttribute('aria-selected', String(active));
        });

        el.panelAgencia.classList.toggle('active', tabName === 'agencia');
        el.panelCarteira.classList.toggle('active', tabName === 'carteira');
        el.panelHistorico.classList.toggle('active', tabName === 'historico');
    }

    el.navTabs.forEach((btn) => {
        btn.addEventListener('click', () => {
            switchTab(btn.getAttribute('data-tab'));
        });
    });

    el.btnClosePref.addEventListener('click', () => {
        emitToServer('volts:pref_close', '1');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            emitToServer('volts:pref_close', '1');
        }
    });

    el.btnHireJob.addEventListener('click', () => {
        const status = getJobStatus(state.selectedProfId);
        if (status.key !== 'available') return;

        el.btnHireJob.disabled = true;
        emitToServer('volts:pref_hire', String(state.selectedProfId));
    });

    el.btnRequestPromo.addEventListener('click', () => {
        if (!state.player.canPromote) return;

        el.btnRequestPromo.disabled = true;
        emitToServer('volts:pref_promote', '1');
    });

    /* =========================================================
       EVENTOS RECEBIDOS DO PAWN (OMP-CEF)
       ========================================================= */

    if (typeof cef !== 'undefined' && typeof cef.on === 'function') {
        cef.on('volts:pref_player', (payload) => {
            const parts = String(payload || '').split('|');
            if (parts.length < 21) return;

            state.player = {
                name: parts[0] || 'Cidadão',
                bank: Number(parts[1]) || 0,
                profId: Number(parts[2]) || 0,
                cargoName: parts[3] || '-',
                level: Number(parts[4]) || 1,
                cargo: Number(parts[5]) || 1,
                xp: Number(parts[6]) || 0,
                xpNext: Number(parts[7]) || 0,
                bonusExpPct: Number(parts[8]) || 0,
                salary: Number(parts[9]) || 0,
                reputation: Number(parts[10]) || 60,
                servCargo: Number(parts[11]) || 0,
                servTotal: Number(parts[12]) || 0,
                totalWorkSec: Number(parts[13]) || 0,
                cycleOnlineSec: Number(parts[14]) || 0,
                cycleWorkSec: Number(parts[15]) || 0,
                warnings: Number(parts[16]) || 0,
                canPromote: Number(parts[17]) === 1,
                promoNivelMin: Number(parts[18]) || 0,
                promoServMin: Number(parts[19]) || 0,
                promoRepMin: Number(parts[20]) || 0,
                promoReason: parts.slice(21).join('|') || ''
            };

            renderAll();
        });

        cef.on('volts:pref_history_clear', () => {
            state.history = [];
            renderHistory();
        });

        cef.on('volts:pref_history_item', (payload) => {
            const parts = String(payload || '').split('|');
            if (parts.length < 7) return;

            state.history.push({
                profId: Number(parts[0]) || 0,
                level: Number(parts[1]) || 1,
                cargo: Number(parts[2]) || 1,
                cargoName: parts[3] || '-',
                workSec: Number(parts[4]) || 0,
                services: Number(parts[5]) || 0,
                reputation: Number(parts[6]) || 60
            });
            renderHistory();
        });

        cef.on('volts:pref_blocks', (payload) => {
            const parts = String(payload || '').split('|');
            for (let i = 0; i < 6; i++) {
                state.blocksMinutes[i + 1] = Number(parts[i]) || 0;
            }
            renderJobsList();
            renderJobDetails();
        });

        cef.on('volts:pref_feedback', (type, message) => {
            showFeedback(String(type || 'warning'), String(message || ''));
            renderJobDetails();
        });
    }

    renderAll();
    emitToServer('volts:pref_ready', '1');
})();
