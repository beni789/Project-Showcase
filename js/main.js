/* ============================================
   BENZ.SYSTEM — MAIN JAVASCRIPT
   Semua komentar dalam Bahasa Indonesia
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // DATA FILE MANUAL — Tambah file baru di sini
    // ==========================================
    const systemFiles = [
        {
            name: "portfolio.html",
            type: "page",
            status: "live",
            size: "12.4 KB",
            edited: "2h ago",
            description: "Main portfolio website",
            url: "fortofolio.html"
        },
        {
            name: "toren master.html",
            type: "page",
            status: "live",
            size: "8.2 KB",
            edited: "1d ago",
            description: "game fill water into the tower and sell it then upgrade ",
            url: "toren.html"
        },
        {
            name: "blog.html",
            type: "page",
            status: "draft",
            size: "5.1 KB",
            edited: "3d ago",
            description: "Blog system (under development)",
            url: "./blog.html"
        },
        {
            name: "landing-v1.html",
            type: "page",
            status: "offline",
            size: "3.5 KB",
            edited: "1w ago",
            description: "Legacy landing page",
            url: "./landing-v1.html"
        }
    ];

    // ==========================================
    // KONFIGURASI AUDIO — Suara keyboard
    // ==========================================
    let audioContext = null;
    let isSoundEnabled = true;
    const savedSoundPref = localStorage.getItem('benz_sound');
    if (savedSoundPref !== null) {
        isSoundEnabled = savedSoundPref === 'true';
    }

    // Inisialisasi AudioContext (harus setelah interaksi user)
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // Fungsi memainkan suara keyboard click menggunakan Web Audio API
    function playKeyboardSound() {
        if (!isSoundEnabled || !audioContext) return;

        try {
            // Membuat oscillator untuk suara click mekanis
            const osc = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            // Filter untuk suara lebih "clicky"
            const filter = audioContext.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 2000;

            osc.type = 'square';
            // Frekuensi acak untuk variasi suara setiap tombol
            osc.frequency.setValueAtTime(800 + Math.random() * 400, audioContext.currentTime);

            // Volume sangat rendah (-20dB)
            gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);

            osc.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioContext.destination);

            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + 0.05);
        } catch (e) {
            // Jika audio gagal, silent fail
        }
    }

    // Update icon sound toggle
    function updateSoundIcon() {
        const onIcon = document.getElementById('sound-on-icon');
        const offIcon = document.getElementById('sound-off-icon');
        if (onIcon && offIcon) {
            onIcon.classList.toggle('hidden', !isSoundEnabled);
            offIcon.classList.toggle('hidden', isSoundEnabled);
        }
    }

    // ==========================================
    // PRELOADER / BOOT SEQUENCE
    // ==========================================
    const preloader = document.getElementById('preloader');
    const loadingBar = document.getElementById('loading-bar');
    const loadingStatus = document.getElementById('loading-status');
    const preloaderComplete = document.getElementById('preloader-complete');
    const enterSystemBtn = document.getElementById('enter-system-btn');
    const mainContent = document.getElementById('main-content');

    let progress = 0;
    const totalDuration = 2500; // 2.5 detik
    const intervalTime = 25; // Update setiap 25ms
    const increment = 100 / (totalDuration / intervalTime);

    const statusTexts = [
        { threshold: 0, text: "Connecting to server..." },
        { threshold: 30, text: "Loading files..." },
        { threshold: 60, text: "Loading interface..." },
        { threshold: 90, text: "Finalizing..." }
    ];

    const bootInterval = setInterval(() => {
        progress += increment;

        if (progress >= 100) {
            progress = 100;
            clearInterval(bootInterval);

            // Tampilkan checkmark dan tombol ENTER
            setTimeout(() => {
                if (loadingBar) loadingBar.style.width = '100%';
                if (loadingStatus) loadingStatus.style.display = 'none';
                if (preloaderComplete) preloaderComplete.classList.remove('hidden');
            }, 300);
        }

        if (loadingBar) loadingBar.style.width = progress + '%';

        // Update status text berdasarkan progress
        const currentStatus = statusTexts.reverse().find(s => progress >= s.threshold);
        statusTexts.reverse(); // Reset array
        if (currentStatus && loadingStatus) {
            loadingStatus.textContent = currentStatus.text;
        }
    }, intervalTime);

    // Tombol ENTER SYSTEM — harus diklik user
    if (enterSystemBtn) {
        enterSystemBtn.addEventListener('click', () => {
            // Inisialisasi audio setelah interaksi user
            initAudio();
            playKeyboardSound();

            // Fade out preloader
            preloader.classList.add('preloader-fade-out');

            setTimeout(() => {
                preloader.style.display = 'none';

                // Tampilkan main content dengan efek rendering
                mainContent.style.opacity = '1';

                // Stagger animation untuk setiap section
                const sections = mainContent.querySelectorAll('.scroll-reveal');
                sections.forEach((section, index) => {
                    setTimeout(() => {
                        section.classList.add('revealed');
                    }, index * 100);
                });

                // Glitch effect pada hero title
                setTimeout(() => {
                    const heroTitle = document.getElementById('hero-title');
                    if (heroTitle) heroTitle.classList.add('glitch-effect');
                }, sections.length * 100 + 200);

            }, 600);
        });
    }

    // ==========================================
    // CUSTOM CURSOR
    // ==========================================
    const cursor = document.getElementById('cursor');
    let cursorX = 0, cursorY = 0;
    let currentX = 0, currentY = 0;

    if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
        });

        function animateCursor() {
            currentX += (cursorX - currentX) * 0.15;
            currentY += (cursorY - currentY) * 0.15;

            cursor.style.left = currentX + 'px';
            cursor.style.top = currentY + 'px';

            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        // Kecilkan cursor saat hover elemen klik
        const clickables = document.querySelectorAll('a, button, [role="button"], input, textarea, select, label, .cursor-pointer');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(0.6)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }

    // ==========================================
    // SOUND TOGGLE
    // ==========================================
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        updateSoundIcon();

        soundToggle.addEventListener('click', () => {
            initAudio();
            isSoundEnabled = !isSoundEnabled;
            localStorage.setItem('benz_sound', isSoundEnabled);
            updateSoundIcon();
            playKeyboardSound();
        });
    }

    // ==========================================
    // GUI/CLI TOGGLE (placeholder untuk future)
    // ==========================================
    const guiCliToggle = document.getElementById('gui-cli-toggle');
    const cliIcon = document.getElementById('cli-icon');
    const guiIcon = document.getElementById('gui-icon');

    if (guiCliToggle) {
        guiCliToggle.addEventListener('click', () => {
            initAudio();
            playKeyboardSound();
            // Toggle icon saja, fungsi GUI mode bisa ditambahkan nanti
            cliIcon.classList.toggle('hidden');
            guiIcon.classList.toggle('hidden');
        });
    }

    // ==========================================
    // SYSTEM MONITOR — CPU, RAM, UPTIME, NETWORK
    // ==========================================

    // CPU: Update random 30-88% setiap 3-8 detik
    const cpuBar = document.getElementById('cpu-bar');
    const cpuText = document.getElementById('cpu-text');

    function updateCPU() {
        if (cpuBar && cpuText) {
            const value = Math.floor(Math.random() * (88 - 30 + 1)) + 30;
            cpuBar.style.width = value + '%';
            cpuText.textContent = value + '%';
        }
        // Jadwalkan update berikutnya dengan interval acak 3-8 detik
        setTimeout(updateCPU, Math.random() * 5000 + 3000);
    }
    updateCPU();

    // RAM: Update random 40-50% setiap 5-12 detik (sangat stabil)
    const ramBar = document.getElementById('ram-bar');
    const ramText = document.getElementById('ram-text');

    function updateRAM() {
        if (ramBar && ramText) {
            const value = Math.floor(Math.random() * (50 - 40 + 1)) + 40;
            ramBar.style.width = value + '%';
            ramText.textContent = value + '%';
        }
        setTimeout(updateRAM, Math.random() * 7000 + 5000);
    }
    updateRAM();

    // UPTIME: Mulai dari 12d 00:00:00, increment tiap detik
    const uptimeText = document.getElementById('uptime-text');
    let uptimeSeconds = 0;

    function updateUptime() {
        if (uptimeText) {
            uptimeSeconds++;
            const days = 12 + Math.floor(uptimeSeconds / 86400);
            const hours = Math.floor((uptimeSeconds % 86400) / 3600);
            const minutes = Math.floor((uptimeSeconds % 3600) / 60);
            const seconds = uptimeSeconds % 60;

            const pad = (n) => String(n).padStart(2, '0');
            uptimeText.textContent = `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        }
    }
    setInterval(updateUptime, 1000);

    // NETWORK: Ping fluctuate 40-60ms setiap 5-10 detik
    const headerPing = document.getElementById('header-ping');
    const networkPing = document.getElementById('network-ping');

    function updatePing() {
        const ping = Math.floor(Math.random() * (60 - 40 + 1)) + 40;
        if (headerPing) headerPing.textContent = ping + 'ms';
        if (networkPing) networkPing.textContent = ping + 'ms';
        setTimeout(updatePing, Math.random() * 5000 + 5000);
    }
    updatePing();

    // ==========================================
    // TERMINAL / CLI SYSTEM
    // ==========================================
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    const terminalCursor = document.getElementById('terminal-cursor');

    // Command history untuk navigasi arrow up/down
    let commandHistory = [];
    let historyIndex = -1;

    // Fungsi menambahkan baris ke terminal output
    function addTerminalLine(content, type = 'output') {
        const line = document.createElement('div');
        line.className = 'terminal-line text-xs font-mono';

        if (type === 'command') {
            line.innerHTML = `<span class="text-[#22C55E]">user@guest</span><span class="text-[#F1F5F9]">:~$</span> <span class="text-[#F1F5F9]">${content}</span>`;
        } else if (type === 'error') {
            line.innerHTML = `<span class="text-[#EF4444]">${content}</span>`;
        } else if (type === 'success') {
            line.innerHTML = `<span class="text-[#22C55E]">${content}</span>`;
        } else if (type === 'link') {
            line.innerHTML = content;
        } else {
            line.innerHTML = `<span class="text-[#94A3B8]">${content}</span>`;
        }

        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    // Fungsi typing effect untuk output terminal
    function typeTerminalOutput(text, type = 'output', speed = 15) {
        return new Promise((resolve) => {
            const line = document.createElement('div');
            line.className = 'terminal-line text-xs font-mono text-[#94A3B8]';
            terminalOutput.appendChild(line);

            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    line.textContent += text.charAt(i);
                    playKeyboardSound();
                    i++;
                    terminalOutput.scrollTop = terminalOutput.scrollHeight;
                } else {
                    clearInterval(typeInterval);
                    if (type === 'error') line.classList.add('text-[#EF4444]');
                    if (type === 'success') line.classList.add('text-[#22C55E]');
                    resolve();
                }
            }, speed);
        });
    }

    // Daftar commands yang tersedia
    const commands = {
        help: {
            description: 'Tampilkan daftar perintah yang tersedia',
            execute: () => {
                addTerminalLine('');
                addTerminalLine('AVAILABLE COMMANDS:', 'success');
                addTerminalLine('  help              — Show this help message');
                addTerminalLine('  ls                — List all files');
                addTerminalLine('  cat <filename>    — View file details');
                addTerminalLine('  status            — Show system status');
                addTerminalLine('  clear             — Clear terminal');
                addTerminalLine('  about             — About this system');
                addTerminalLine('  open <filename>   — Open file in browser');
                addTerminalLine('');
            }
        },

        ls: {
            description: 'List semua file dalam sistem',
            execute: () => {
                addTerminalLine('');
                addTerminalLine('TOTAL FILES: ' + systemFiles.length, 'success');
                addTerminalLine('');

                systemFiles.forEach(file => {
                    const statusColor = file.status === 'live' ? 'text-[#22C55E]' : 
                                       file.status === 'draft' ? 'text-[#EAB308]' : 'text-[#64748B]';
                    const statusDot = file.status === 'live' ? '●' : 
                                       file.status === 'draft' ? '◐' : '○';

                    addTerminalLine(
                        `  ${statusDot} <span class="${statusColor}">${file.name}</span>  <span class="text-[#64748B]">|</span>  ${file.size}  <span class="text-[#64748B]">|</span>  ${file.status.toUpperCase()}  <span class="text-[#64748B]">|</span>  ${file.edited}`,
                        'link'
                    );
                });
                addTerminalLine('');
            }
        },

        cat: {
            description: 'Lihat detail file',
            execute: (args) => {
                if (!args || args.length === 0) {
                    addTerminalLine('Usage: cat <filename>', 'error');
                    return;
                }

                const filename = args[0];
                const file = systemFiles.find(f => f.name.toLowerCase() === filename.toLowerCase());

                if (!file) {
                    addTerminalLine(`File not found: ${filename}`, 'error');
                    return;
                }

                const statusColor = file.status === 'live' ? '#22C55E' : 
                                   file.status === 'draft' ? '#EAB308' : '#64748B';

                addTerminalLine('');
                addTerminalLine('FILE DETAILS:', 'success');
                addTerminalLine(`  Name:        ${file.name}`);
                addTerminalLine(`  Type:        ${file.type}`);
                addTerminalLine(`  Status:      <span style="color:${statusColor}">${file.status.toUpperCase()}</span>`, 'link');
                addTerminalLine(`  Size:        ${file.size}`);
                addTerminalLine(`  Edited:      ${file.edited}`);
                addTerminalLine(`  Description: ${file.description}`);
                addTerminalLine(`  URL:         <span class="text-[#3B82F6] cursor-pointer hover:underline" onclick="window.open('${file.url}', '_blank')">${file.url}</span>`, 'link');
                addTerminalLine('');
            }
        },

        status: {
            description: 'Tampilkan status sistem',
            execute: () => {
                const liveCount = systemFiles.filter(f => f.status === 'live').length;
                const draftCount = systemFiles.filter(f => f.status === 'draft').length;
                const offlineCount = systemFiles.filter(f => f.status === 'offline').length;

                addTerminalLine('');
                addTerminalLine('SYSTEM STATUS:', 'success');
                addTerminalLine(`  CPU Usage:     ${cpuText ? cpuText.textContent : 'N/A'}`);
                addTerminalLine(`  RAM Usage:     ${ramText ? ramText.textContent : 'N/A'}`);
                addTerminalLine(`  Uptime:        ${uptimeText ? uptimeText.textContent : 'N/A'}`);
                addTerminalLine(`  Network:       ONLINE (${headerPing ? headerPing.textContent : 'N/A'})`);
                addTerminalLine('');
                addTerminalLine('FILE STATUS:', 'success');
                addTerminalLine(`  Live:     <span class="text-[#22C55E]">${liveCount}</span>`, 'link');
                addTerminalLine(`  Draft:    <span class="text-[#EAB308]">${draftCount}</span>`, 'link');
                addTerminalLine(`  Offline:  <span class="text-[#64748B]">${offlineCount}</span>`, 'link');
                addTerminalLine('');
            }
        },

        clear: {
            description: 'Bersihkan terminal',
            execute: () => {
                terminalOutput.innerHTML = '';
            }
        },

        about: {
            description: 'Tentang sistem ini',
            execute: () => {
                addTerminalLine('');
                addTerminalLine('BENZ.SYSTEM vPre1.0.0', 'success');
                addTerminalLine('  Centralized command interface');
                addTerminalLine('  Built with HTML, Tailwind CSS, and vanilla JS');
                addTerminalLine('  Dark theme only. Futuristic terminal aesthetic.');
                addTerminalLine('');
                addTerminalLine('  Type "help" for available commands.');
                addTerminalLine('');
            }
        },

        open: {
            description: 'Buka file di browser',
            execute: (args) => {
                if (!args || args.length === 0) {
                    addTerminalLine('Usage: open <filename>', 'error');
                    return;
                }

                const filename = args[0];
                const file = systemFiles.find(f => f.name.toLowerCase() === filename.toLowerCase());

                if (!file) {
                    addTerminalLine(`File not found: ${filename}`, 'error');
                    return;
                }

                if (file.status === 'offline') {
                    addTerminalLine(`Cannot open: ${filename} is offline`, 'error');
                    return;
                }

                addTerminalLine(`Opening ${filename}...`, 'success');
                setTimeout(() => {
                    window.open(file.url, '_blank');
                }, 500);
            }
        }
    };

    // Event listener untuk input terminal
    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            // Mainkan suara keyboard saat mengetik
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
                initAudio();
                playKeyboardSound();
            }

            // Enter: eksekusi command
            if (e.key === 'Enter') {
                const input = terminalInput.value.trim();
                if (input) {
                    // Tambahkan ke history
                    commandHistory.push(input);
                    historyIndex = commandHistory.length;

                    // Tampilkan command di output
                    addTerminalLine(input, 'command');

                    // Parse command dan args
                    const parts = input.split(' ');
                    const cmd = parts[0].toLowerCase();
                    const args = parts.slice(1);

                    // Eksekusi command
                    if (commands[cmd]) {
                        commands[cmd].execute(args);
                    } else {
                        addTerminalLine(`Command not found: ${cmd}`, 'error');
                        addTerminalLine('Type "help" for available commands.');
                    }
                }

                terminalInput.value = '';
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }

            // Arrow Up: navigasi history ke belakang
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = commandHistory[historyIndex];
                }
            }

            // Arrow Down: navigasi history ke depan
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    terminalInput.value = '';
                }
            }

            // Tab: autocomplete (sederhana)
            if (e.key === 'Tab') {
                e.preventDefault();
                const input = terminalInput.value.trim();
                if (input.startsWith('cat ') || input.startsWith('open ')) {
                    const prefix = input.split(' ')[1] || '';
                    const matches = systemFiles.filter(f => 
                        f.name.toLowerCase().startsWith(prefix.toLowerCase())
                    );
                    if (matches.length === 1) {
                        terminalInput.value = input.split(' ')[0] + ' ' + matches[0].name;
                    }
                }
            }
        });

        // Focus input saat klik di area terminal
        terminalOutput.addEventListener('click', () => {
            terminalInput.focus();
        });

        // Auto focus input
        terminalInput.focus();
    }

    // ==========================================
    // PARTICLE SYSTEM — Canvas background
    // ==========================================
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 40; // Jumlah partikel 30-50
    const connectionDistance = 100; // Jarak maksimal untuk garis koneksi

    // Resize canvas ke ukuran viewport
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Kelas Particle
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 1; // Ukuran 2-3px
            this.speedX = (Math.random() - 0.5) * 0.3; // Gerak lambat
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.2 + 0.2; // Opacity 20-40%
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce di tepi layar
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(96, 165, 253, ${this.opacity})`; // #60A5FD
            ctx.fill();
        }
    }

    // Inisialisasi partikel
    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();

    // Gambar garis koneksi antar partikel
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    const opacity = (1 - distance / connectionDistance) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(96, 165, 253, ${opacity})`; // #60A5FD
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        drawConnections();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ==========================================
    // SCROLL REVEAL (IntersectionObserver)
    // ==========================================
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    scrollRevealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // SMOOTH SCROLL UNTUK NAV LINKS (jika ada)
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ==========================================
    // RESPONSIVE: Hide cursor on touch devices
    // ==========================================
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
        if (cursor) cursor.style.display = 'none';
    }

}); // End DOMContentLoaded
