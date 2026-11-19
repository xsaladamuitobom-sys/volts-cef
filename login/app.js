(() => {
    const DEFAULT_DISCORD_INVITE = 'https://discord.gg/VgJXqdtWN5';

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
        audioEnabled: true,
        isPlaying: false,
        trackIndex: 0,
        discordUrl: DEFAULT_DISCORD_INVITE
    };

    const el = {
        liveClock: document.getElementById('liveClock'),
        discordLink: document.getElementById('discordLink'),
        btnPrevTrack: document.getElementById('btnPrevTrack'),
        btnPlayPause: document.getElementById('btnPlayPause'),
        btnNextTrack: document.getElementById('btnNextTrack'),
        iconPlay: document.getElementById('iconPlay'),
        iconPause: document.getElementById('iconPause'),
        musicTrackTitle: document.getElementById('musicTrackTitle'),
        musicTrackArtist: document.getElementById('musicTrackArtist'),
        bgMusic: document.getElementById('bgMusic'),
        accountBadge: document.getElementById('accountBadge'),
        cardTitle: document.getElementById('cardTitle'),
        cardSubtitle: document.getElementById('cardSubtitle'),
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
        btnSubmitRegister: document.getElementById('btnSubmitRegister')
    };

    function emitToServer(eventName, payload = '') {
        if (typeof cef !== 'undefined' && typeof cef.emit === 'function') {
            cef.emit(eventName, String(payload));
        }
    }

    function isValidDiscordUrl(url) {
        if (!url || typeof url !== 'string') return false;
        const trimmed = url.trim();
        return (
            trimmed.startsWith('https://discord.gg/') ||
            trimmed.startsWith('https://discord.com/invite/') ||
            trimmed.startsWith('https://discordapp.com/invite/')
        );
    }

    function applyDiscordUrl(url) {
        if (!isValidDiscordUrl(url)) return;
        state.discordUrl = url.trim();
    }

    function copyTextToClipboard(text) {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            return navigator.clipboard.writeText(text).catch(() => fallbackCopyText(text));
        }
        return Promise.resolve(fallbackCopyText(text));
    }

    function fallbackCopyText(text) {
        const temp = document.createElement('textarea');
        temp.value = text;
        temp.setAttribute('readonly', '');
        temp.style.position = 'fixed';
        temp.style.top = '-9999px';
        temp.style.opacity = '0';
        document.body.appendChild(temp);
        temp.select();
        let copied = false;
        try {
            copied = document.execCommand('copy');
        } catch (_) {
            copied = false;
        }
        document.body.removeChild(temp);
        return copied;
    }

    if (el.discordLink) {
        el.discordLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const targetUrl = isValidDiscordUrl(state.discordUrl)
                ? state.discordUrl
                : DEFAULT_DISCORD_INVITE;

            copyTextToClipboard(targetUrl).then(() => {
                showFeedback('success', `Discord copiado (${targetUrl})! Cole no seu navegador.`);
            });

            emitToServer('volts:discord_click', targetUrl);
        });
    }

    function updateClock() {
        if (!el.liveClock) return;
        const now = new Date();
        el.liveClock.textContent = now.toTimeString().slice(0, 8);
    }

    function syncPlayerIcons(playing) {
        state.isPlaying = Boolean(playing);
        if (el.iconPlay) el.iconPlay.classList.toggle('hidden', state.isPlaying);
        if (el.iconPause) el.iconPause.classList.toggle('hidden', !state.isPlaying);
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

    function updateTrackLabel() {
        const track = PLAYLIST[state.trackIndex] || {
            title: 'Sem faixa',
            artist: 'VOLTS RP',
            src: ''
        };
        if (el.musicTrackTitle) el.musicTrackTitle.textContent = track.title;
        if (el.musicTrackArtist) el.musicTrackArtist.textContent = track.artist;
        return track;
    }

    function playAudioElement() {
        if (!el.bgMusic || !state.audioEnabled || !el.bgMusic.src) return;
        el.bgMusic.volume = 0.35;
        const req = el.bgMusic.play();
        if (req && typeof req.then === 'function') {
            req.then(() => syncPlayerIcons(true)).catch(() => syncPlayerIcons(false));
        }
    }

    function loadTrack(index, autoplay = true) {
        if (!PLAYLIST.length || !el.bgMusic) return;
        state.trackIndex = ((index % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length;
        const track = updateTrackLabel();

        el.bgMusic.src = track.src;
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
            syncPlayerIcons(true);
        });

        el.bgMusic.addEventListener('error', () => {
            syncPlayerIcons(false);
        });
    }

    document.addEventListener('pointerdown', () => {
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
            if (input) {
                input.type = 'password';
            }
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

        if (el.formLogin) el.formLogin.classList.toggle('hidden', !isLogin);
        if (el.formRegister) el.formRegister.classList.toggle('hidden', isLogin);

        if (isLogin) {
            if (el.cardTitle) el.cardTitle.textContent = 'Acessar Conta';
            if (el.cardSubtitle) el.cardSubtitle.textContent = 'Digite sua senha para entrar no jogo.';
            if (el.loginPassword) el.loginPassword.focus();
        } else {
            if (el.cardTitle) el.cardTitle.textContent = 'Criar Conta';
            if (el.cardSubtitle) el.cardSubtitle.textContent = 'Defina uma senha para cadastrar seu personagem.';
            if (el.regPassword) el.regPassword.focus();
        }
    }

    function applyServerInit(username, isRegisteredInt, discordUrl) {
        const registered = Number(isRegisteredInt) === 1;
        state.username = username || 'Jogador';
        state.registered = registered;

        if (discordUrl) {
            applyDiscordUrl(discordUrl);
        }

        if (el.loginUsername) el.loginUsername.value = state.username;
        if (el.regUsername) el.regUsername.value = state.username;

        if (el.accountBadge) {
            el.accountBadge.textContent = registered
                ? `${state.username} • Registrada`
                : `${state.username} • Sem Cadastro`;
        }

        switchTab(registered ? 'login' : 'register');
    }

    if (el.tabLogin) el.tabLogin.addEventListener('click', () => switchTab('login'));
    if (el.tabRegister) el.tabRegister.addEventListener('click', () => switchTab('register'));

    if (el.formLogin) {
        el.formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            if (state.loading) return;

            const password = el.loginPassword ? el.loginPassword.value : '';
            if (!password || password.length < 1) {
                showFeedback('error', 'Digite sua senha antes de continuar.');
                if (el.loginPassword) el.loginPassword.focus();
                return;
            }

            clearFeedback();
            setLoading(true);
            emitToServer('volts:login', password);
        });
    }

    if (el.formRegister) {
        el.formRegister.addEventListener('submit', (e) => {
            e.preventDefault();
            if (state.loading) return;

            const pass1 = el.regPassword ? el.regPassword.value : '';
            const pass2 = el.regPasswordConfirm ? el.regPasswordConfirm.value : '';

            if (!pass1 || pass1.length < 6) {
                showFeedback('error', 'A senha precisa ter no mínimo 6 caracteres.');
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

            clearFeedback();
            setLoading(true);
            emitToServer('volts:register', `${pass1}|${pass2}`);
        });
    }

    updateClock();
    setInterval(updateClock, 1000);
    resetAllPasswordInputs();

    window.addEventListener('load', () => {
        const startIndex = getRandomTrackIndex();
        loadTrack(startIndex, true);
        emitToServer('volts:ready', '1');
    });

    if (typeof cef !== 'undefined' && typeof cef.on === 'function') {
        cef.on('volts:init', (username, isRegistered, discordUrl) => {
            setLoading(false);
            applyServerInit(username, isRegistered, discordUrl);
        });

        cef.on('volts:discord', (url) => {
            applyDiscordUrl(url);
        });

        cef.on('volts:feedback', (type, message) => {
            setLoading(false);
            showFeedback(type || 'error', message || 'Erro ao processar solicitação.');
            if (type === 'error' && el.loginPassword) {
                el.loginPassword.value = '';
                resetAllPasswordInputs();
                el.loginPassword.focus();
            }
        });
    }
})();
