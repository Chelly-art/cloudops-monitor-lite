/**
 * Dashboard Router & Component Renderer
 */

// Simulated Data Store
const State = {
    servers: [
        { id: 'srv-us-east', name: 'us-east-cluster-01', ip: '10.0.1.45', region: 'us-east-1', status: 'Online', load: '32%' },
        { id: 'srv-eu-west', name: 'eu-west-db-main', ip: '10.0.2.88', region: 'eu-west-1', status: 'Online', load: '68%' },
        { id: 'srv-ap-south', name: 'ap-south-worker', ip: '10.0.3.12', region: 'ap-south-1', status: 'Degraded', load: '89%' }
    ],
    containers: [
        { id: 'c-101', name: 'nginx-proxy', image: 'nginx:alpine', status: 'Running', load: '1.2%' },
        { id: 'c-102', name: 'api-gateway', image: 'node:18-alpine', status: 'Running', load: '14.5%' },
        { id: 'c-103', name: 'postgres-db', image: 'postgres:15', status: 'Running', load: '8.3%' },
        { id: 'c-104', name: 'redis-cache', image: 'redis:7-alpine', status: 'Stopped', load: '0.0%' }
    ],
    alerts: [
        { title: 'High Memory Threshold', detail: 'eu-west-db-main exceeded 85% RAM for 5 consecutive minutes.', level: 'critical', time: '10 mins ago' },
        { title: 'Container Restart Warning', detail: 'api-gateway container restarted automatically.', level: 'warning', time: '1 hour ago' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Navigation Tab Switcher
    const navItems = Utils.$$('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = item.getAttribute('data-tab');
            if (!targetTab) return;

            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            Utils.$$('.tab-view').forEach(view => view.classList.remove('active'));
            const activeView = Utils.$(`#view-${targetTab}`);
            if (activeView) activeView.classList.add('active');
        });
    });

    // 2. SVG Line Charts Initialization
    const cpuChart = new RealtimeChart('cpu-chart', { color: '#2563EB' });
    const memoryChart = new RealtimeChart('memory-chart', { color: '#10B981' });

    for (let i = 0; i < 20; i++) {
        cpuChart.update(Utils.getRandomInt(30, 60));
        memoryChart.update(Utils.getRandomInt(40, 70));
    }

    // 3. Render Component Views
    renderServers();
    renderContainers();
    renderAlerts();
    
    // Seed initial logs
    Utils.addLog('System initialization complete.', 'SUCCESS');
    Utils.addLog('Connected to cloud infrastructure agent.', 'INFO');

    // 4. Live Telemetry Interval
    setInterval(() => {
        const nextCpu = Utils.getRandomInt(25, 85);
        const nextMem = Utils.getRandomInt(45, 80);

        const cpuVal = Utils.$('#val-cpu');
        const cpuFill = Utils.$('#fill-cpu');
        const memVal = Utils.$('#val-mem');
        const memFill = Utils.$('#fill-mem');

        if (cpuVal) cpuVal.textContent = `${nextCpu}%`;
        if (cpuFill) cpuFill.style.width = `${nextCpu}%`;

        if (memVal) memVal.textContent = `${nextMem}%`;
        if (memFill) memFill.style.width = `${nextMem}%`;

        cpuChart.update(nextCpu);
        memoryChart.update(nextMem);

        const timeElement = Utils.$('#last-updated');
        if (timeElement) timeElement.textContent = `Updated ${Utils.formatTimestamp()}`;
    }, 5000);

    // Event listener for adding server
    const addBtn = Utils.$('#btn-add-server');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const newId = `srv-${Utils.getRandomInt(100, 999)}`;
            State.servers.push({
                id: newId,
                name: `worker-node-${newId}`,
                ip: `10.0.4.${Utils.getRandomInt(10, 250)}`,
                region: 'us-west-2',
                status: 'Online',
                load: '12%'
            });
            renderServers();
            Utils.showToast(`Server ${newId} provisioned successfully!`, 'success');
        });
    }
});

function renderServers() {
    const grid = Utils.$('#server-nodes-grid');
    if (!grid) return;
    grid.innerHTML = State.servers.map(srv => `
        <div class="server-card">
            <div class="server-header">
                <strong>${srv.name}</strong>
                <span class="badge ${srv.status === 'Online' ? 'badge-success' : 'badge-warning'}">${srv.status}</span>
            </div>
            <div class="server-meta">
                <span><strong>IP:</strong> ${srv.ip}</span>
                <span><strong>Region:</strong> ${srv.region}</span>
                <span><strong>Current CPU Load:</strong> ${srv.load}</span>
            </div>
            <button class="action-btn" style="margin-top: 14px; width: 100%;" onclick="Utils.showToast('Rebooting ${srv.name}...', 'warning')">Reboot Node</button>
        </div>
    `).join('');
}

function renderContainers() {
    const tbody = Utils.$('#container-table-body');
    if (!tbody) return;
    tbody.innerHTML = State.containers.map(c => `
        <tr>
            <td><code>${c.id}</code></td>
            <td><strong>${c.name}</strong></td>
            <td><code>${c.image}</code></td>
            <td><span class="badge ${c.status === 'Running' ? 'badge-success' : 'badge-critical'}">${c.status}</span></td>
            <td>${c.load}</td>
            <td>
                <button class="action-btn" onclick="Utils.showToast('Toggled container state for ${c.name}', 'info')">
                    ${c.status === 'Running' ? '⏹️ Stop' : '▶️ Start'}
                </button>
            </td>
        </tr>
    `).join('');
}

function renderAlerts() {
    const list = Utils.$('#alerts-list');
    if (!list) return;
    list.innerHTML = State.alerts.map(a => `
        <div class="server-card" style="border-left: 4px solid var(--${a.level === 'critical' ? 'critical' : 'warning'});">
            <div class="server-header">
                <strong style="color: var(--${a.level === 'critical' ? 'critical' : 'warning'});">${a.title}</strong>
                <small style="color: var(--text-muted);">${a.time}</small>
            </div>
            <p style="font-size: 0.9rem; color: var(--text-muted);">${a.detail}</p>
        </div>
    `).join('');
}