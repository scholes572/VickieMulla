/**
 * DIMENSIONAL LOVE PORTAL
 * For Vickie Mulla from Nelson
 * Reality-bending JavaScript
 */

// ============================================
// AUDIO SYSTEM WITH VISUALIZER
// ============================================

const audio = document.getElementById('cosmicAudio');
const audioCrystal = document.getElementById('audioCrystal');
const visualizerCanvas = document.getElementById('audioVisualizer');
const visualizerCtx = visualizerCanvas.getContext('2d');

let audioContext, analyser, dataArray;
let isPlaying = false;

// Auto-play when page loads
window.addEventListener('load', async () => {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        const source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        await audioContext.resume();
        await audio.play();
        audioCrystal.classList.add('playing');
        isPlaying = true;
        visualizeAudio();
    } catch (e) {
        console.log('Auto-play blocked. User interaction required.');
    }
});

audioCrystal.addEventListener('click', async () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        const source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        dataArray = new Uint8Array(analyser.frequencyBinCount);
    }
    
    if (isPlaying) {
        audio.pause();
        audioCrystal.classList.remove('playing');
    } else {
        await audioContext.resume();
        audio.play();
        audioCrystal.classList.add('playing');
        visualizeAudio();
    }
    isPlaying = !isPlaying;
});

// Touch support for mobile devices
audioCrystal.addEventListener('touchstart', async (e) => {
    e.preventDefault();
    audioCrystal.click();
});

function visualizeAudio() {
    visualizerCanvas.width = window.innerWidth;
    visualizerCanvas.height = window.innerHeight;
    
    // Always clear canvas
    visualizerCtx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
    
    // Get actual audio data if playing, or generate simulated data if paused
    let audioData;
    if (isPlaying && analyser) {
        analyser.getByteFrequencyData(dataArray);
        audioData = dataArray;
    } else {
        // Generate simulated wave data for paused state
        audioData = new Uint8Array(analyser ? analyser.frequencyBinCount : 64);
        const time = Date.now() / 1000;
        for (let i = 0; i < audioData.length; i++) {
            audioData[i] = Math.sin(time * 2 + i * 0.3) * 30 + Math.sin(time * 3 + i * 0.5) * 20 + 80;
        }
    }
    
    // Adjust bar width based on screen size
    const isMobile = window.innerWidth <= 768;
    const barMultiplier = isMobile ? 1.5 : 2.5;
    const barWidth = (visualizerCanvas.width / audioData.length) * barMultiplier;
    let barHeight;
    let x = 0;
    
    for (let i = 0; i < audioData.length; i++) {
        barHeight = audioData[i] * 1.5;
        
        const gradient = visualizerCtx.createLinearGradient(0, visualizerCanvas.height - barHeight, 0, visualizerCanvas.height);
        gradient.addColorStop(0, `hsl(${i * 2}, 100%, 50%)`);
        gradient.addColorStop(1, 'transparent');
        
        visualizerCtx.fillStyle = gradient;
        visualizerCtx.fillRect(x, visualizerCanvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
    }
    
    requestAnimationFrame(visualizeAudio);
}

// ============================================
// MULTI-LAYER PARTICLE SYSTEM
// ============================================

const particleConfigs = [
    { canvas: 'particleLayer1', count: 30, types: ['💖', '💕', '💗'], speed: 0.5, size: 25 },
    { canvas: 'particleLayer2', count: 20, types: ['🌹', '🌸', '🌺', '✨'], speed: 0.8, size: 20 },
    { canvas: 'particleLayer3', count: 15, types: ['💫', '⭐', '🌟'], speed: 1.2, size: 15 }
];

// Reduce particle counts on mobile for better performance
const isMobile = window.innerWidth <= 768;
if (isMobile) {
    particleConfigs.forEach(config => {
        config.count = Math.floor(config.count * 0.5);
        config.size = config.size * 0.7;
    });
}

particleConfigs.forEach(config => {
    const canvas = document.getElementById(config.canvas);
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    
    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -50;
            this.size = Math.random() * config.size + 10;
            this.speed = Math.random() * config.speed + 0.3;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 2;
            this.opacity = Math.random() * 0.4 + 0.2;
            this.type = config.types[Math.floor(Math.random() * config.types.length)];
            this.sway = Math.random() * 3;
            this.swaySpeed = Math.random() * 0.02 + 0.01;
            this.time = Math.random() * Math.PI * 2;
        }
        
        update() {
            this.y += this.speed;
            this.rotation += this.rotationSpeed;
            this.time += this.swaySpeed;
            this.x += Math.sin(this.time) * this.sway;
            
            if (this.y > canvas.height + 50) {
                this.reset();
            }
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.font = `${this.size}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Glow effect
            ctx.shadowBlur = 20;
            ctx.shadowColor = 'rgba(255, 0, 110, 0.5)';
            
            ctx.fillText(this.type, 0, 0);
            ctx.restore();
        }
    }
    
    for (let i = 0; i < config.count; i++) {
        particles.push(new Particle());
    }
    
    // Mouse interaction creates bursts
    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.9) {
            const burst = new Particle();
            burst.x = e.clientX;
            burst.y = e.clientY;
            burst.speed = Math.random() * 3 + 2;
            burst.size = Math.random() * 30 + 20;
            burst.opacity = 0.8;
            particles.push(burst);
            
            if (particles.length > config.count + 10) {
                particles.shift();
            }
        }
    });
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
});

// ============================================
// SCROLL PROGRESS ENERGY BEAM
// ============================================

const beamCore = document.querySelector('.beam-core');
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrolled / maxScroll) * 100;
    beamCore.style.width = progress + '%';
});

// ============================================
// NAVIGATION ORB SCROLLING
// ============================================

document.querySelectorAll('.nav-orb').forEach(orb => {
    orb.addEventListener('click', () => {
        const section = document.getElementById(orb.dataset.section);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    // Touch support for mobile
    orb.addEventListener('touchstart', (e) => {
        e.preventDefault();
        orb.click();
    });
});

// ============================================
// GALLERY TILE 3D TILT
// ============================================

document.querySelectorAll('.reality-tile').forEach(tile => {
    // Mouse move for desktop
    tile.addEventListener('mousemove', (e) => {
        const rect = tile.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        tile.querySelector('.tile-dimensions').style.transform = 
            `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    // Touch move for mobile
    tile.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const rect = tile.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        tile.querySelector('.tile-dimensions').style.transform = 
            `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    tile.addEventListener('mouseleave', () => {
        tile.querySelector('.tile-dimensions').style.transform = 
            'perspective(1000px) rotateX(0) rotateY(0)';
    });
    
    tile.addEventListener('touchend', () => {
        tile.querySelector('.tile-dimensions').style.transform = 
            'perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// ============================================
// INTERSECTION OBSERVER FOR REVEALS
// ============================================

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.timeline-event, .reality-tile').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
    observer.observe(el);
});

// ============================================
// CONSOLE EASTER EGG
// ============================================

console.log('%c⚛ DIMENSIONAL LOVE PORTAL ⚛', 'font-size: 30px; background: linear-gradient(90deg, #ff006e, #8338ec, #3a86ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold;');
console.log('%cFor Vickie Mulla', 'font-size: 20px; color: #ff006e;');
console.log('%cFrom Nelson, across all realities', 'font-size: 16px; color: #4cc9f0;');
console.log('%c∞ Love transcends dimensions ∞', 'font-size: 14px; color: #ffbe0b;');

// ============================================
// PARALLAX EFFECT
// ============================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    document.querySelectorAll('.floating-dimension').forEach((el, i) => {
        const speed = 0.5 + (i * 0.2);
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});