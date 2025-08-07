class SolarSystem {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.centerX = 0;
        this.centerY = 0;
        this.zoom = 1;
        this.speed = 1;
        this.showOrbits = true;
        this.showNames = true;
        this.time = 0;
        
        this.planets = [
            {
                name: '수성',
                color: '#8C7853',
                radius: 3,
                distance: 50,
                speed: 0.04,
                angle: 0,
                orbitColor: '#4A4A4A'
            },
            {
                name: '금성',
                color: '#E7CDCD',
                radius: 4,
                distance: 75,
                speed: 0.015,
                angle: 45,
                orbitColor: '#4A4A4A'
            },
            {
                name: '지구',
                color: '#6B93D6',
                radius: 4.5,
                distance: 100,
                speed: 0.01,
                angle: 90,
                orbitColor: '#4A4A4A'
            },
            {
                name: '화성',
                color: '#CD5C5C',
                radius: 3.5,
                distance: 130,
                speed: 0.008,
                angle: 135,
                orbitColor: '#4A4A4A'
            },
            {
                name: '목성',
                color: '#DAA520',
                radius: 12,
                distance: 180,
                speed: 0.002,
                angle: 180,
                orbitColor: '#4A4A4A'
            },
            {
                name: '토성',
                color: '#F4A460',
                radius: 10,
                distance: 230,
                speed: 0.0009,
                angle: 225,
                orbitColor: '#4A4A4A'
            },
            {
                name: '천왕성',
                color: '#40E0D0',
                radius: 7,
                distance: 280,
                speed: 0.0004,
                angle: 270,
                orbitColor: '#4A4A4A'
            },
            {
                name: '해왕성',
                color: '#4169E1',
                radius: 6.5,
                distance: 330,
                speed: 0.0001,
                angle: 315,
                orbitColor: '#4A4A4A'
            }
        ];
        
        this.setupCanvas();
        this.setupControls();
        this.animate();
    }
    
    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }
    
    setupControls() {
        const speedSlider = document.getElementById('speed');
        const speedValue = document.getElementById('speedValue');
        const showOrbitsCheckbox = document.getElementById('showOrbits');
        const showNamesCheckbox = document.getElementById('showNames');
        const zoomSlider = document.getElementById('zoom');
        const zoomValue = document.getElementById('zoomValue');
        
        speedSlider.addEventListener('input', (e) => {
            this.speed = parseFloat(e.target.value);
            speedValue.textContent = this.speed + 'x';
        });
        
        showOrbitsCheckbox.addEventListener('change', (e) => {
            this.showOrbits = e.target.checked;
        });
        
        showNamesCheckbox.addEventListener('change', (e) => {
            this.showNames = e.target.checked;
        });
        
        zoomSlider.addEventListener('input', (e) => {
            this.zoom = parseFloat(e.target.value);
            zoomValue.textContent = this.zoom + 'x';
        });
    }
    
    drawSun() {
        // 태양 그라데이션
        const gradient = this.ctx.createRadialGradient(
            this.centerX, this.centerY, 0,
            this.centerX, this.centerY, 25
        );
        gradient.addColorStop(0, '#FFFF00');
        gradient.addColorStop(0.3, '#FFD700');
        gradient.addColorStop(0.7, '#FF8C00');
        gradient.addColorStop(1, '#FF4500');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 25, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 태양 빛 효과
        this.ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            const x1 = this.centerX + Math.cos(angle) * 30;
            const y1 = this.centerY + Math.sin(angle) * 30;
            const x2 = this.centerX + Math.cos(angle) * 40;
            const y2 = this.centerY + Math.sin(angle) * 40;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
        
        // 태양 이름
        if (this.showNames) {
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('태양', this.centerX, this.centerY + 50);
        }
    }
    
    drawOrbits() {
        if (!this.showOrbits) return;
        
        this.planets.forEach(planet => {
            this.ctx.strokeStyle = planet.orbitColor;
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, planet.distance * this.zoom, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        });
    }
    
    drawPlanets() {
        this.planets.forEach(planet => {
            // 행성 위치 계산
            const x = this.centerX + Math.cos(planet.angle) * planet.distance * this.zoom;
            const y = this.centerY + Math.sin(planet.angle) * planet.distance * this.zoom;
            
            // 행성 그림자
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this.ctx.beginPath();
            this.ctx.arc(x + 2, y + 2, planet.radius * this.zoom, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 행성 그라데이션
            const gradient = this.ctx.createRadialGradient(
                x - planet.radius * this.zoom * 0.3, 
                y - planet.radius * this.zoom * 0.3, 
                0,
                x, y, planet.radius * this.zoom
            );
            gradient.addColorStop(0, this.lightenColor(planet.color, 0.3));
            gradient.addColorStop(1, planet.color);
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, planet.radius * this.zoom, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 행성 테두리
            this.ctx.strokeStyle = this.lightenColor(planet.color, 0.5);
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(x, y, planet.radius * this.zoom, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // 행성 이름
            if (this.showNames) {
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.font = '12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(planet.name, x, y + planet.radius * this.zoom + 15);
            }
            
            // 행성 궤도 업데이트
            planet.angle += planet.speed * this.speed;
        });
    }
    
    lightenColor(color, amount) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * amount * 100);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    
    drawStars() {
        this.ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 2;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawStars();
        this.drawOrbits();
        this.drawSun();
        this.drawPlanets();
        
        this.time += 0.016 * this.speed;
        requestAnimationFrame(() => this.animate());
    }
}

// 시뮬레이션 시작
window.addEventListener('load', () => {
    new SolarSystem();
});
