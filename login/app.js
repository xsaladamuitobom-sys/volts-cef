(() => {
    const state = {
        username: '',
        registered: false,
        loading: false,
        activeTab: 'login'
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
})();
