document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const searchInput = document.getElementById('searchInput');
    const filterChips = document.querySelectorAll('.filter-chip');
    const musicCards = document.querySelectorAll('.music-card');
    const playButtons = document.querySelectorAll('.play-button');
    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseButton = document.getElementById('playPauseButton');
    const playPauseIcon = document.getElementById('playPauseIcon');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const progressBar = document.getElementById('progressBar');
    const volumeBar = document.getElementById('volumeBar');
    const currentTime = document.getElementById('currentTime');
    const totalTime = document.getElementById('totalTime');
    const currentAlbumArt = document.getElementById('currentAlbumArt');
    const currentSongTitle = document.getElementById('currentSongTitle');
    const currentSongArtist = document.getElementById('currentSongArtist');
    
    // Estado do player
    let isPlaying = false;
    let currentSongIndex = 0;
    let currentFilter = 'all';
    let progressInterval;
    
    // Dados das músicas (simulados)
    const songs = [
        {
            title: "Hino de Ação de Graças",
            artist: "Vários Artistas",
            category: "worship",
            albumArt: "https://lh3.googleusercontent.com/aida-public/AB6AXuDShNXhNDXi6fVBgesAumCrEnDa6lQ3GtJSsaLGWrGeJzxeZW0csOwS62gXnUlZNo-X_L7xx8PjbvxLpg-rNrGyRLLnzzOi9RRoKVnKfQ_nFvV3i8ThhPzebM671ZEuNcUJ2y0nC49OLuAho1xoEV9DEZEODKS-1QFXfxt1i3r9uLXJVp4NRqTWSjoEmKv5YBJJi2UVVf-kicZk572JiIiiUgeiJOughs6O9ww9w0CsH2zvRGjyRLN7DE5vvqnmV_vCnehx0fuzuEs",
            duration: "3:45",
            audioUrl: "#" // URL do áudio seria colocada aqui
        },
        {
            title: "Músicas para Oração",
            artist: "Instrumental",
            category: "instrumental",
            albumArt: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnRTtBSO4Fikko4TEibK4Z_BEjqYbvmzjR-2MlNhK8K7I2lGAAAmxbyXO87QmsMyPeMreLf0fWemDM6WDersiTGkvSWiRODQwSVSz7kKpxK6Y35c2fVFA4TF32utN9rOMwY88bzcLI4nv30XerxiHdyT9JLlodvgz3JuGEaT827TVbnGPazU1XDkadqeNJd7xBu-Nybu61CdZ2zIKew4oCEh6fsHQrTXhG6Y30ferEpbrTYRyYoEdYc-i47M2COXIaDIyhhGhEp10",
            duration: "4:20",
            audioUrl: "#"
        },
        {
            title: "Caminho de Paz",
            artist: "Artista Novo",
            category: "contemporary",
            albumArt: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPwqOnXtQUBtcWLThYNBlF6gh4yU5z08BjdiAX7HjcC0oxbLJhBe_iHqjWmIC0A7udSlFJs-fyBoY1eFGrH-wkTAXGfKC_TKgpMv9zjnRdlFPblUUIJq6x-Xg3HyAM_sNy4yCoGiL5hqHtIuHdepx7BAzTIkMRtntzPssSdotWyXrSpAF9ZfXNgBFQ17eOkjzVs8oK1skaUzg2i45NtwUsSULODtrXYyErbPGEghYKUIUn0-K8dmJkTSvNeVLnt30JiwQkxumrWe8",
            duration: "3:15",
            audioUrl: "#"
        },
        {
            title: "Cantos Sacros",
            artist: "Coro da Catedral",
            category: "gregorian",
            albumArt: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3c7LfKoUaCh_26CT_gF4msqshQW4325ALz4OEkTXMYMa3SDGjyA1Zjyos4dWeduRGmp6uOB_UqJqDHDz3Hh40c8AVXd6bIpT5yD4OnG0ZJ7vuF_zxoYc7RdQVMANrFJv9tlknpblzK6MW1x881tSmbXBHajGOixNUwAj_fOooeSIbZE2rRV_mn2VfeZoK4ME7ch4qD93NGCwg6SiWAtaivfLwW4XlS2Ugti7954xUyBew1UqJe1ZQ3eLpG7RLkEXubaHhRo0zQCU",
            duration: "5:10",
            audioUrl: "#"
        },
        {
            title: "Nova Manhã",
            artist: "Ministério Adorai",
            category: "contemporary",
            albumArt: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbQEwNLblEt4DjQ7Ys7OZaX8slFb4brne2XgBKR_h7w-fHYBDwpPCz3MSPaHjsVWW3S6UHrEBMk3IIF0LXFQj3finYaLcomimkupSPPfs7jJTFn232jMK_Zg0Bg85ifdCdHgDOiv0m3WDDFvGxSYcT0wcUyW8ixwCHrOF1843IpJx4U1GeZ38ik7K77pl1DxSFx3vnl87aqp-Q_w_-QDeYE3aqgfGu3rC2MT8HH3j3qML-jkuNBvOpsBjY3ZCUKka13E8yGAgsZJk",
            duration: "3:50",
            audioUrl: "#"
        }
    ];

    // Inicializar player
    function initializePlayer() {
        updatePlayerDisplay();
        totalTime.textContent = songs[currentSongIndex].duration;
        
        // Configurar volume inicial
        audioPlayer.volume = 0.7;
        volumeBar.style.width = '70%';
    }

    // Atualizar display do player
    function updatePlayerDisplay() {
        const currentSong = songs[currentSongIndex];
        currentSongTitle.textContent = currentSong.title;
        currentSongArtist.textContent = currentSong.artist;
        currentAlbumArt.style.backgroundImage = `url('${currentSong.albumArt}')`;
        totalTime.textContent = currentSong.duration;
    }

    // Tocar música
    function playSong(index) {
        currentSongIndex = index;
        const song = songs[currentSongIndex];
        
        // Em um ambiente real, aqui carregaríamos o áudio real
        // if (song.audioUrl) {
            audioPlayer.src = song.audioUrl;
        } else {
            audioPlayer.removeAttribute('src');
            audioPlayer.load();
        }
        
        updatePlayerDisplay();
        playPauseIcon.textContent = 'pause';
        isPlaying = true;
        
        // Simular progresso da música (em ambiente real usaríamos eventos de áudio)
        startProgressSimulation();
    }

    // Pausar música
    function pauseSong() {
        playPauseIcon.textContent = 'play_arrow';
        isPlaying = false;
        clearInterval(progressInterval);
    }

    // Simular progresso da música (para demonstração)
    function startProgressSimulation() {
        let progress = 0;
        const totalDuration = 225; // 3:45 em segundos
        
        clearInterval(progressInterval);
        progressInterval = setInterval(() => {
            if (progress >= totalDuration) {
                clearInterval(progressInterval);
                playNextSong();
                return;
            }
            
            progress++;
            const progressPercent = (progress / totalDuration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            
            // Atualizar tempo atual
            const minutes = Math.floor(progress / 60);
            const seconds = progress % 60;
            currentTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    // Próxima música
    function playNextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        playSong(currentSongIndex);
    }

    // Música anterior
    function playPreviousSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        playSong(currentSongIndex);
    }

    // Filtrar músicas
    function filterSongs(filter) {
        currentFilter = filter;
        
        musicCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Buscar músicas
    function searchSongs(query) {
        const searchTerm = query.toLowerCase();
        
        musicCards.forEach(card => {
            const title = card.getAttribute('data-title').toLowerCase();
            const artist = card.getAttribute('data-artist').toLowerCase();
            const category = card.getAttribute('data-category');
            
            const matchesSearch = title.includes(searchTerm) || artist.includes(searchTerm);
            const matchesFilter = currentFilter === 'all' || category === currentFilter;
            
            if (matchesSearch && matchesFilter) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Event Listeners

    // Botões de play nas músicas
    playButtons.forEach((button, index) => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            playSong(index);
        });
    });

    // Cards de música (clique para tocar)
    musicCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            playSong(index);
        });
    });

    // Controles do player
    playPauseButton.addEventListener('click', () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong(currentSongIndex);
        }
    });

    prevButton.addEventListener('click', playPreviousSong);
    nextButton.addEventListener('click', playNextSong);

    // Filtros
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Remover classe active de todos os chips
            filterChips.forEach(c => c.classList.remove('active'));
            
            // Adicionar classe active ao chip clicado
            chip.classList.add('active');
            
            // Aplicar filtro
            const filter = chip.getAttribute('data-filter');
            filterSongs(filter);
            
            // Reaplicar busca se houver termo de busca
            if (searchInput.value) {
                searchSongs(searchInput.value);
            }
        });
    });

    // Busca
    searchInput.addEventListener('input', (e) => {
        searchSongs(e.target.value);
    });

    // Controle de volume (simulado)
    volumeBar.parentElement.addEventListener('click', (e) => {
        const volumeContainer = e.currentTarget.getBoundingClientRect();
        const clickPosition = e.clientX - volumeContainer.left;
        const volumeWidth = volumeContainer.width;
        const volumePercent = (clickPosition / volumeWidth) * 100;
        
        volumeBar.style.width = `${volumePercent}%`;
        audioPlayer.volume = volumePercent / 100;
    });

    // Controle de progresso (simulado)
    progressBar.parentElement.addEventListener('click', (e) => {
        const progressContainer = e.currentTarget.getBoundingClientRect();
        const clickPosition = e.clientX - progressContainer.left;
        const progressWidth = progressContainer.width;
        const progressPercent = (clickPosition / progressWidth) * 100;
        
        progressBar.style.width = `${progressPercent}%`;
        
        // Em ambiente real, atualizaríamos o tempo atual do áudio
        const totalDuration = 225; // 3:45 em segundos
        const newTime = (progressPercent / 100) * totalDuration;
        const minutes = Math.floor(newTime / 60);
        const seconds = Math.floor(newTime % 60);
        currentTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    });

    // Inicializar
    initializePlayer();
});