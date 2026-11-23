(() => {
    const DEFAULT_VOLUME = 0.22;
    const REQUEST_TIMEOUT_MS = 12000;
    const TIP_INTERVAL_MS = 9000;
    const MAX_SERVER_SLOTS = 50;

    const MONTHS_PT = [
        'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL',
        'MAIO', 'JUNHO', 'JULHO', 'AGOSTO',
        'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
    ];

    const PLAYLIST = [
        {
            title: 'DANADA ME LIGANDO',
            artist: 'MC Cebezinho, MC Tuto e MC Kako',
            src: './musica.mp3',
            cover: './capa.png'
        },
        {
            title: 'Lobo da Madruga',
            artist: 'MC Poze do Rodo ft. Meno K, MC Rodrigo do CN, MC Ryan SP e Bielzin',
            src: './musica2.mp3',
            cover: './capa2.png'
        },
        {
            title: "LET'S GO 5",
            artist: 'MC IG',
            src: './musica3.mp3',
            cover: './capa3.png'
        }
    ];

    const CITY_TIPS = [
        'Respeite as regras do servidor e ajude a manter a experiência de todos.',
        'Valorize a vida do seu personagem em todas as situações dentro da cidade.',
        'Construa sua história com calma; suas escolhas definem seu futuro em Los Santos.',
        'Utilize os canais de comunicação de forma coerente com a interpretação do personagem.',
        'Mantenha o respeito com todos os jogadores e com a equipe administrativa.',
        'Explore os empregos legais da cidade para conquistar seus primeiros bens.',
        'Evite atitudes antidesportivas; o bom roleplay depende da colaboração de todos.',
        'Em caso de dúvidas ou problemas, acione o suporte oficial da cidade.',
        'Dirija com prudência pelas avenidas e respeite a sinalização de trânsito.',
        'Nunca compartilhe sua senha com terceiros; a segurança da conta é sua responsabilidade.',
        'Participe dos eventos comunitários e fortaleça suas conexões na cidade.',
        'Guarde seu dinheiro no banco regularmente para evitar prejuízos desnecessários.',
        'Observe o ambiente antes de agir e tome decisões estratégicas no seu dia a dia.',
        'Denuncie qualquer irregularidade ou falha técnica pelos canais oficiais do servidor.',
        'Trabalhe em equipe, faça aliados e construa sua reputação passo a passo.',
        'Boas histórias nascem da criatividade, da imersão e do respeito mútuo.'
    ];

    const WEAK_PASSWORDS = new Set([
        '123456', '1234567', '12345678', '123456789', '1234567890',
        '654321', '987654', '987654321', '012345', '0123456',
        '000000', '111111', '222222', '333333', '444444', '555555',
        '666666', '777777', '888888', '999999',
        '123123', '112233', '121212', '102030', '123321',
        'abcdef', 'abc123', 'qwerty', 'qwerty123', 'asdfgh',
        'senha1', 'senha12', 'senha123', 'password', 'admin123',
        'voltsrp', 'volts123', 'samp123'
    ]);

    const state = {
        username: '',
        registered: false,
        loading: false,
        activeTab: 'login',
        audioEnabled: true,
        isPlaying: false,
        trackIndex: 0,
        volume: DEFAULT_VOLUME,
        lastNonZeroVolume: DEFAULT_VOLUME,
        serverOnline: true,
        playersOnline: 0,
        maxPlayers: MAX_SERVER_SLOTS,
        loadingTimer: null,
        currentTipIndex: 0,
        tipTimer: null,
        readyEmitted: false
    };

    const el = {
        bgVideo: document.getElementById('bgVideo'),

        liveClock: document.getElementById('liveClock'),
        liveDate: document.getElementById('liveDate'),

        serverStatusBox: document.getElementById('serverStatusBox'),
        serverStatusText: document.getElementById('serverStatusText'),
        playerCountText: document.getElementById('playerCountText'),

        cityTipText: document.getElementById('cityTipText'),
        cityTipCounter: document.getElementById('cityTipCounter'),
        cityTipSegments: document.getElementById('cityTipSegments'),
        btnPrevTip: document.getElementById('btnPrevTip'),
        btnNextTip: document.getElementById('btnNextTip'),

        tabLogin: document.getElementById('tabLogin'),
        tabRegister: document.getElementById('tabRegister'),
        feedbackBox: document.getElementById('feedbackBox'),

        formLogin: document.getElementById('formLogin'),
        formRegister: document.getElementById('formRegister'),

        loginUsername: document.getElementById('loginUsername'),
        regUsername: document.getElementById('regUsername'),

        loginPassword: document.getElementById('loginPassword'),
        regPassword: document.getElementById('regPassword'),
        regPasswordConfirm: document.getElementById('regPasswordConfirm'),

        rememberMe: document.getElementById('rememberMe'),
        btnForgotPass: document.getElementById('btnForgotPass'),

        btnSubmitLogin: document.getElementById('btnSubmitLogin'),
        btnSubmitRegister: document.getElementById('btnSubmitRegister'),

        playerBox: document.getElementById('playerBox'),
        musicCoverImg: document.getElementById('musicCoverImg'),
        musicTrackTitle: document.getElementById('musicTrackTitle'),
        musicTrackArtist: document.getElementById('musicTrackArtist'),
        btnPrevTrack: document.getElementById('btnPrevTrack'),
        btnPlayPause: document.getElementById('btnPlayPause'),
        btnNextTrack: document.getElementById('btnNextTrack'),
        iconPlay: document.getElementById('iconPlay'),
        iconPause: document.getElementById('iconPause'),
        btnMuteToggle: document.getElementById('btnMuteToggle'),
        iconVolOn: document.getElementById('iconVolOn'),
        iconVolOff: document.getElementById('iconVolOff'),
        volumeSlider: document.getElementById('volumeSlider'),
        bgMusic: document.getElementById('bgMusic')
    };

    /* =========================================================
       VÍDEO DE FUNDO (AUTOPLAY MUTADO + LIMPEZA SEGURA)
       ========================================================= */

    function startBackgroundVideo() {
        if (!el.bgVideo) return;

        el.bgVideo.muted = true;
        el.bgVideo.loop = true;

        const playPromise = el.bgVideo.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {});
        }
    }

    function stopBackgroundVideo() {
        if (!el.bgVideo) return;

        try {
            el.bgVideo.pause();
            el.bgVideo.removeAttribute('src');
            el.bgVideo.querySelectorAll('source').forEach((s) => s.remove());
            el.bgVideo.load();
        } catch (_) {}
    }

    /* =========================================================
       COMUNICAÇÃO COM O SERVIDOR
       ========================================================= */

    function emitToServer(eventName, payload = '') {
        if (typeof cef !== 'undefined' && typeof cef.emit === 'function') {
            cef.emit(eventName, String(payload));
            return true;
        }

        console.error('[VOLTS CEF] Não foi possível enviar o evento:', eventName);
        return false;
    }

    function emitReadyOnce() {
        if (state.readyEmitted) return;
        state.readyEmitted = true;
        emitToServer('volts:ready', '1');
    }

    /* =========================================================
       VALIDAÇÃO DE SENHA
       ========================================================= */

    function isWeakPassword(pass) {
        const lower = String(pass || '').toLowerCase();

        if (WEAK_PASSWORDS.has(lower)) return true;
        if (/^(.)\1+$/.test(lower)) return true;

        if ('01234567890'.includes(lower) || '09876543210'.includes(lower)) {
            return true;
        }

        if (
            'abcdefghijklmnopqrstuvwxyz'.includes(lower) ||
            'zyxwvutsrqponmlkjihgfedcba'.includes(lower)
        ) {
            return true;
        }

        if (state.username && lower === state.username.toLowerCase()) {
            return true;
        }

        return false;
    }

    /* =========================================================
       LEMBRAR-ME (LOCALSTORAGE)
       ========================================================= */

    function getRememberKey(username) {
        return `volts_remember_${String(username || '').toLowerCase()}`;
    }

    function loadRememberedPassword(username) {
        if (!username || !el.rememberMe || !el.loginPassword) return;

        try {
            const saved = localStorage.getItem(getRememberKey(username));
            if (saved) {
                el.loginPassword.value = saved;
                el.rememberMe.checked = true;
            } else {
                el.rememberMe.checked = false;
            }
        } catch (_) {}
    }

    function syncRememberedPassword(username, password) {
        if (!username || !el.rememberMe) return;

        try {
            if (el.rememberMe.checked && password) {
                localStorage.setItem(getRememberKey(username), password);
            } else {
                localStorage.removeItem(getRememberKey(username));
            }
        } catch (_) {}
    }

    /* =========================================================
       RELÓGIO, DATA, STATUS E CONTADOR DE JOGADORES
       ========================================================= */

    function updateClockAndDate() {
        const now = new Date();

        if (el.liveClock) {
            el.liveClock.textContent = now.toTimeString().slice(0, 8);
        }

        if (el.liveDate) {
            const day = String(now.getDate()).padStart(2, '0');
            const month = MONTHS_PT[now.getMonth()] || 'JANEIRO';
            const year = now.getFullYear();
            el.liveDate.textContent = `${day} DE ${month}, ${year}`;
        }
    }

    function setServerOnlineState(isOnline) {
        state.serverOnline = Boolean(isOnline);

        if (el.serverStatusBox) {
            el.serverStatusBox.classList.toggle('is-online', state.serverOnline);
            el.serverStatusBox.classList.toggle('is-offline', !state.serverOnline);
        }

        if (el.serverStatusText) {
            el.serverStatusText.textContent = state.serverOnline
                ? 'SERVIDOR ONLINE'
                : 'SERVIDOR OFFLINE';
        }
    }

    function updatePlayersCounter(online, maxSlots = MAX_SERVER_SLOTS) {
        const safeOnline = Math.max(0, Number(online) || 0);
        const safeMax = Math.max(1, Number(maxSlots) || MAX_SERVER_SLOTS);

        state.playersOnline = safeOnline;
        state.maxPlayers = safeMax;

        if (el.playerCountText) {
            el.playerCountText.textContent = `JOGADORES: ${safeOnline}/${safeMax}`;
        }
    }

    /* =========================================================
       DICAS DA CIDADE (16 DICAS)
       ========================================================= */

    function renderCityTip(index) {
        if (!CITY_TIPS.length) return;

        state.currentTipIndex = ((index % CITY_TIPS.length) + CITY_TIPS.length) % CITY_TIPS.length;

        if (el.cityTipText) {
            el.cityTipText.textContent = CITY_TIPS[state.currentTipIndex];
        }

        if (el.cityTipCounter) {
            const currentStr = String(state.currentTipIndex + 1).padStart(2, '0');
            const totalStr = String(CITY_TIPS.length).padStart(2, '0');
            el.cityTipCounter.textContent = `${currentStr} / ${totalStr}`;
        }

        if (el.cityTipSegments) {
            el.cityTipSegments.querySelectorAll('.tip-seg').forEach((seg, idx) => {
                seg.classList.toggle('active', idx === state.currentTipIndex);
            });
        }
    }

    function restartTipTimer() {
        if (state.tipTimer) {
            clearInterval(state.tipTimer);
        }

        state.tipTimer = setInterval(() => {
            renderCityTip(state.currentTipIndex + 1);
        }, TIP_INTERVAL_MS);
    }

    function initializeCityTips() {
        renderCityTip(0);
        restartTipTimer();

        if (el.btnPrevTip) {
            el.btnPrevTip.addEventListener('click', () => {
                renderCityTip(state.currentTipIndex - 1);
                restartTipTimer();
            });
        }

        if (el.btnNextTip) {
            el.btnNextTip.addEventListener('click', () => {
                renderCityTip(state.currentTipIndex + 1);
                restartTipTimer();
            });
        }

        if (el.cityTipSegments) {
            el.cityTipSegments.querySelectorAll('.tip-seg').forEach((seg) => {
                seg.addEventListener('click', () => {
                    const idx = Number(seg.getAttribute('data-index')) || 0;
                    renderCityTip(idx);
                    restartTipTimer();
                });
            });
        }
    }

    /* =========================================================
       SISTEMA DE MÚSICA (VOLTS RADIO)
       ========================================================= */

    function syncVolumeUI() {
        const pct = Math.round(state.volume * 100);
        const isMuted = pct === 0;

        if (el.bgMusic) {
            el.bgMusic.volume = state.volume;
            el.bgMusic.muted = isMuted;
        }

        if (el.volumeSlider) {
            el.volumeSlider.value = String(pct);
            el.volumeSlider.style.setProperty('--vol-pct', `${pct}%`);
        }

        if (el.iconVolOn) {
            el.iconVolOn.classList.toggle('hidden', isMuted);
        }

        if (el.iconVolOff) {
            el.iconVolOff.classList.toggle('hidden', !isMuted);
        }
    }

    function setVolumeLevel(newVol) {
        const clamped = Math.max(0, Math.min(1, Number(newVol) || 0));
        state.volume = clamped;

        if (clamped > 0) {
            state.lastNonZeroVolume = clamped;
        }

        syncVolumeUI();
    }

    function syncPlayerIcons(playing) {
        state.isPlaying = Boolean(playing);

        if (el.iconPlay) {
            el.iconPlay.classList.toggle('hidden', state.isPlaying);
        }

        if (el.iconPause) {
            el.iconPause.classList.toggle('hidden', !state.isPlaying);
        }

        if (el.playerBox) {
            el.playerBox.classList.toggle('playing', state.isPlaying);
        }
    }

    function getRandomTrackIndex() {
        if (PLAYLIST.length <= 1) return 0;

        let lastIndex = -1;
        try {
            const saved = sessionStorage.getItem('volts_last_login_track');
            if (saved !== null) lastIndex = Number(saved);
        } catch (_) {}

        let nextIdx = Math.floor(Math.random() * PLAYLIST.length);
        if (nextIdx === lastIndex) {
            nextIdx = (nextIdx + 1) % PLAYLIST.length;
        }

        try {
            sessionStorage.setItem('volts_last_login_track', String(nextIdx));
        } catch (_) {}

        return nextIdx;
    }

    function updateTrackDisplay() {
        const track = PLAYLIST[state.trackIndex] || {
            title: 'Volts Radio',
            artist: 'A cidade nunca para',
            src: '',
            cover: './capa.png'
        };

        if (el.musicTrackTitle) {
            el.musicTrackTitle.textContent = track.title;
        }

        if (el.musicTrackArtist) {
            el.musicTrackArtist.textContent = track.artist;
        }

        if (el.musicCoverImg && track.cover) {
            el.musicCoverImg.src = `${track.cover}?v=31`;
            el.musicCoverImg.alt = `Capa de ${track.title}`;
        }

        return track;
    }

    if (el.musicCoverImg) {
        el.musicCoverImg.addEventListener('error', () => {
            const currentSrc = el.musicCoverImg.getAttribute('src') || '';
            if (!currentSrc.includes('./capa.png')) {
                el.musicCoverImg.src = './capa.png?v=31';
            }
        });
    }

    function playAudioElement() {
        if (!el.bgMusic || !state.audioEnabled || !el.bgMusic.src) return;

        syncVolumeUI();

        const req = el.bgMusic.play();
        if (req && typeof req.then === 'function') {
            req
                .then(() => syncPlayerIcons(true))
                .catch(() => syncPlayerIcons(false));
        }
    }

    function loadTrack(index, autoplay = true) {
        if (!PLAYLIST.length || !el.bgMusic) return;

        state.trackIndex = ((index % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length;

        const track = updateTrackDisplay();
        el.bgMusic.src = track.src;

        syncVolumeUI();
        el.bgMusic.load();

        if (!autoplay || !state.audioEnabled) {
            syncPlayerIcons(false);
            return;
        }

        playAudioElement();
    }

    function prevTrack() {
        state.audioEnabled = true;
        loadTrack(state.trackIndex - 1, true);
    }

    function nextTrack() {
        state.audioEnabled = true;
        loadTrack(state.trackIndex + 1, true);
    }

    function togglePlayPause() {
        if (!el.bgMusic) return;

        if (!el.bgMusic.paused && state.isPlaying) {
            state.audioEnabled = false;
            el.bgMusic.pause();
            syncPlayerIcons(false);
            emitToServer('volts:audio', '0');
        } else {
            state.audioEnabled = true;
            if (!el.bgMusic.src) {
                loadTrack(state.trackIndex, true);
            } else {
                playAudioElement();
            }
            emitToServer('volts:audio', '1');
        }
    }

    function cleanupOnUnload() {
        stopBackgroundVideo();
        state.audioEnabled = false;
        syncPlayerIcons(false);

        if (el.bgMusic) {
            try {
                el.bgMusic.pause();
                el.bgMusic.currentTime = 0;
                el.bgMusic.removeAttribute('src');
                el.bgMusic.load();
            } catch (_) {}
        }
    }

    window.addEventListener('pagehide', cleanupOnUnload);
    window.addEventListener('beforeunload', cleanupOnUnload);

    if (el.bgMusic) {
        el.bgMusic.addEventListener('ended', () => {
            if (state.audioEnabled) {
                nextTrack();
            } else {
                syncPlayerIcons(false);
            }
        });

        el.bgMusic.addEventListener('pause', () => syncPlayerIcons(false));
        el.bgMusic.addEventListener('play', () => {
            syncVolumeUI();
            syncPlayerIcons(true);
        });
        el.bgMusic.addEventListener('error', () => syncPlayerIcons(false));
    }

    document.addEventListener('pointerdown', () => {
        if (el.bgVideo && el.bgVideo.paused) {
            startBackgroundVideo();
        }
        if (state.audioEnabled && el.bgMusic && el.bgMusic.paused && el.bgMusic.src) {
            playAudioElement();
        }
    }, { passive: true });

    if (el.btnPrevTrack) {
        el.btnPrevTrack.addEventListener('click', (e) => {
            e.stopPropagation();
            prevTrack();
        });
    }

    if (el.btnPlayPause) {
        el.btnPlayPause.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePlayPause();
        });
    }

    if (el.btnNextTrack) {
        el.btnNextTrack.addEventListener('click', (e) => {
            e.stopPropagation();
            nextTrack();
        });
    }

    if (el.volumeSlider) {
        el.volumeSlider.addEventListener('input', (e) => {
            setVolumeLevel(Number(e.target.value) / 100);
        });
    }

    if (el.btnMuteToggle) {
        el.btnMuteToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (state.volume > 0) {
                setVolumeLevel(0);
            } else {
                setVolumeLevel(state.lastNonZeroVolume || DEFAULT_VOLUME);
            }
        });
    }

    /* =========================================================
       MOSTRAR E OCULTAR SENHAS
       ========================================================= */

    function setEyeButtonState(btn, visible) {
        if (!btn) return;

        const openIcon = btn.querySelector('.icon-eye-open');
        const closedIcon = btn.querySelector('.icon-eye-closed');

        btn.setAttribute('aria-pressed', String(visible));

        if (openIcon) openIcon.classList.toggle('hidden', !visible);
        if (closedIcon) closedIcon.classList.toggle('hidden', visible);
    }

    function resetAllPasswordInputs() {
        document.querySelectorAll('.eye-btn').forEach((btn) => {
            const targetId = btn.getAttribute('data-target');
            const input = targetId ? document.getElementById(targetId) : null;

            if (input) input.type = 'password';
            setEyeButtonState(btn, false);
        });
    }

    document.querySelectorAll('.eye-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const input = targetId ? document.getElementById(targetId) : null;

            if (!input) return;

            const showText = input.type === 'password';
            input.type = showText ? 'text' : 'password';
            setEyeButtonState(btn, showText);
            input.focus();
        });
    });

    /* =========================================================
       CARREGAMENTO E FEEDBACK
       ========================================================= */

    function clearLoadingTimer() {
        if (state.loadingTimer) {
            clearTimeout(state.loadingTimer);
            state.loadingTimer = null;
        }
    }

    function setLoading(isLoading) {
        state.loading = isLoading;
        clearLoadingTimer();

        [el.btnSubmitLogin, el.btnSubmitRegister].forEach((btn) => {
            if (!btn) return;
            btn.disabled = isLoading;

            const spinner = btn.querySelector('.spinner');
            if (spinner) spinner.classList.toggle('hidden', !isLoading);
        });

        if (isLoading) {
            state.loadingTimer = setTimeout(() => {
                if (!state.loading) return;

                state.loading = false;

                [el.btnSubmitLogin, el.btnSubmitRegister].forEach((btn) => {
                    if (!btn) return;
                    btn.disabled = false;

                    const spinner = btn.querySelector('.spinner');
                    if (spinner) spinner.classList.add('hidden');
                });

                showFeedback(
                    'warning',
                    'Sem resposta do servidor. Verifique sua conexão e tente novamente.'
                );
            }, REQUEST_TIMEOUT_MS);
        }
    }

    function showFeedback(type, message) {
        if (!el.feedbackBox) return;

        el.feedbackBox.className = `feedback-box ${type}`;
        el.feedbackBox.textContent = message;
        el.feedbackBox.classList.remove('hidden');
    }

    function clearFeedback() {
        if (!el.feedbackBox) return;

        el.feedbackBox.classList.add('hidden');
        el.feedbackBox.textContent = '';
    }

    /* =========================================================
       ABAS ENTRAR / CRIAR CONTA
       ========================================================= */

    function switchTab(tab) {
        if (state.loading) return;

        state.activeTab = tab;
        clearFeedback();
        resetAllPasswordInputs();

        const isLogin = tab === 'login';

        if (el.tabLogin) {
            el.tabLogin.classList.toggle('active', isLogin);
            el.tabLogin.setAttribute('aria-selected', String(isLogin));
        }

        if (el.tabRegister) {
            el.tabRegister.classList.toggle('active', !isLogin);
            el.tabRegister.setAttribute('aria-selected', String(!isLogin));
        }

        if (el.formLogin) {
            el.formLogin.classList.toggle('hidden', !isLogin);
        }

        if (el.formRegister) {
            el.formRegister.classList.toggle('hidden', isLogin);
        }

        if (isLogin) {
            if (el.loginPassword) el.loginPassword.focus();
        } else {
            if (el.regPassword) el.regPassword.focus();
        }
    }

    function applyServerInit(username, isRegisteredInt) {
        const registered = Number(isRegisteredInt) === 1;

        state.username = username || 'Jogador';
        state.registered = registered;

        if (el.loginUsername) {
            el.loginUsername.value = state.username;
        }

        if (el.regUsername) {
            el.regUsername.value = state.username;
        }

        loadRememberedPassword(state.username);
        switchTab(registered ? 'login' : 'register');
    }

    if (el.tabLogin) {
        el.tabLogin.addEventListener('click', () => switchTab('login'));
    }

    if (el.tabRegister) {
        el.tabRegister.addEventListener('click', () => switchTab('register'));
    }

    if (el.btnForgotPass) {
        el.btnForgotPass.addEventListener('click', () => {
            showFeedback(
                'warning',
                'O sistema de recuperação de senha está temporariamente inativo.'
            );
        });
    }

    /* =========================================================
       ENVIO DE LOGIN E REGISTRO
       ========================================================= */

    if (el.formLogin) {
        el.formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            if (state.loading) return;

            const password = el.loginPassword ? el.loginPassword.value : '';

            if (!password || password.length < 1 || password.length > 32) {
                showFeedback('error', 'Digite uma senha válida (até 32 caracteres).');
                if (el.loginPassword) el.loginPassword.focus();
                return;
            }

            syncRememberedPassword(state.username, password);
            clearFeedback();
            setLoading(true);

            if (!emitToServer('volts:login', password)) {
                setLoading(false);
                showFeedback('error', 'Não foi possível conectar ao CEF.');
            }
        });
    }

    if (el.formRegister) {
        el.formRegister.addEventListener('submit', (e) => {
            e.preventDefault();
            if (state.loading) return;

            const pass1 = el.regPassword ? el.regPassword.value : '';
            const pass2 = el.regPasswordConfirm ? el.regPasswordConfirm.value : '';

            if (!pass1 || pass1.length < 6 || pass1.length > 32) {
                showFeedback('error', 'A senha deve ter entre 6 e 32 caracteres.');
                if (el.regPassword) el.regPassword.focus();
                return;
            }

            if (isWeakPassword(pass1)) {
                showFeedback(
                    'error',
                    'Senha muito fácil! Evite sequências como 123456 ou caracteres repetidos.'
                );
                if (el.regPassword) el.regPassword.focus();
                return;
            }

            if (pass1 !== pass2) {
                showFeedback('error', 'As duas senhas digitadas não coincidem.');
                if (el.regPasswordConfirm) el.regPasswordConfirm.focus();
                return;
            }

            if (pass1.includes('|')) {
                showFeedback('error', 'O caractere "|" não é permitido na senha.');
                return;
            }

            const payload = `${pass1}|${pass2}`;

            clearFeedback();
            setLoading(true);

            if (!emitToServer('volts:register', payload)) {
                setLoading(false);
                showFeedback('error', 'Não foi possível conectar ao CEF.');
            }
        });
    }

    /* =========================================================
       INICIALIZAÇÃO (SEM TRAVAR NO DOWNLOAD DO VÍDEO)
       ========================================================= */

    function bootstrapUI() {
        updateClockAndDate();
        setInterval(updateClockAndDate, 1000);

        setServerOnlineState(true);
        updatePlayersCounter(0, MAX_SERVER_SLOTS);
        syncVolumeUI();
        resetAllPasswordInputs();
        initializeCityTips();

        startBackgroundVideo();

        const startIndex = getRandomTrackIndex();
        loadTrack(startIndex, true);

        emitReadyOnce();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrapUI, { once: true });
    } else {
        bootstrapUI();
    }

    /* =========================================================
       EVENTOS RECEBIDOS DO PAWN (CEF)
       ========================================================= */

    if (typeof cef !== 'undefined' && typeof cef.on === 'function') {
        cef.on('volts:init', (username, isRegistered) => {
            setLoading(false);
            applyServerInit(username, isRegistered);
        });

        cef.on('volts:status', (statusValue) => {
            const normalized = String(statusValue || '').trim().toLowerCase();
            const isOffline =
                normalized === '0' ||
                normalized === 'offline' ||
                normalized === 'false';

            setServerOnlineState(!isOffline);
        });

        cef.on('volts:players', (onlineCount, maxSlots) => {
            updatePlayersCounter(onlineCount, maxSlots);
        });

        cef.on('volts:feedback', (type, message) => {
            const feedbackType = String(type || 'error').toLowerCase();

            showFeedback(
                feedbackType,
                message || 'Erro ao processar solicitação.'
            );

            if (feedbackType === 'error' || feedbackType === 'warning') {
                setLoading(false);

                if (state.activeTab === 'register') {
                    if (el.regPassword) el.regPassword.value = '';
                    if (el.regPasswordConfirm) el.regPasswordConfirm.value = '';
                    resetAllPasswordInputs();
                    if (el.regPassword) el.regPassword.focus();
                } else {
                    if (el.loginPassword) el.loginPassword.value = '';
                    resetAllPasswordInputs();
                    if (el.loginPassword) el.loginPassword.focus();
                }
            }
        });
    }
})();
