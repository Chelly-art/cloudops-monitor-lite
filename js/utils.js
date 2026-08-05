/**
 * Utility Library, Navigation & Authentication Controller
 */

const Utils = {
    $: (selector) => document.querySelector(selector),
    $$: (selector) => document.querySelectorAll(selector),

    // Toast Notification Banner Engine
    showToast(message, type = 'info') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Theme Engine Handler
    initTheme() {
        const savedTheme = localStorage.getItem('cloudops_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        return savedTheme;
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('cloudops_theme', newTheme);
        Utils.showToast(`Switched to ${newTheme} mode`, 'info');
    },

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    formatTimestamp(date = new Date()) {
        return date.toTimeString().split(' ')[0];
    },

    // Console Log Manager
    addLog(msg, level = 'INFO') {
        const viewer = document.getElementById('log-viewer');
        if (!viewer) return;
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `
            <span class="log-time">[${Utils.formatTimestamp()}]</span>
            <span class="log-level ${level}">${level}</span>
            <span class="log-msg">${msg}</span>
        `;
        viewer.prepend(entry);
    },

    clearLogs() {
        const viewer = document.getElementById('log-viewer');
        if (viewer) viewer.innerHTML = '';
        Utils.showToast('Console cleared', 'info');
    },

    triggerLogSimulation() {
        const levels = ['INFO', 'SUCCESS', 'WARNING', 'ERROR'];
        const msgs = [
            'API Gateway response latency spike detected (240ms)',
            'PostgreSQL auto-vacuum job completed successfully',
            'Redis cache hit ratio optimized to 94.2%',
            'Failed SSH login attempt from IP 192.168.1.104'
        ];
        const idx = Utils.getRandomInt(0, 3);
        Utils.addLog(msgs[idx], levels[idx]);
        Utils.showToast('New system log recorded', levels[idx].toLowerCase());
    }
};

// Authentication Handlers
function handleLogin(event) {
    event.preventDefault();
    const overlay = document.getElementById('login-overlay');
    if (overlay) {
        overlay.style.display = 'none';
        localStorage.setItem('cloudops_auth', 'true');
        Utils.showToast('Welcome back, Admin!', 'success');
        Utils.addLog('User admin@pipeops.io authenticated via SSO', 'SUCCESS');
    }
}

function handleLogout() {
    localStorage.removeItem('cloudops_auth');
    const overlay = document.getElementById('login-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        Utils.showToast('Signed out successfully', 'info');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Utils.initTheme();
    const themeBtn = Utils.$('#theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', () => Utils.toggleTheme());

    // Check saved session state
    const isAuthenticated = localStorage.getItem('cloudops_auth');
    const overlay = document.getElementById('login-overlay');
    if (overlay && isAuthenticated === 'true') {
        overlay.style.display = 'none';
    }
});