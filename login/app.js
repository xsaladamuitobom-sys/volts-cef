
(() => {
    const FIXED_LOW_VOLUME = 0.22;
    const REQUEST_TIMEOUT_MS = 12000;
    const TIP_INTERVAL_MS = 9000;

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
        'Construa sua história. Suas escolhas definem seu caminho na cidade.',
        'Respeite as regras de interpretação e valorize a experiência de todos.',
        'Conheça a cidade antes de se aventurar em novas oportunidades.',
        'Trabalhe, conquiste seu espaço e desenvolva sua trajetória.',
        'Boas histórias são construídas com interação e criatividade.',
        'Cada decisão pode mudar o rumo da sua vida na cidade.'
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
        volume: FIXED_LOW_VOLUME,
        serverOnline: true,
        loadingTimer: null,
        currentTipIndex: 0,
        tipTimer: null
    };

    const el = {
        clockPill: document.getElementById('clockPill'),
        liveClock: document.getElementById('liveClock'),

        playerBox: document.getElementById('playerBox'),
        musicCoverImg: document.getElementById('musicCoverImg'),
        btnPrevTrack: document.getElementById('btnPrevTrack'),
        btnPlayPause: document.getElementById('btnPlayPause'),
        btnNextTrack: document.getElementById('btnNextTrack'),
        iconPlay: document.getElementById('iconPlay'),
        iconPause: document.getElementById('iconPause'),
        musicTrackTitle: document.getElementById('musicTrackTitle'),
        musicTrackArtist: document.getElementById('musicTrackArtist'),
        bgMusic: document.getElementById('bgMusic'),

        accountBadge: document.getElementById('accountBadge'),
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

        btnSubmitLogin: document.getElementById('btnSubmitLogin'),
        btnSubmitRegister: document.getElementById('btnSubmitRegister'),

        cityTip: document.getElementById('cityTip'),
        cityTipNumber: document.getElementById('cityTipNumber'),
        cityTipProgress: document.getElementById('cityTipProgress')
    };

    /* =========================================================
       COMUNICAÇÃO COM O SERVIDOR
       ========================================================= */

    function emitToServer(eventName, payload = '') {
        if (
            typeof cef !== 'undefined' &&
            typeof cef.emit === 'function'
        ) {
            cef.emit(eventName, String(payload));
            return true;
        }

        console.error(
            '[VOLTS CEF] Não foi possível enviar o evento:',
            eventName
        );

        return false;
    }

    /* =========================================================
       VALIDAÇÃO DE SENHA
       ========================================================= */

    function isWeakPassword(pass) {
        const lower = String(pass || '').toLowerCase();

        if (WEAK_PASSWORDS.has(lower)) return true;
        if (/^(.)\1+$/.test(lower)) return true;

        if (
            '01234567890'.includes(lower) ||
            '09876543210'.includes(lower)
        ) {
            return true;
        }

        if (
            'abcdefghijklmnopqrstuvwxyz'.includes(lower) ||
            'zyxwvutsrqponmlkjihgfedcba'.includes(lower)
        ) {
            return true;
        }

        if (
            state.username &&
            lower === state.username.toLowerCase()
        ) {
            return true;
        }

        return false;
    }

    /* =========================================================
       STATUS E RELÓGIO
       ========================================================= */

    function setClockDotState(isOnline) {
        state.serverOnline = Boolean(isOnline);

        if (!el.clockPill) return;

        el.clockPill.classList.toggle(
            'is-online',
            state.serverOnline
        );

        el.clockPill.classList.toggle(
            'is-offline',
            !state.serverOnline
        );
    }

    function updateClock() {
        if (!el.liveClock) return;

        const now = new Date();

        el.liveClock.textContent = now
            .toTimeString()
            .slice(0, 8);
    }

    /* =========================================================
       DICAS DA CIDADE
       ========================================================= */

    function updateTipProgress() {
        if (!el.cityTipProgress) return;

        const progress = el.cityTipProgress;

        progress.style.transition = 'none';
        progress.style.width = '0%';

        // Reinicia a animação da barra.
        void progress.offsetWidth;

        progress.style.transition =
            `width ${TIP_INTERVAL_MS}ms linear`;

        progress.style.width = '100%';
    }

    function updateCityTip() {
        if (!el.cityTip || CITY_TIPS.length === 0) return;

        state.currentTipIndex =
            (state.currentTipIndex + 1) % CITY_TIPS.length;

        el.cityTip.textContent =
            CITY_TIPS[state.currentTipIndex];

        if (el.cityTipNumber) {
            el.cityTipNumber.textContent =
                `/// ${String(state.currentTipIndex + 1).padStart(2, '0')}`;
        }

        updateTipProgress();
    }

    function initializeCityTips() {
        if (!el.cityTip) return;

        state.currentTipIndex = 0;

        el.cityTip.textContent = CITY_TIPS[0];

        if (el.cityTipNumber) {
            el.cityTipNumber.textContent = '/// 01';
        }

        updateTipProgress();

        if (state.tipTimer) {
            clearInterval(state.tipTimer);
        }

        state.tipTimer = setInterval(
            updateCityTip,
            TIP_INTERVAL_MS
        );
    }

    /* =========================================================
       SISTEMA DE MÚSICA
       ========================================================= */

    function applyLowVolume() {
        state.volume = FIXED_LOW_VOLUME;

        if (el.bgMusic) {
            el.bgMusic.volume = state.volume;
        }
    }

    function syncPlayerIcons(playing) {
        state.isPlaying = Boolean(playing);

        if (el.iconPlay) {
            el.iconPlay.classList.toggle(
                'hidden',
                state.isPlaying
            );
        }

        if (el.iconPause) {
            el.iconPause.classList.toggle(
                'hidden',
                !state.isPlaying
            );
        }

        if (el.playerBox) {
            el.playerBox.classList.toggle(
                'playing',
                state.isPlaying
            );
        }
    }

    function getRandomTrackIndex() {
        if (PLAYLIST.length <= 1) return 0;

        let lastIndex = -1;

        try {
            const saved = sessionStorage.getItem(
                'volts_last_login_track'
            );

            if (saved !== null) {
                lastIndex = Number(saved);
            }
        } catch (_) {}

        let nextIdx = Math.floor(
            Math.random() * PLAYLIST.length
        );

        if (nextIdx === lastIndex) {
            nextIdx = (nextIdx + 1) % PLAYLIST.length;
        }

        try {
            sessionStorage.setItem(
                'volts_last_login_track',
                String(nextIdx)
            );
        } catch (_) {}

        return nextIdx;
    }

    function updateTrackDisplay() {
        const track = PLAYLIST[state.trackIndex] || {
            title: 'Sem faixa',
            artist: 'VOLTS RP',
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
            el.musicCoverImg.src = `${track.cover}?v=24`;
            el.musicCoverImg.alt = `Capa de ${track.title}`;
        }

        return track;
    }

    if (el.musicCoverImg) {
        el.musicCoverImg.addEventListener('error', () => {
            const currentSrc =
                el.musicCoverImg.getAttribute('src') || '';

            if (!currentSrc.includes('./capa.png')) {
                el.musicCoverImg.src = './capa.png?v=24';
            }
        });
    }

    function playAudioElement() {
        if (
            !el.bgMusic ||
            !state.audioEnabled ||
            !el.bgMusic.src
        ) {
            return;
        }

        applyLowVolume();

        const req = el.bgMusic.play();

        if (req && typeof req.then === 'function') {
            req
                .then(() => syncPlayerIcons(true))
                .catch(() => syncPlayerIcons(false));
        }
    }

    function loadTrack(index, autoplay = true) {
        if (!PLAYLIST.length || !el.bgMusic) return;

        state.trackIndex = (
            (index % PLAYLIST.length) + PLAYLIST.length
        ) % PLAYLIST.length;

        const track = updateTrackDisplay();

        el.bgMusic.src = track.src;

        applyLowVolume();
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

    function stopMusicCleanly() {
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

    window.addEventListener('pagehide', stopMusicCleanly);
    window.addEventListener('beforeunload', stopMusicCleanly);

    if (el.bgMusic) {
        el.bgMusic.addEventListener('ended', () => {
            if (state.audioEnabled) {
                nextTrack();
            } else {
                syncPlayerIcons(false);
            }
        });

        el.bgMusic.addEventListener('pause', () => {
            syncPlayerIcons(false);
        });

        el.bgMusic.addEventListener('play', () => {
            applyLowVolume();
            syncPlayerIcons(true);
        });

        el.bgMusic.addEventListener('error', () => {
            syncPlayerIcons(false);
        });
    }

    document.addEventListener('pointerdown', () => {
        if (
            state.audioEnabled &&
            el.bgMusic &&
            el.bgMusic.paused &&
            el.bgMusic.src
        ) {
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

    /* =========================================================
       MOSTRAR E OCULTAR SENHAS
       ========================================================= */

    function setEyeButtonState(btn, visible) {
        if (!btn) return;

        const openIcon = btn.querySelector('.icon-eye-open');
        const closedIcon = btn.querySelector('.icon-eye-closed');

        btn.setAttribute('aria-pressed', String(visible));

        if (openIcon) {
            openIcon.classList.toggle('hidden', !visible);
        }

        if (closedIcon) {
            closedIcon.classList.toggle('hidden', visible);
        }
    }

    function resetAllPasswordInputs() {
        document.querySelectorAll('.eye-btn').forEach((btn) => {
            const targetId = btn.getAttribute('data-target');

            const input = targetId
                ? document.getElementById(targetId)
                : null;

            if (input) {
                input.type = 'password';
            }

            setEyeButtonState(btn, false);
        });
    }

    document.querySelectorAll('.eye-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');

            const input = targetId
                ? document.getElementById(targetId)
                : null;

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

        [
            el.btnSubmitLogin,
            el.btnSubmitRegister
        ].forEach((btn) => {
            if (!btn) return;

            btn.disabled = isLoading;

            const spinner = btn.querySelector('.spinner');

            if (spinner) {
                spinner.classList.toggle(
                    'hidden',
                    !isLoading
                );
            }
        });

        if (isLoading) {
            state.loadingTimer = setTimeout(() => {
                if (!state.loading) return;

                state.loading = false;

                [
                    el.btnSubmitLogin,
                    el.btnSubmitRegister
                ].forEach((btn) => {
                    if (!btn) return;

                    btn.disabled = false;

                    const spinner =
                        btn.querySelector('.spinner');

                    if (spinner) {
                        spinner.classList.add('hidden');
                    }
                });

                showFeedback(
                    'warning',
                    'Sem resposta do servidor. Verifique o console e tente novamente.'
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
       ABAS DE LOGIN E REGISTRO
       ========================================================= */

    function switchTab(tab) {
        if (state.loading) return;

        state.activeTab = tab;

        clearFeedback();
        resetAllPasswordInputs();

        const isLogin = tab === 'login';

        if (el.tabLogin) {
            el.tabLogin.classList.toggle(
                'active',
                isLogin
            );

            el.tabLogin.setAttribute(
                'aria-selected',
                String(isLogin)
            );
        }

        if (el.tabRegister) {
            el.tabRegister.classList.toggle(
                'active',
                !isLogin
            );

            el.tabRegister.setAttribute(
                'aria-selected',
                String(!isLogin)
            );
        }

        if (el.formLogin) {
            el.formLogin.classList.toggle(
                'hidden',
                !isLogin
            );
        }

        if (el.formRegister) {
            el.formRegister.classList.toggle(
                'hidden',
                isLogin
            );
        }

        if (isLogin) {
            if (el.loginPassword) {
                el.loginPassword.focus();
            }
        } else {
            if (el.regPassword) {
                el.regPassword.focus();
            }
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

        if (el.accountBadge) {
            el.accountBadge.textContent = registered
                ? `${state.username} • Conta registrada`
                : `${state.username} • Sem cadastro`;
        }

        switchTab(registered ? 'login' : 'register');
    }

    if (el.tabLogin) {
        el.tabLogin.addEventListener('click', () => {
            switchTab('login');
        });
    }

    if (el.tabRegister) {
        el.tabRegister.addEventListener('click', () => {
            switchTab('register');
        });
    }

    /* =========================================================
       LOGIN
       ========================================================= */

    if (el.formLogin) {
        el.formLogin.addEventListener('submit', (e) => {
            e.preventDefault();

            if (state.loading) return;

            const password = el.loginPassword
                ? el.loginPassword.value
                : '';

            if (
                !password ||
                password.length < 1 ||
                password.length > 32
            ) {
                showFeedback(
                    'error',
                    'Digite uma senha válida (até 32 caracteres).'
                );

                if (el.loginPassword) {
                    el.loginPassword.focus();
                }

                return;
            }

            clearFeedback();

            setLoading(true);

            if (!emitToServer('volts:login', password)) {
                setLoading(false);

                showFeedback(
                    'error',
                    'Não foi possível conectar ao CEF.'
                );
            }
        });
    }

    /* =========================================================
       REGISTRO
       ========================================================= */

    if (el.formRegister) {
        el.formRegister.addEventListener('submit', (e) => {
            e.preventDefault();

            if (state.loading) return;

            const pass1 = el.regPassword
                ? el.regPassword.value
                : '';

            const pass2 = el.regPasswordConfirm
                ? el.regPasswordConfirm.value
                : '';

            if (
                !pass1 ||
                pass1.length < 6 ||
                pass1.length > 32
            ) {
                showFeedback(
                    'error',
                    'A senha deve ter entre 6 e 32 caracteres.'
                );

                if (el.regPassword) {
                    el.regPassword.focus();
                }

                return;
            }

            if (isWeakPassword(pass1)) {
                showFeedback(
                    'error',
                    'Senha muito fácil! Evite sequências como 123456 ou números repetidos.'
                );

                if (el.regPassword) {
                    el.regPassword.focus();
                }

                return;
            }

            if (pass1 !== pass2) {
                showFeedback(
                    'error',
                    'As duas senhas digitadas não coincidem.'
                );

                if (el.regPasswordConfirm) {
                    el.regPasswordConfirm.focus();
                }

                return;
            }

            if (pass1.includes('|')) {
                showFeedback(
                    'error',
                    'O caractere "|" não é permitido na senha.'
                );

                return;
            }

            const payload = `${pass1}|${pass2}`;

            console.log(
                '[VOLTS REGISTRO] Preparando envio:',
                {
                    senha1Length: pass1.length,
                    senha2Length: pass2.length,
                    payloadLength: payload.length,
                    cefDisponivel: typeof cef !== 'undefined',
                    cefEmitDisponivel:
                        typeof cef !== 'undefined' &&
                        typeof cef.emit === 'function'
                }
            );

            clearFeedback();

            setLoading(true);

            const enviado = emitToServer(
                'volts:register',
                payload
            );

            console.log(
                '[VOLTS REGISTRO] Evento volts:register enviado:',
                enviado
            );

            if (!enviado) {
                setLoading(false);

                showFeedback(
                    'error',
                    'Não foi possível conectar ao CEF.'
                );
            }
        });
    }

    /* =========================================================
       INICIALIZAÇÃO
       ========================================================= */

    updateClock();

    setInterval(updateClock, 1000);

    setClockDotState(true);

    applyLowVolume();

    resetAllPasswordInputs();

    initializeCityTips();

    window.addEventListener('load', () => {
        const startIndex = getRandomTrackIndex();

        loadTrack(startIndex, true);

        emitToServer('volts:ready', '1');
    });

    /* =========================================================
       EVENTOS CEF
       ========================================================= */

    if (
        typeof cef !== 'undefined' &&
        typeof cef.on === 'function'
    ) {

        cef.on('volts:init', (username, isRegistered) => {
            setLoading(false);

            applyServerInit(
                username,
                isRegistered
            );
        });

        cef.on('volts:status', (statusValue) => {
            const normalized = String(statusValue || '')
                .trim()
                .toLowerCase();

            const isOffline =
                normalized === '0' ||
                normalized === 'offline' ||
                normalized === 'false';

            setClockDotState(!isOffline);
        });

        cef.on('volts:feedback', (type, message) => {
            const feedbackType =
                String(type || 'error').toLowerCase();

            showFeedback(
                feedbackType,
                message || 'Erro ao processar solicitação.'
            );

            if (
                feedbackType === 'error' ||
                feedbackType === 'warning'
            ) {
                setLoading(false);

                if (state.activeTab === 'register') {

                    if (el.regPassword) {
                        el.regPassword.value = '';
                    }

                    if (el.regPasswordConfirm) {
                        el.regPasswordConfirm.value = '';
                    }

                    resetAllPasswordInputs();

                    if (el.regPassword) {
                        el.regPassword.focus();
                    }

                } else {

                    if (el.loginPassword) {
                        el.loginPassword.value = '';
                    }

                    resetAllPasswordInputs();

                    if (el.loginPassword) {
                        el.loginPassword.focus();
                    }
                }
            }
        });
    }

})();
