(() => {
    const PLAYLIST = [
        {
            title: 'DANADA ME LIGANDO',
            artist: 'MC Cebezinho, MC Tuto e MC Kako',
            src: './musica.mp3'
        },
        {
            title: 'Lobo da Madruga',
            artist: 'MC Poze do Rodo ft. Meno K, MC Rodrigo do CN, MC Ryan SP e Bielzin',
            src: './musica2.mp3'
        },
        {
            title: "LET'S GO 5",
            artist: 'MC IG',
            src: './musica3.mp3'
        }
    ];

    const state = {
        username: '',
        registered: false,
        loading: false,
        activeTab: 'login',
        synced: false,
        audioEnabled: true,
        trackIndex: 0,
        secondsElapsed: 0
    };

    const el = {
        tabLogin: document.getElementById('tabLogin'),
        tabRegister: document.getElementById('tabRegister'),
        formLogin: document.getElementById('formLogin'),
        formRegister: document.getElementById('formRegister'),
        loginUsername: document.getElementById('loginUsername'),
        regUsername: document.getElementById('regUsername'),
        loginPassword: document.getElementById('loginPassword'),
        regPassword: document.getElementById('regPassword'),
        regPasswordConfirm: document.getElementById('regPasswordConfirm'),
        btnSubmitLogin: document.getElementById('btnSubmitLogin'),
        btnSubmitRegister: document.getElementById('btnSubmitRegister'),
        btnAudio: document.getElementById('btnAudio'),
        btnNextTrack: document.getElementById('btnNextTrack'),
        feedbackBox: document.getElementById('feedbackBox'),
        accountStatusBadge: document.getElementById('accountStatusBadge'),
        accountStatusText: document.getElementById('accountStatusText'),
        cardTitle: document.getElementById('cardTitle'),
        cardSubtitle: document.getElementById('cardSubtitle'),
        syncDot: document.getElementById('syncDot'),
        syncStatusText: document.getElementById('syncStatusText'),
        syncTimer: document.getElementById('syncTimer'),
        liveClock: document.getElementById('liveClock'),
        musicTrackTitle: document.getElementById('musicTrackTitle'),
        musicTrackArtist: document.getElementById('musicTrackArtist'),
        musicEq: document.getElementById('musicEq'),
        bgMusic: document.getElementById('bgMusic')
    };

    function emitToServer(eventName, payload = '') {
        if (typeof cef !== 'undefined' && typeof cef.emit === 'function') {
            cef.emit(eventName, String(payload));
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

    function updateTrackInfo() {
        const track = PLAYLIST[state.trackIndex] || { title: 'Sem faixa', artist: 'Desconhecido', src: '' };
        if (el.musicTrackTitle) el.musicTrackTitle.textContent = track.title;
        if (el.musicTrackArtist) el.musicTrackArtist.textContent = track.artist;
        return track;
    }

    function syncAudioUI(playing) {
        if (el.btnAudio) el.btnAudio.textContent = state.audioEnabled ? 'Música: ON' : 'Música: OFF';
        if (el.musicEq) el.musicEq.classList.toggle('playing', Boolean(state.audioEnabled && playing));
    }

    function playCurrentAudioElement() {
        if (!el.bgMusic || !state.audioEnabled) return;
        el.bgMusic.volume = 0.35;
        const promise = el.bgMusic.play();
        if (promise && typeof promise.then === 'function') {
            promise.then(() => syncAudioUI(true)).catch(() => syncAudioUI(false));
        }
    }

    function loadAndPlayTrack(index, autoplay = true) {
        if (!PLAYLIST.length || !el.bgMusic) return;
        state.trackIndex = ((index % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length;

        const track = updateTrackInfo();
        el.bgMusic.src = track.src;
        el.bgMusic.load();

        if (!state.audioEnabled || !autoplay) {
            syncAudioUI(false);
            return;
        }

        playCurrentAudioElement();
    }

    function nextTrack() {
        loadAndPlayTrack(state.trackIndex + 1, state.audioEnabled);
    }

    function toggleAudio() {
        state.audioEnabled = !state.audioEnabled;
        if (!state.audioEnabled) {
            if (el.bgMusic) el.bgMusic.pause();
            syncAudioUI(false);
            emitToServer('volts:audio', '0');
        } else {
            if (el.bgMusic && el.bgMusic.src) {
                playCurrentAudioElement();
            } else {
                loadAndPlayTrack(state.trackIndex, true);
            }
            emitToServer('volts:audio', '1');
        }
    }

    function stopMusicCleanly() {
        state.audioEnabled = false;
        if (el.bgMusic) {
            try {
                el.bgMusic.pause();
                el.bgMusic.currentTime = 0;
                el.bgMusic.removeAttribute('src');
                el.bgMusic.load();
            } catch (_) {}
        }
        syncAudioUI(false);
    }

    window.addEventListener('pagehide', stopMusicCleanly);
    window.addEventListener('beforeunload', stopMusicCleanly);

    if (el.bgMusic) {
        el.bgMusic.addEventListener('ended', () => {
            if (state.audioEnabled) {
                nextTrack();
            }
        });

        el.bgMusic.addEventListener('error', () => {
            syncAudioUI(false);
        });
    }

    document.addEventListener('pointerdown', () => {
        if (state.audioEnabled && el.bgMusic && el.bgMusic.paused && el.bgMusic.src) {
            playCurrentAudioElement();
        }
    }, { passive: true });

    if (el.btnNextTrack) {
        el.btnNextTrack.addEventListener('click', (e) => {
            e.stopPropagation();
            nextTrack();
        });
    }

    if (el.btnAudio) {
        el.btnAudio.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleAudio();
        });
    }

    const timerInterval = setInterval(() => {
        if (!state.synced && el.syncTimer) {
            state.secondsElapsed += 1;
            el.syncTimer.textContent = `${String(state.secondsElapsed).padStart(2, '0')}s`;
        }
    }, 1000);

    function updateClock() {
        if (!el.liveClock) return;
        const now = new Date();
        el.liveClock.textContent = now.toTimeString().slice(0, 8);
    }
    updateClock();
    setInterval(updateClock, 1000);

    function setLoading(isLoading) {
        state.loading = isLoading;
        [el.btnSubmitLogin, el.btnSubmitRegister].forEach((btn) => {
            if (!btn) return;
            btn.disabled = isLoading;
            const spinner = btn.querySelector('.spinner');
            if (spinner) spinner.classList.toggle('hidden', !isLoading);
        });
    }

    function showFeedback(type, message) {
        el.feedbackBox.className = `feedback-box ${type}`;
        el.feedbackBox.textContent = message;
        el.feedbackBox.classList.remove('hidden');
    }

    function clearFeedback() {
        el.feedbackBox.classList.add('hidden');
        el.feedbackBox.textContent = '';
    }

    function switchTab(tab) {
        if (state.loading) return;
        state.activeTab = tab;
        clearFeedback();

        const isLogin = tab === 'login';
        el.tabLogin.classList.toggle('active', isLogin);
        el.tabLogin.setAttribute('aria-selected', String(isLogin));
        el.tabRegister.classList.toggle('active', !isLogin);
        el.tabRegister.setAttribute('aria-selected', String(!isLogin));

        el.formLogin.classList.toggle('hidden', !isLogin);
        el.formRegister.classList.toggle('hidden', isLogin);

        if (isLogin) {
            el.cardTitle.textContent = 'Acessar Conta';
            el.cardSubtitle.textContent = 'Digite sua senha para entrar no jogo.';
            el.loginPassword.focus();
        } else {
            el.cardTitle.textContent = 'Criar Conta';
            el.cardSubtitle.textContent = 'Defina uma senha para cadastrar seu personagem.';
            el.regPassword.focus();
        }
    }

    function applyServerInit(username, isRegisteredInt) {
        state.synced = true;
        clearInterval(timerInterval);
        if (el.syncDot) el.syncDot.classList.add('synced');
        if (el.syncStatusText) {
            el.syncStatusText.textContent = `Sincronizado em ${String(state.secondsElapsed).padStart(2, '0')}s`;
        }

        const registered = Number(isRegisteredInt) === 1;
        state.username = username || 'Jogador';
        state.registered = registered;

        el.loginUsername.value = state.username;
        el.regUsername.value = state.username;

        if (registered) {
            el.accountStatusBadge.classList.remove('unregistered');
            el.accountStatusText.textContent = `${state.username} • Registrada`;
            switchTab('login');
        } else {
            el.accountStatusBadge.classList.add('unregistered');
            el.accountStatusText.textContent = `${state.username} • Sem Cadastro`;
            switchTab('register');
        }
    }

    el.tabLogin.addEventListener('click', () => switchTab('login'));
    el.tabRegister.addEventListener('click', () => switchTab('register'));

    document.querySelectorAll('.toggle-pass').forEach((btn) => {
        btn.addEventListener('click', () => {
            const input = document.getElementById(btn.getAttribute('data-target'));
            if (!input) return;
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            btn.textContent = isPassword ? 'Ocultar' : 'Ver';
        });
    });

    el.formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        if (state.loading) return;

        const password = el.loginPassword.value;
        if (!password || password.length < 1) {
            showFeedback('error', 'Digite sua senha antes de continuar.');
            el.loginPassword.focus();
            return;
        }

        clearFeedback();
        setLoading(true);
        emitToServer('volts:login', password);
    });

    el.formRegister.addEventListener('submit', (e) => {
        e.preventDefault();
        if (state.loading) return;

        const pass1 = el.regPassword.value;
        const pass2 = el.regPasswordConfirm.value;

        if (!pass1 || pass1.length < 6) {
            showFeedback('error', 'A senha precisa ter no mínimo 6 caracteres.');
            el.regPassword.focus();
            return;
        }
        if (pass1 !== pass2) {
            showFeedback('error', 'As duas senhas digitadas não coincidem.');
            el.regPasswordConfirm.focus();
            return;
        }
        if (pass1.includes('|')) {
            showFeedback('error', 'O caractere "|" não é permitido na senha.');
            return;
        }

        clearFeedback();
        setLoading(true);
        emitToServer('volts:register', `${pass1}|${pass2}`);
    });

    window.addEventListener('load', () => {
        const startTrack = getRandomTrackIndex();
        loadAndPlayTrack(startTrack, true);
        emitToServer('volts:ready', '1');
    });

    if (typeof cef !== 'undefined' && typeof cef.on === 'function') {
        cef.on('volts:init', (username, isRegistered) => {
            setLoading(false);
            applyServerInit(username, isRegistered);
        });

        cef.on('volts:feedback', (type, message) => {
            setLoading(false);
            showFeedback(type || 'error', message || 'Erro ao processar solicitação.');
            if (type === 'error') {
                el.loginPassword.value = '';
                el.loginPassword.focus();
            }
        });
    }
})();
