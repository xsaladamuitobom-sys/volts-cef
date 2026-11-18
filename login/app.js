(() => {
    const state = {
        username: '',
        registered: false,
        loading: false,
        activeTab: 'login',
        audioPlaying: true
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
        audioLabel: document.getElementById('audioLabel'),
        btnQuit: document.getElementById('btnQuit'),
        btnFallback: document.getElementById('btnFallback'),
        feedbackBox: document.getElementById('feedbackBox'),
        accountStatusBadge: document.getElementById('accountStatusBadge'),
        accountStatusText: document.getElementById('accountStatusText'),
        cardTitle: document.getElementById('cardTitle'),
        cardSubtitle: document.getElementById('cardSubtitle')
    };

    function emitToServer(eventName, payload = '') {
        if (typeof cef !== 'undefined' && typeof cef.emit === 'function') {
            cef.emit(eventName, String(payload));
        }
    }

    function initParticles() {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = Array.from({ length: 38 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 2 + 0.8,
            vx: (Math.random() - 0.5) * 0.35,
            vy: -Math.random() * 0.45 - 0.15,
            alpha: Math.random() * 0.5 + 0.2
        }));

        function render() {
            ctx.clearRect(0, 0, width, height);
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.y < -10) {
                    p.y = height + 10;
                    p.x = Math.random() * width;
                }
                if (p.x < -10) p.x = width + 10;
                if (p.x > width + 10) p.x = -10;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 229, 255, ${p.alpha})`;
                ctx.fill();
            }
            requestAnimationFrame(render);
        }
        render();
    }

    function setLoading(isLoading) {
        state.loading = isLoading;
        [el.btnSubmitLogin, el.btnSubmitRegister].forEach((btn) => {
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
            el.cardSubtitle.textContent = 'Insira sua senha para carregar seu personagem.';
            el.loginPassword.focus();
        } else {
            el.cardTitle.textContent = 'Criar Nova Conta';
            el.cardSubtitle.textContent = 'Defina uma senha segura para iniciar sua jornada.';
            el.regPassword.focus();
        }
    }

    function applyServerInit(username, isRegisteredInt) {
        const registered = Number(isRegisteredInt) === 1;
        state.username = username || 'Jogador';
        state.registered = registered;

        el.loginUsername.value = state.username;
        el.regUsername.value = state.username;

        if (registered) {
            el.accountStatusBadge.classList.remove('unregistered');
            el.accountStatusText.textContent = `${state.username} • Conta Registrada`;
            switchTab('login');
        } else {
            el.accountStatusBadge.classList.add('unregistered');
            el.accountStatusText.textContent = `${state.username} • Sem Cadastro`;
            switchTab('register');
        }
    }

    el.tabLogin.addEventListener('click', () => switchTab('login'));
    el.tabRegister.addEventListener('click', () => switchTab('register'));

    el.btnAudio.addEventListener('click', () => {
        state.audioPlaying = !state.audioPlaying;
        el.btnAudio.classList.toggle('playing', state.audioPlaying);
        el.audioLabel.textContent = state.audioPlaying ? 'Música: ON' : 'Música: OFF';
        emitToServer('volts:audio', state.audioPlaying ? '1' : '0');
    });

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

    el.btnQuit.addEventListener('click', () => emitToServer('volts:quit', '1'));
    el.btnFallback.addEventListener('click', () => emitToServer('volts:fallback', '1'));

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

    initParticles();
    emitToServer('volts:ready', '1');
})();
