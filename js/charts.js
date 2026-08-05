/**
 * Custom SVG Line Chart Engine
 */
class RealtimeChart {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.maxPoints = options.maxPoints || 20;
        this.data = new Array(this.maxPoints).fill(0);
        this.strokeColor = options.color || '#2563EB';
        this.init();
    }

    init() {
        if (!this.container) return;
        this.container.innerHTML = `
            <svg width="100%" height="100%" viewBox="0 0 500 150" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="gradient-${this.container.id}" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="${this.strokeColor}" stop-opacity="0.4"/>
                        <stop offset="100%" stop-color="${this.strokeColor}" stop-opacity="0.0"/>
                    </linearGradient>
                </defs>
                <path class="chart-area" fill="url(#gradient-${this.container.id})" d="" />
                <path class="chart-line" stroke="${this.strokeColor}" fill="none" d="" />
            </svg>
        `;
        this.pathLine = this.container.querySelector('.chart-line');
        this.pathArea = this.container.querySelector('.chart-area');
    }

    update(newValue) {
        this.data.push(newValue);
        if (this.data.length > this.maxPoints) {
            this.data.shift();
        }
        this.render();
    }

    render() {
        if (!this.pathLine || !this.pathArea) return;
        const width = 500;
        const height = 150;
        const step = width / (this.maxPoints - 1);

        let pathD = '';
        this.data.forEach((val, idx) => {
            const x = idx * step;
            const y = height - (val / 100) * height;
            pathD += `${idx === 0 ? 'M' : 'L'} ${x} ${y} `;
        });

        this.pathLine.setAttribute('d', pathD);
        const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;
        this.pathArea.setAttribute('d', areaD);
    }
}