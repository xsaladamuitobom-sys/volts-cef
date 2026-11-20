(() => {
    const DEFAULT_DISCORD_INVITE = 'https://discord.gg/VgJXqdtWN5';
    const FIXED_LOW_VOLUME = 0.22;

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

    const TIPS = [
        'Use uma senha forte e nunca informe seus dados a outras pessoas.',
        'A equipe oficial do VOLTS RP nunca pede sua senha por chat ou mensagem.',
        'Evite usar a mesma senha de e-mail ou redes sociais na sua conta do jogo.',
        'Clique no ícone do Discord no topo para copiar o convite oficial.',
        'Mantenha o respeito nas interações e siga as regras de roleplay.',
        'Evite divulgar links suspeitos ou aceitar arquivos de desconhecidos.',
        'Em caso de dúvida ou denúncia, procure os canais oficiais no Discord.',
        'Use os controles de música no canto inferior direito para pausar ou trocar de faixa.',
        'Confira seu nome de personagem antes de confirmar o cadastro.',
        'Use senhas com no mínimo 6 caracteres para proteger melhor seu progresso.'
    ];

    const state = {
        username: '',
        registered: false,
        loading: false,
        activeTab: 'login',
        audioEnabled: true,
        isPlaying: false,
        trackIndex: 0,
        volume: FIXED_LOW_VOLUME,
        tipIndex: 0,
        serverOnline: true,
        discordUrl: DEFAULT_DISCORD_INVITE
    };

    const el = {
        clockPill: document.getElementById('clockPill'),
        liveClock: document.getElementById('liveClock'),
        discordLink: document.getElementById('discordLink'),
        playerBox: document.getElementById('playerBox'),
        musicCoverImg: document.getElementById('musicCoverImg'),
        btnPrevTrack: document.getElementById('btnPrevTrack'),
        btnPlayPause: document.getElementById('btnPlayPause'),
        btnNextTrack: document.getElementById('btnNextTrack'),
        iconPlay: document.getElementById('iconPlay'),
        iconPause: document.getElementById('iconPause'),
        musicTrackTitle: document.getElementById('musicTrackTitle'),
        musicTrackArtist: document.
