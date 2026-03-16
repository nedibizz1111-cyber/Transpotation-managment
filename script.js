/**
 * SwiftMove Logistics ERP - Global Configuration
 */
const CONFIG = {
    COMPANY_NAME: "SwiftMove Logistics ERP",
    LOGO_TEXT: "SwiftMove",
    SUPPORT_EMAIL: "support@swiftmove.com",
    DEFAULT_THEME: "light",
    CURRENCY: "$",
};

/**
 * State Management
 */
const State = {
    currentView: 'dashboard',
    theme: localStorage.getItem('theme') || CONFIG.DEFAULT_THEME,
    isSidebarCollapsed: localStorage.getItem('sidebarCollapsed') === 'true',
    notifications: [
        { id: 1, type: 'order', title: 'New Booking #ORD-7742', time: '5 mins ago', read: false },
        { id: 2, type: 'shipment', title: 'Shipment #SHP-1290 Delivered', time: '1 hour ago', read: false },
        { id: 3, type: 'payment', title: 'Payment received from Global Corp', time: '3 hours ago', read: true }
    ]
};

/**
 * UI Controller
 */
const UI = {
    init() {
        this.applyTheme();
        this.updateCompanyBranding();
        this.setupEventListeners();
        this.renderView(State.currentView);
        this.updateSidebarUI();
        lucide.createIcons();
    },

    updateCompanyBranding() {
        document.querySelectorAll('.company-name').forEach(el => el.textContent = CONFIG.LOGO_TEXT);
        document.querySelectorAll('.company-name-text').forEach(el => el.textContent = CONFIG.COMPANY_NAME);
        document.getElementById('support-email-text').textContent = CONFIG.SUPPORT_EMAIL;
        document.getElementById('footer-year').textContent = new Date().getFullYear();
    },

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const view = item.getAttribute('data-view');
                this.navigate(view);
                
                // Close mobile menu if open
                if (window.innerWidth <= 1024) {
                    this.closeMobileMenu();
                }
            });
        });

        // Sidebar Toggle (Desktop)
        document.getElementById('sidebar-toggle').addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Mobile Menu Toggle
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Create and setup Overlay
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
        overlay.addEventListener('click', () => this.closeMobileMenu());

        // Theme Toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Modal Close
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
    },

    toggleMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('active');
    },

    closeMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
    },

    navigate(view) {
        if (State.currentView === view) return;
        
        State.currentView = view;
        
        // Update Active State
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-view') === view);
        });

        // Update Page Title
        const navItem = document.querySelector(`.nav-item[data-view="${view}"]`);
        const title = navItem ? navItem.querySelector('span').textContent : 'Overview';
        document.getElementById('page-title').textContent = title;

        this.renderView(view);
    },

    toggleSidebar() {
        State.isSidebarCollapsed = !State.isSidebarCollapsed;
        localStorage.setItem('sidebarCollapsed', State.isSidebarCollapsed);
        this.updateSidebarUI();
    },

    updateSidebarUI() {
        const sidebar = document.querySelector('.sidebar');
        const toggleIcon = document.querySelector('#sidebar-toggle i');
        
        if (State.isSidebarCollapsed) {
            sidebar.classList.add('collapsed');
            toggleIcon.setAttribute('data-lucide', 'chevron-right');
        } else {
            sidebar.classList.remove('collapsed');
            toggleIcon.setAttribute('data-lucide', 'chevron-left');
        }
        lucide.createIcons();
    },

    toggleTheme() {
        State.theme = State.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', State.theme);
        this.applyTheme();
    },

    applyTheme() {
        document.body.className = State.theme + '-theme';
        const themeIcon = document.querySelector('#theme-toggle i');
        themeIcon.setAttribute('data-lucide', State.theme === 'light' ? 'moon' : 'sun');
        lucide.createIcons();
    },

    openModal(title, content) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-content').innerHTML = content;
        document.getElementById('modal-container').classList.remove('hidden');
    },

    closeModal() {
        document.getElementById('modal-container').classList.add('hidden');
    },

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.getElementById('toast-container').appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    renderView(view) {
        const container = document.getElementById('main-content');
        
        // Simple View Router
        switch(view) {
            case 'dashboard':
                container.innerHTML = Views.dashboard();
                Charts.initDashboard();
                break;
            case 'customers':
                container.innerHTML = Views.customers();
                break;
            case 'orders':
                container.innerHTML = Views.orders();
                break;
            case 'shipments':
                container.innerHTML = Views.shipments();
                break;
            case 'fleet':
                container.innerHTML = Views.fleet();
                break;
            case 'drivers':
                container.innerHTML = Views.drivers();
                break;
            case 'tracking':
                container.innerHTML = Views.tracking();
                break;
            case 'warehouse':
                container.innerHTML = Views.warehouse();
                break;
            case 'invoices':
                container.innerHTML = Views.invoices();
                break;
            case 'payments':
                container.innerHTML = Views.payments();
                Charts.initPayments();
                break;
            case 'analytics':
                container.innerHTML = Views.analytics();
                Charts.initAnalytics();
                break;
            case 'tickets':
                container.innerHTML = Views.tickets();
                break;
            case 'settings':
                container.innerHTML = Views.settings();
                break;
            case 'documents':
                container.innerHTML = Views.documents();
                break;
            default:
                container.innerHTML = `<div class="card"><h3>${view.charAt(0).toUpperCase() + view.slice(1)} Module</h3><p>This module is coming soon in the prototype.</p></div>`;
        }
        lucide.createIcons();
    }
};

/**
 * HTML Templates for Views
 */
const Views = {
    dashboard: () => `
        <div class="stats-grid">
            ${Views.statCard('Total Orders', '1,284', 'shopping-cart', 'primary', '+12%', 'bg-primary-soft')}
            ${Views.statCard('Active Shipments', '42', 'package', 'info', 'Stable', 'bg-info-soft')}
            ${Views.statCard('Available Trucks', '18/25', 'truck', 'warning', '72% Cap', 'bg-warning-soft')}
            ${Views.statCard('Revenue', '$142,500', 'dollar-sign', 'success', '+8.5%', 'bg-success-soft')}
        </div>
        <div class="charts-grid">
            <div class="card chart-card">
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="font-size: 1.1rem;">Revenue trends</h3>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Last 6 months</div>
                </div>
                <div style="height: 300px; position: relative;">
                    <canvas id="revenueChart"></canvas>
                </div>
            </div>
            <div class="card chart-card">
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="font-size: 1.1rem;">Shipment Status</h3>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Current fleet</div>
                </div>
                <div style="height: 300px; position: relative; display: flex; align-items: center; justify-content: center;">
                    <canvas id="shipmentStatusChart"></canvas>
                </div>
            </div>
        </div>
        <div class="card" style="margin-top: 24px;">
            <div class="card-header" style="margin-bottom: 20px;">
                <h3 style="font-size: 1.1rem;">Recent activity</h3>
            </div>
            <div class="activity-feed">
                <div class="activity-item">
                    <div class="activity-icon" style="background: rgba(14, 165, 233, 0.1); color: var(--info);"><i data-lucide="package"></i></div>
                    <div class="activity-info">
                        <strong>Shipment #SHP-1029</strong> departed from NYC Warehouse
                        <span>2 hours ago</span>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-icon" style="background: rgba(16, 185, 129, 0.1); color: var(--success);"><i data-lucide="check-circle"></i></div>
                    <div class="activity-info">
                        <strong>Order #ORD-5521</strong> delivered to Apple Inc.
                        <span>4 hours ago</span>
                    </div>
                </div>
            </div>
        </div>
    `,

    statCard: (label, val, icon, colorClass, trend, bgClass) => `
        <div class="card stat-card" style="padding: 24px;">
            <div style="display: flex; align-items: center; gap: 16px;">
                <div class="stat-icon-wrapper ${bgClass}" style="width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: rgba(var(--primary-rgb), 0.1); color: var(--${colorClass});">
                    <i data-lucide="${icon}" style="width: 24px; height: 24px;"></i>
                </div>
                <div>
                    <span class="stat-label" style="display: block; color: var(--text-muted); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">${label}</span>
                    <div class="stat-value" style="font-size: 1.5rem; font-weight: 700; margin-top: 4px;">${val}</div>
                </div>
            </div>
            <div class="stat-footer" style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-color); display: flex; align-items: center; gap: 8px;">
                <span class="trend-badge" style="font-size: 0.75rem; font-weight: 700; color: ${trend.includes('+') ? 'var(--success)' : 'var(--text-muted)'}">${trend}</span>
                <span style="font-size: 0.75rem; color: var(--text-muted);">vs last month</span>
            </div>
        </div>
    `,

    customers: () => `
        <div class="card">
            <div class="table-header">
                <div class="table-header-left">
                    <h3>Customer Directory</h3>
                    <p>Manage your cargo partners and clients</p>
                </div>
                <div class="table-actions">
                    <div class="search-bar"><input type="search" placeholder="Search partners..."></div>
                    <button class="btn btn-primary" onclick="UI.openModal('Add Customer', Views.forms.customer())">
                        <i data-lucide="plus"></i><span class="hide-mobile">Add Partner</span>
                    </button>
                </div>
            </div>
            <div class="table-container">
                <table>
                    <thead><tr>
                        <th>Partner Name</th>
                        <th>Company</th>
                        <th class="hide-mobile">Email</th>
                        <th>Orders</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr></thead>
                    <tbody>
                        <tr>
                            <td><strong>Robert Fox</strong></td>
                            <td>Logistic Solutions</td>
                            <td class="hide-mobile">robert@logsol.com</td>
                            <td>12</td>
                            <td><span class="badge-status bg-delivered">Active</span></td>
                            <td><button class="btn btn-secondary btn-sm" onclick="UI.openModal('Edit Customer', Views.forms.customer())">Edit</button></td>
                        </tr>
                        <tr>
                            <td><strong>Jane Cooper</strong></td>
                            <td>Global Import Inc</td>
                            <td class="hide-mobile">jane@global.com</td>
                            <td>45</td>
                            <td><span class="badge-status bg-delivered">Active</span></td>
                            <td><button class="btn btn-secondary btn-sm" onclick="UI.openModal('Edit Customer', Views.forms.customer())">Edit</button></td>
                        </tr>
                        <tr>
                            <td><strong>Mike Torres</strong></td>
                            <td>FastFreight LLC</td>
                            <td class="hide-mobile">mike@fastfreight.com</td>
                            <td>7</td>
                            <td><span class="badge-status bg-pending">Onboarding</span></td>
                            <td><button class="btn btn-secondary btn-sm" onclick="UI.openModal('Edit Customer', Views.forms.customer())">Edit</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,

    orders: () => `
        <div class="card">
            <div class="table-header">
                <div class="table-header-left">
                    <h3>Booking Management</h3>
                    <p>Monitor and dispatch new cargo bookings</p>
                </div>
                <div class="table-actions">
                    <div class="search-bar"><input type="search" placeholder="Search orders..."></div>
                    <button class="btn btn-primary" onclick="UI.openModal('New Booking', Views.forms.order())">
                        <i data-lucide="plus"></i><span class="hide-mobile">New Booking</span>
                    </button>
                </div>
            </div>
            <div class="table-container">
                <table>
                    <thead><tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th class="hide-mobile">Route</th>
                        <th class="hide-mobile">Cargo</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr></thead>
                    <tbody>
                        <tr>
                            <td><strong>#ORD-7742</strong></td>
                            <td>Tesla Motors</td>
                            <td class="hide-mobile">Palo Alto → Austin</td>
                            <td class="hide-mobile">Heavy Machinery</td>
                            <td><span class="badge-status bg-pending">Pending</span></td>
                            <td><button class="btn btn-primary btn-sm">Assign Truck</button></td>
                        </tr>
                        <tr>
                            <td><strong>#ORD-7741</strong></td>
                            <td>SpaceX</td>
                            <td class="hide-mobile">Hawthorne → Starbase</td>
                            <td class="hide-mobile">Rocket Parts</td>
                            <td><span class="badge-status bg-transit">In Transit</span></td>
                            <td><button class="btn btn-secondary btn-sm">Track</button></td>
                        </tr>
                        <tr>
                            <td><strong>#ORD-7738</strong></td>
                            <td>Apple Inc.</td>
                            <td class="hide-mobile">NYC → Chicago</td>
                            <td class="hide-mobile">Electronics</td>
                            <td><span class="badge-status bg-delivered">Delivered</span></td>
                            <td><button class="btn btn-secondary btn-sm">View</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,

    shipments: () => `
        <div class="card">
            <div class="card-header" style="margin-bottom: 24px;">
                <h3 style="font-size: 1.1rem;">Active Shipments</h3>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Real-time tracking of en-route cargo</p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 20px;">
                <div class="shipment-item card" style="background: var(--bg-main); border: 1px solid var(--border-color); padding: 24px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
                        <div>
                            <strong style="font-size: 1.1rem;">#SHP-1290</strong>
                            <div style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px;">
                                <i data-lucide="map-pin" style="width: 14px; height: 14px; display: inline; vertical-align: middle;"></i> Austin → Seattle
                            </div>
                        </div>
                        <span class="badge-status bg-transit" style="height: fit-content; padding: 6px 12px;">In Transit</span>
                    </div>
                    <div class="progress-details" style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 12px; color: var(--text-muted);">
                        <span>750 miles covered</span>
                        <span>250 miles remaining</span>
                    </div>
                    <div class="progress-container" style="height: 10px; background: var(--border-color);"><div class="progress-bar" style="width: 75%; height: 100%;"></div></div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-top: 16px; color: var(--text-muted);">
                        <div><strong>Driver:</strong> Mark Wilson</div>
                        <div><strong>ETA:</strong> 14h 22m</div>
                    </div>
                </div>
            </div>
        </div>
    `,

    fleet: () => `
        <div class="card-header" style="margin-bottom: 24px;">
            <h3 style="font-size: 1.25rem;">Fleet Management</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Real-time health and status of your logistics fleet</p>
        </div>
        <div class="fleet-grid">
            <div class="card fleet-card" style="position: relative; overflow: hidden; border-top: 4px solid var(--info);">
                <div style="position: absolute; top: -20px; right: -20px; opacity: 0.05; transform: rotate(15deg);">
                    <i data-lucide="truck" style="width: 120px; height: 120px;"></i>
                </div>
                <div class="fleet-img" style="background: rgba(14, 165, 233, 0.05);"><i data-lucide="truck"></i></div>
                <h3 style="font-size: 1.1rem;">Truck #TX-9901</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Volvo FH16 - Heavy Duty</p>
                <div class="fleet-meta" style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-color);">
                    <span><strong>Driver:</strong> Mark Wilson</span>
                    <span><span class="badge-status bg-transit">In Transit</span></span>
                </div>
                <div class="progress-container" style="height: 6px; background: var(--border-color);"><div class="progress-bar" style="width: 65%; height: 100%;"></div></div>
                <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 8px;">65% to Seattle</div>
            </div>
            <div class="card fleet-card" style="position: relative; overflow: hidden; border-top: 4px solid var(--success);">
                <div style="position: absolute; top: -20px; right: -20px; opacity: 0.05; transform: rotate(15deg);">
                    <i data-lucide="truck" style="width: 120px; height: 120px;"></i>
                </div>
                <div class="fleet-img" style="background: rgba(16, 185, 129, 0.05); color: var(--success);"><i data-lucide="truck"></i></div>
                <h3 style="font-size: 1.1rem;">Truck #TX-1022</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Scania R500 - Cargo</p>
                <div class="fleet-meta" style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-color);">
                    <span><strong>Driver:</strong> Sarah Jenkins</span>
                    <span><span class="badge-status bg-delivered">Available</span></span>
                </div>
                <div style="font-size: 0.7rem; color: var(--success); margin-top: 8px; font-weight: 600;">Maintenance: Pass</div>
            </div>
        </div>
    `,

    drivers: () => `
        <div class="card-header" style="margin-bottom: 24px;">
            <h3 style="font-size: 1.25rem;">Driver Roster</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Monitor driver performance and assignments</p>
        </div>
        <div class="fleet-grid">
            <div class="card driver-card" style="padding: 32px; transition: transform 0.3s ease;">
                <div style="position: relative; width: 88px; height: 88px; margin: 0 auto 20px;">
                    <img src="https://ui-avatars.com/api/?name=Mark+Wilson&background=0284c7&color=fff" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 4px solid var(--bg-main);">
                    <div style="position: absolute; bottom: 4px; right: 4px; width: 16px; height: 16px; background: var(--success); border-radius: 50%; border: 2px solid var(--bg-card);"></div>
                </div>
                <h3 style="font-size: 1.1rem; text-align: center;">Mark Wilson</h3>
                <p style="color: var(--text-muted); font-size: 0.85rem; text-align: center;">License: #L-992102</p>
                <div style="margin-top: 24px; display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                        <span style="color: var(--text-muted);">Status:</span>
                        <span class="badge-status bg-transit">On Duty</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                        <span style="color: var(--text-muted);">Rating:</span>
                        <span style="font-weight: 700;">4.8 ★</span>
                    </div>
                </div>
                <button class="btn btn-secondary" style="width: 100%; margin-top: 24px; justify-content: center;">View Profile</button>
            </div>
            <div class="card driver-card" style="padding: 32px; transition: transform 0.3s ease;">
                <div style="position: relative; width: 88px; height: 88px; margin: 0 auto 20px;">
                    <img src="https://ui-avatars.com/api/?name=Sarah+Jenkins&background=10b981&color=fff" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 4px solid var(--bg-main);">
                    <div style="position: absolute; bottom: 4px; right: 4px; width: 16px; height: 16px; background: var(--success); border-radius: 50%; border: 2px solid var(--bg-card);"></div>
                </div>
                <h3 style="font-size: 1.1rem; text-align: center;">Sarah Jenkins</h3>
                <p style="color: var(--text-muted); font-size: 0.85rem; text-align: center;">License: #L-102293</p>
                <div style="margin-top: 24px; display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                        <span style="color: var(--text-muted);">Status:</span>
                        <span class="badge-status bg-delivered">Available</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                        <span style="color: var(--text-muted);">Rating:</span>
                        <span style="font-weight: 700;">4.9 ★</span>
                    </div>
                </div>
                <button class="btn btn-secondary" style="width: 100%; margin-top: 24px; justify-content: center;">View Profile</button>
            </div>
        </div>
    `,

    tracking: () => `
        <div class="card">
            <div class="card-header" style="margin-bottom: 24px;">
                <h3 style="font-size: 1.1rem;">Live Tracking - Shipment #SHP-1290</h3>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Real-time telemetry and geolocation data</p>
            </div>
            <div class="map-placeholder" style="margin-top: 20px; border: 1px solid var(--border-color);">
                <div style="position: absolute; width: 100%; height: 100%; background: url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg') center/cover; opacity: 0.1; filter: grayscale(100%) invert(1);"></div>
                <div style="z-index: 2; position: relative; text-align: center;">
                    <i data-lucide="truck" style="color: var(--primary); width: 48px; height: 48px; transform: rotate(15deg);"></i>
                    <div style="position: absolute; left: 50%; top: 50%; width: 40px; height: 40px; background: rgba(2, 132, 199, 0.2); border-radius: 50%; transform: translate(-50%, -50%); animation: pulse 2s infinite;"></div>
                </div>
            </div>
            <div class="route-info" style="margin-top: 24px; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;">
                <div class="card stat-card" style="padding: 20px; text-align: center; background: var(--bg-main);">
                    <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Speed</span>
                    <div style="font-size: 1.5rem; font-weight: 700; margin-top: 8px;">68 <span style="font-size: 0.8rem; font-weight: 400;">mph</span></div>
                </div>
                <div class="card stat-card" style="padding: 20px; text-align: center; background: var(--bg-main);">
                    <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Fuel</span>
                    <div style="font-size: 1.5rem; font-weight: 700; margin-top: 8px;">82 <span style="font-size: 0.8rem; font-weight: 400;">%</span></div>
                </div>
                <div class="card stat-card" style="padding: 20px; text-align: center; background: var(--bg-main);">
                    <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">ETA</span>
                    <div style="font-size: 1.5rem; font-weight: 700; margin-top: 8px;">14 <span style="font-size: 0.8rem; font-weight: 400;">hrs</span></div>
                </div>
            </div>
        </div>
        <style>
            @keyframes pulse {
                0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
                100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
            }
        </style>
    `,

    warehouse: () => `
        <div class="stats-grid">
            ${Views.statCard('Total Storage', '4/5 Bays', 'layers', 'primary', '80% Cap', 'bg-primary-soft')}
            ${Views.statCard('Inbound', '12 Units', 'arrow-down-left', 'success', 'On Track', 'bg-success-soft')}
            ${Views.statCard('Outbound', '8 Units', 'arrow-up-right', 'info', '4 Proc.', 'bg-info-soft')}
            ${Views.statCard('Stock Value', '$2.4M', 'package', 'warning', '+5% MoM', 'bg-warning-soft')}
        </div>
        <div class="card" style="margin-top: 24px;">
            <div class="card-header" style="margin-bottom: 24px;">
                <h3 style="font-size: 1.1rem;">Warehouse Sections</h3>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Live occupancy and environmental monitoring</p>
            </div>
            <div class="fleet-grid">
                <div class="card" style="background: rgba(2, 132, 199, 0.03); border-left: 4px solid var(--primary);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h4 style="font-size: 1rem;">Cold Storage</h4>
                        <span style="font-size: 0.75rem; color: var(--success); font-weight: 700;">NORMAL</span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">Current Temp: -4.2°C</p>
                    <div class="progress-container" style="height: 6px; margin-top: 16px;"><div class="progress-bar" style="width: 45%;"></div></div>
                    <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 8px;">45% Occupied</div>
                </div>
                <div class="card" style="background: rgba(239, 68, 68, 0.03); border-left: 4px solid var(--danger);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h4 style="font-size: 1rem;">Hazardous Goods</h4>
                        <span style="font-size: 0.75rem; color: var(--danger); font-weight: 700;">RESTRICTED</span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">Section B4 | 2 Units Storage</p>
                    <div class="progress-container" style="height: 6px; margin-top: 16px;"><div class="progress-bar" style="width: 20%; background: var(--danger);"></div></div>
                    <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 8px;">20% Occupied</div>
                </div>
            </div>
        </div>
    `,

    invoices: () => `
        <div class="card">
            <div class="table-header">
                <div class="table-header-left">
                    <h3>Invoice Management</h3>
                    <p>Billing history and payment reconciliation</p>
                </div>
                <div class="table-actions">
                    <button class="btn btn-secondary" onclick="UI.showToast('Exporting...','success')"><i data-lucide="download"></i><span class="hide-mobile">Export</span></button>
                    <button class="btn btn-primary" onclick="UI.openModal('New Invoice', Views.forms.invoice())"><i data-lucide="plus"></i><span class="hide-mobile">New Invoice</span></button>
                </div>
            </div>
            <div class="table-container">
                <table>
                    <thead><tr>
                        <th>Invoice ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th class="hide-mobile">Due Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr></thead>
                    <tbody>
                        <tr>
                            <td><strong>#INV-99011</strong></td>
                            <td>Apple Inc.</td>
                            <td><strong>$12,400.00</strong></td>
                            <td class="hide-mobile">Mar 28, 2026</td>
                            <td><span class="badge-status bg-delivered">PAID</span></td>
                            <td><button class="btn btn-secondary btn-sm" onclick="UI.openModal('Edit Invoice', Views.forms.invoice())">Edit</button></td>
                        </tr>
                        <tr>
                            <td><strong>#INV-99012</strong></td>
                            <td>Tesla</td>
                            <td><strong>$8,206.50</strong></td>
                            <td class="hide-mobile">Apr 14, 2026</td>
                            <td><span class="badge-status bg-pending">PENDING</span></td>
                            <td><button class="btn btn-primary btn-sm" onclick="UI.openModal('Edit Invoice', Views.forms.invoice())">Send</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,


    payments: () => `
        <div class="card">
            <div class="card-header" style="margin-bottom: 24px;">
                <h3 style="font-size: 1.1rem;">Financial Overview</h3>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Revenue streams and collection metrics</p>
            </div>
            <div class="stats-grid">
                <div class="card" style="border: none; background: linear-gradient(135deg, #0284c7, #0ea5e9); color: white; padding: 24px;">
                    <span style="font-size: 0.8rem; opacity: 0.8; font-weight: 600; text-transform: uppercase;">Total Receivables</span>
                    <div style="font-size: 2rem; font-weight: 700; margin-top: 8px;">$42,100</div>
                </div>
                <div class="card" style="border: none; background: linear-gradient(135deg, #10b981, #34d399); color: white; padding: 24px;">
                    <span style="font-size: 0.8rem; opacity: 0.8; font-weight: 600; text-transform: uppercase;">Collected Monthly</span>
                    <div style="font-size: 2rem; font-weight: 700; margin-top: 8px;">$128,400</div>
                </div>
            </div>
            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border-color);">
                <h4 style="font-size: 1.1rem; margin-bottom: 24px;">Revenue Streams Distribution</h4>
                <div style="height: 300px;"><canvas id="paymentsChart"></canvas></div>
            </div>
        </div>
    `,

    analytics: () => `
        <div class="card-header" style="margin-bottom: 24px;">
            <h3 style="font-size: 1.25rem;">Performance Analytics</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Deep dive into operational efficiency and costs</p>
        </div>
        <div class="charts-grid">
            <div class="card chart-card">
                <div class="card-header" style="margin-bottom: 20px;">
                    <h4 style="font-size: 1rem;">Delivery Success Rate</h4>
                </div>
                <div style="height: 300px; display: flex; align-items: center; justify-content: center;"><canvas id="deliveryChart"></canvas></div>
            </div>
            <div class="card chart-card">
                <div class="card-header" style="margin-bottom: 20px;">
                    <h4 style="font-size: 1rem;">Operational Costs</h4>
                </div>
                <div style="height: 300px;"><canvas id="costChart"></canvas></div>
            </div>
        </div>
    `,

    tickets: () => `
        <div class="card">
            <div class="table-header">
                <div class="table-header-left">
                    <h3>Support Desk</h3>
                    <p>Manage and resolve customer queries</p>
                </div>
                <div class="table-actions">
                    <div class="search-bar"><input type="search" placeholder="Search tickets..."></div>
                    <button class="btn btn-primary" onclick="UI.openModal('New Support Ticket', Views.forms.ticket())">
                        <i data-lucide="plus"></i><span class="hide-mobile">New Ticket</span>
                    </button>
                </div>
            </div>
            <div class="table-container">
                <table>
                    <thead><tr>
                        <th>Ticket ID</th>
                        <th>Customer</th>
                        <th class="hide-mobile">Subject</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr></thead>
                    <tbody>
                        <tr>
                            <td><strong>#TCK-0092</strong></td>
                            <td>Global Corp</td>
                            <td class="hide-mobile">Delayed shipment near Chicago</td>
                            <td><span class="badge-status" style="background:rgba(239,68,68,.12);color:var(--danger)">High</span></td>
                            <td><span class="badge-status bg-transit">Open</span></td>
                            <td><button class="btn btn-primary btn-sm" onclick="UI.openModal('Reply to Ticket', Views.forms.ticket())">Reply</button></td>
                        </tr>
                        <tr>
                            <td><strong>#TCK-0091</strong></td>
                            <td>Tesla Motors</td>
                            <td class="hide-mobile">Invoice discrepancy on ORD-7741</td>
                            <td><span class="badge-status" style="background:rgba(245,158,11,.12);color:var(--warning)">Medium</span></td>
                            <td><span class="badge-status bg-transit">Open</span></td>
                            <td><button class="btn btn-secondary btn-sm" onclick="UI.openModal('Reply to Ticket', Views.forms.ticket())">Reply</button></td>
                        </tr>
                        <tr>
                            <td><strong>#TCK-0088</strong></td>
                            <td>Apple Inc.</td>
                            <td class="hide-mobile">Request for delivery certificate</td>
                            <td><span class="badge-status" style="background:rgba(16,185,129,.12);color:var(--success)">Low</span></td>
                            <td><span class="badge-status bg-delivered">Resolved</span></td>
                            <td><button class="btn btn-secondary btn-sm">View</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,

    settings: () => `
        <div class="card">
            <div style="margin-bottom: 24px;">
                <h3>System Preferences</h3>
                <p style="font-size:0.8rem;color:var(--text-muted);margin-top:4px">Configure application-wide settings and profile</p>
            </div>
            <div class="settings-layout">
                <nav class="settings-nav">
                    <div class="settings-nav-item active">General Settings</div>
                    <div class="settings-nav-item">Company Profile</div>
                    <div class="settings-nav-item">Roles &amp; Permissions</div>
                    <div class="settings-nav-item">Notifications</div>
                    <div class="settings-nav-item">API Keys</div>
                </nav>
                <div class="settings-content">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Company Legal Name</label>
                            <input type="text" value="${CONFIG.COMPANY_NAME}">
                        </div>
                        <div class="form-group">
                            <label>Primary Support Email</label>
                            <input type="email" value="${CONFIG.SUPPORT_EMAIL}">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Default Currency</label>
                            <select><option>USD ($)</option><option>EUR (€)</option><option>GBP (£)</option></select>
                        </div>
                        <div class="form-group">
                            <label>Timezone</label>
                            <select><option>UTC-5 (Eastern)</option><option>UTC-8 (Pacific)</option><option>UTC+0 (GMT)</option></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Theme Mode</label>
                        <div style="display:flex;gap:10px;flex-wrap:wrap">
                            <button class="btn btn-secondary" style="flex:1;min-width:120px" onclick="UI.toggleTheme()"><i data-lucide="sun"></i> Light Mode</button>
                            <button class="btn btn-secondary" style="flex:1;min-width:120px" onclick="UI.toggleTheme()"><i data-lucide="moon"></i> Dark Mode</button>
                        </div>
                    </div>
                    <div style="margin-top:8px">
                        <button class="btn btn-primary" style="min-width:200px" onclick="UI.showToast('Settings saved successfully!','success')">Save Settings</button>
                    </div>
                </div>
            </div>
        </div>
    `,

    documents: () => `
        <div class="doc-module">
            <!-- Header -->
            <div style="margin-bottom:24px">
                <h3 style="font-size:1.2rem">Bills &amp; Documents</h3>
                <p style="font-size:0.82rem;color:var(--text-muted);margin-top:4px">Generate, customize &amp; print professional transportation documents</p>
            </div>

            <!-- Company Branding Banner -->
            <div class="card" style="background:linear-gradient(135deg,rgba(2,132,199,0.06),rgba(14,165,233,0.04));border:1.5px dashed rgba(2,132,199,0.3);margin-bottom:24px">
                <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
                    <div style="width:64px;height:64px;border-radius:12px;background:var(--bg-main);border:2px dashed var(--border-color);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0" title="Click to set logo">
                        <i data-lucide="image" style="width:28px;height:28px;color:var(--text-muted)"></i>
                    </div>
                    <div style="flex:1;min-width:220px">
                        <div style="font-weight:700;font-size:1rem">SwiftMove Logistics Pvt. Ltd.</div>
                        <div style="font-size:0.8rem;color:var(--text-muted);margin-top:3px">GSTIN: 27AABCS1234A1Z5 &nbsp;|&nbsp; PAN: AABCS1234A</div>
                        <div style="font-size:0.78rem;color:var(--text-muted)">123 Transport Nagar, Mumbai - 400001 &nbsp;|&nbsp; +91 98765 43210</div>
                    </div>
                    <button class="btn btn-secondary" onclick="UI.openModal('Company Settings', Views.forms.companySettings())"><i data-lucide="settings-2"></i><span class="hide-mobile">Customize Header</span></button>
                </div>
            </div>

            <!-- 4 Document Type Cards -->
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px;margin-bottom:28px">
                <!-- Quotation -->
                <div class="card doc-type-card" style="border-top:4px solid #8b5cf6;cursor:pointer" onclick="UI.openModal('New Quotation', Views.forms.quotation())">
                    <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
                        <div style="width:48px;height:48px;border-radius:12px;background:rgba(139,92,246,.1);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                            <i data-lucide="file-signature" style="width:24px;height:24px;color:#8b5cf6"></i>
                        </div>
                        <div>
                            <div style="font-weight:700;font-size:0.95rem">Quotation</div>
                            <div style="font-size:0.75rem;color:var(--text-muted)">Rate estimate for client</div>
                        </div>
                    </div>
                    <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:16px">Send freight rate quotes before booking. Includes route, cargo type, validity.</p>
                    <button class="btn btn-primary" style="width:100%;background:linear-gradient(135deg,#8b5cf6,#7c3aed)" onclick="event.stopPropagation();UI.openModal('New Quotation', Views.forms.quotation())">
                        <i data-lucide="plus"></i> Create Quotation
                    </button>
                </div>

                <!-- Lorry Receipt -->
                <div class="card doc-type-card" style="border-top:4px solid var(--primary);cursor:pointer" onclick="UI.openModal('New Lorry Receipt (LR)', Views.forms.lorryReceipt())">
                    <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
                        <div style="width:48px;height:48px;border-radius:12px;background:rgba(2,132,199,.1);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                            <i data-lucide="truck" style="width:24px;height:24px;color:var(--primary)"></i>
                        </div>
                        <div>
                            <div style="font-weight:700;font-size:0.95rem">Lorry Receipt (LR)</div>
                            <div style="font-size:0.75rem;color:var(--text-muted)">Goods Receipt / GR Note</div>
                        </div>
                    </div>
                    <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:16px">Issued at pickup. Proof of goods accepted. Includes consignor, consignee, goods, vehicle details.</p>
                    <button class="btn btn-primary" style="width:100%" onclick="event.stopPropagation();UI.openModal('New Lorry Receipt (LR)', Views.forms.lorryReceipt())">
                        <i data-lucide="plus"></i> Create LR
                    </button>
                </div>

                <!-- Delivery Challan -->
                <div class="card doc-type-card" style="border-top:4px solid var(--success);cursor:pointer" onclick="UI.openModal('New Delivery Challan', Views.forms.challan())">
                    <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
                        <div style="width:48px;height:48px;border-radius:12px;background:rgba(16,185,129,.1);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                            <i data-lucide="clipboard-list" style="width:24px;height:24px;color:var(--success)"></i>
                        </div>
                        <div>
                            <div style="font-weight:700;font-size:0.95rem">Delivery Challan</div>
                            <div style="font-size:0.75rem;color:var(--text-muted)">GST Challan / DC</div>
                        </div>
                    </div>
                    <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:16px">For goods movement without immediate invoice. Job work, stock transfer, approval basis.</p>
                    <button class="btn btn-primary" style="width:100%;background:linear-gradient(135deg,var(--success),#059669)" onclick="event.stopPropagation();UI.openModal('New Delivery Challan', Views.forms.challan())">
                        <i data-lucide="plus"></i> Create Challan
                    </button>
                </div>

                <!-- GST Invoice -->
                <div class="card doc-type-card" style="border-top:4px solid var(--warning);cursor:pointer" onclick="UI.openModal('New GST Invoice', Views.forms.gstInvoice())">
                    <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
                        <div style="width:48px;height:48px;border-radius:12px;background:rgba(245,158,11,.1);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                            <i data-lucide="receipt" style="width:24px;height:24px;color:var(--warning)"></i>
                        </div>
                        <div>
                            <div style="font-weight:700;font-size:0.95rem">GST Tax Invoice</div>
                            <div style="font-size:0.75rem;color:var(--text-muted)">Transport Invoice with GST</div>
                        </div>
                    </div>
                    <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:16px">Full freight billing with CGST/SGST/IGST breakup, SAC code 9965, e-way bill reference.</p>
                    <button class="btn btn-primary" style="width:100%;background:linear-gradient(135deg,#f59e0b,#d97706)" onclick="event.stopPropagation();UI.openModal('New GST Invoice', Views.forms.gstInvoice())">
                        <i data-lucide="plus"></i> Create Invoice
                    </button>
                </div>
            </div>

            <!-- Recent Documents Table -->
            <div class="card">
                <div class="table-header">
                    <div class="table-header-left">
                        <h3>Recent Documents</h3>
                        <p>Last generated bills and documents</p>
                    </div>
                    <div class="table-actions">
                        <div class="search-bar"><input type="search" placeholder="Search documents..."></div>
                    </div>
                </div>
                <div class="table-container">
                    <table>
                        <thead><tr>
                            <th>Doc No.</th>
                            <th>Type</th>
                            <th>Party</th>
                            <th class="hide-mobile">Route / Details</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr></thead>
                        <tbody>
                            <tr>
                                <td><strong>QTN-001</strong></td>
                                <td><span class="badge-status" style="background:rgba(139,92,246,.12);color:#8b5cf6">Quotation</span></td>
                                <td>Tesla Motors</td>
                                <td class="hide-mobile">Palo Alto → Austin</td>
                                <td>Mar 15, 2026</td>
                                <td>₹48,500</td>
                                <td><button class="btn btn-secondary btn-sm" onclick="DocPrint.quotation(DocPrint.sampleData.quotation)">🖨 Print</button></td>
                            </tr>
                            <tr>
                                <td><strong>LR-2026-001</strong></td>
                                <td><span class="badge-status bg-transit">LR / GR</span></td>
                                <td>SpaceX</td>
                                <td class="hide-mobile">Hawthorne → Starbase</td>
                                <td>Mar 14, 2026</td>
                                <td>₹1,24,000</td>
                                <td><button class="btn btn-secondary btn-sm" onclick="DocPrint.lorryReceipt(DocPrint.sampleData.lr)">🖨 Print</button></td>
                            </tr>
                            <tr>
                                <td><strong>DC-2026-001</strong></td>
                                <td><span class="badge-status bg-delivered">Challan</span></td>
                                <td>Apple Inc.</td>
                                <td class="hide-mobile">NYC → Chicago</td>
                                <td>Mar 13, 2026</td>
                                <td>₹62,300</td>
                                <td><button class="btn btn-secondary btn-sm" onclick="DocPrint.challan(DocPrint.sampleData.challan)">🖨 Print</button></td>
                            </tr>
                            <tr>
                                <td><strong>INV-2026-011</strong></td>
                                <td><span class="badge-status" style="background:rgba(245,158,11,.12);color:var(--warning)">GST Inv.</span></td>
                                <td>Global Corp</td>
                                <td class="hide-mobile">Chicago → Dallas</td>
                                <td>Mar 12, 2026</td>
                                <td>₹89,440</td>
                                <td><button class="btn btn-secondary btn-sm" onclick="DocPrint.gstInvoice(DocPrint.sampleData.gstInvoice)">🖨 Print</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,

    forms: {
        customer: () => `
            <form id="add-customer-form">
                <div class="form-row">
                    <div class="form-group">
                        <label>Full Name *</label>
                        <input type="text" placeholder="e.g. Robert Fox" required>
                    </div>
                    <div class="form-group">
                        <label>Company Name</label>
                        <input type="text" placeholder="e.g. Logistic Solutions">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Email Address *</label>
                        <input type="email" placeholder="email@company.com" required>
                    </div>
                    <div class="form-group">
                        <label>Phone Number</label>
                        <input type="tel" placeholder="+1 555 000 0000">
                    </div>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select>
                        <option value="active">Active</option>
                        <option value="onboarding">Onboarding</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea placeholder="Any additional notes about this partner..."></textarea>
                </div>
            </form>
        `,

        order: () => `
            <form id="add-order-form">
                <div class="form-row">
                    <div class="form-group">
                        <label>Customer / Client *</label>
                        <select required>
                            <option value="">Select customer...</option>
                            <option>Tesla Motors</option>
                            <option>SpaceX</option>
                            <option>Apple Inc.</option>
                            <option>Global Corp</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Cargo Type *</label>
                        <select required>
                            <option value="">Select cargo type...</option>
                            <option>Heavy Machinery</option>
                            <option>Electronics</option>
                            <option>Perishables</option>
                            <option>Hazardous Materials</option>
                            <option>General Freight</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Origin City *</label>
                        <input type="text" placeholder="e.g. Palo Alto, CA" required>
                    </div>
                    <div class="form-group">
                        <label>Destination City *</label>
                        <input type="text" placeholder="e.g. Austin, TX" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Pickup Date *</label>
                        <input type="date" required>
                    </div>
                    <div class="form-group">
                        <label>Weight (tons)</label>
                        <input type="number" placeholder="0.00" min="0" step="0.1">
                    </div>
                </div>
                <div class="form-group">
                    <label>Special Instructions</label>
                    <textarea placeholder="Fragile, temperature-controlled, etc."></textarea>
                </div>
            </form>
        `,

        shipment: () => `
            <form id="add-shipment-form">
                <div class="form-row">
                    <div class="form-group">
                        <label>Link Order *</label>
                        <select required>
                            <option value="">Select order...</option>
                            <option>#ORD-7742</option>
                            <option>#ORD-7741</option>
                            <option>#ORD-7738</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Assign Driver *</label>
                        <select required>
                            <option value="">Select driver...</option>
                            <option>Mark Wilson</option>
                            <option>Sarah Jenkins</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Assign Truck *</label>
                        <select required>
                            <option value="">Select truck...</option>
                            <option>Truck #TX-9901 — Volvo FH16</option>
                            <option>Truck #TX-1022 — Scania R500</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Estimated Delivery Date</label>
                        <input type="date">
                    </div>
                </div>
                <div class="form-group">
                    <label>Tracking Notes</label>
                    <textarea placeholder="Route notes, checkpoints, etc."></textarea>
                </div>
            </form>
        `,

        fleet: () => `
            <form id="add-fleet-form">
                <div class="form-row">
                    <div class="form-group">
                        <label>Truck ID / Plate *</label>
                        <input type="text" placeholder="e.g. TX-9905" required>
                    </div>
                    <div class="form-group">
                        <label>Make &amp; Model *</label>
                        <input type="text" placeholder="e.g. Volvo FH16" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Year</label>
                        <input type="number" placeholder="2023" min="2000" max="2030">
                    </div>
                    <div class="form-group">
                        <label>Payload Capacity (tons)</label>
                        <input type="number" placeholder="20" min="0">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Status *</label>
                        <select required>
                            <option value="available">Available</option>
                            <option value="transit">In Transit</option>
                            <option value="maintenance">Under Maintenance</option>
                            <option value="retired">Retired</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Last Service Date</label>
                        <input type="date">
                    </div>
                </div>
            </form>
        `,

        driver: () => `
            <form id="add-driver-form">
                <div class="form-row">
                    <div class="form-group">
                        <label>Full Name *</label>
                        <input type="text" placeholder="e.g. Mark Wilson" required>
                    </div>
                    <div class="form-group">
                        <label>License Number *</label>
                        <input type="text" placeholder="e.g. L-992102" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Phone Number *</label>
                        <input type="tel" placeholder="+1 555 000 0000" required>
                    </div>
                    <div class="form-group">
                        <label>License Expiry Date</label>
                        <input type="date">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Status</label>
                        <select>
                            <option value="available">Available</option>
                            <option value="onduty">On Duty</option>
                            <option value="offduty">Off Duty</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Assigned Truck</label>
                        <select>
                            <option value="">None</option>
                            <option>Truck #TX-9901</option>
                            <option>Truck #TX-1022</option>
                        </select>
                    </div>
                </div>
            </form>
        `,

        invoice: () => `
            <form id="add-invoice-form">
                <div class="form-row">
                    <div class="form-group">
                        <label>Customer *</label>
                        <select required>
                            <option value="">Select customer...</option>
                            <option>Apple Inc.</option>
                            <option>Tesla Motors</option>
                            <option>SpaceX</option>
                            <option>Global Corp</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Linked Order</label>
                        <select>
                            <option value="">Select order...</option>
                            <option>#ORD-7742</option>
                            <option>#ORD-7741</option>
                            <option>#ORD-7738</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Amount *</label>
                        <input type="number" placeholder="0.00" min="0" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label>Due Date *</label>
                        <input type="date" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Payment Status</label>
                    <select>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea placeholder="Invoice notes or payment terms..."></textarea>
                </div>
            </form>
        `,

        ticket: () => `
            <form id="add-ticket-form">
                <div class="form-row">
                    <div class="form-group">
                        <label>Customer *</label>
                        <select required>
                            <option value="">Select customer...</option>
                            <option>Global Corp</option>
                            <option>Tesla Motors</option>
                            <option>Apple Inc.</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Priority *</label>
                        <select required>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Subject *</label>
                    <input type="text" placeholder="Brief description of the issue" required>
                </div>
                <div class="form-group">
                    <label>Details / Message *</label>
                    <textarea style="min-height:120px" placeholder="Describe the issue in detail..." required></textarea>
                </div>
                <div class="form-group">
                    <label>Linked Shipment / Order</label>
                    <select>
                        <option value="">Not linked</option>
                        <option>#SHP-1290</option>
                        <option>#ORD-7742</option>
                    </select>
                </div>
            </form>
        `
    }
};

/**
 * Charting logic
 */
const Charts = {
    initDashboard() {
        const ctxRev = document.getElementById('revenueChart');
        if (ctxRev) {
            new Chart(ctxRev, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Revenue',
                        data: [12000, 19000, 15000, 25000, 22000, 30000],
                        borderColor: '#0284c7',
                        tension: 0.4,
                        fill: true,
                        backgroundColor: 'rgba(2, 132, 199, 0.1)'
                    }]
                },
                options: { responsive: true, plugins: { legend: { display: false } } }
            });
        }

        const ctxStatus = document.getElementById('shipmentStatusChart');
        if (ctxStatus) {
            new Chart(ctxStatus, {
                type: 'doughnut',
                data: {
                    labels: ['Delivered', 'In Transit', 'Pending'],
                    datasets: [{
                        data: [65, 20, 15],
                        backgroundColor: ['#10b981', '#0ea5e9', '#f59e0b'],
                        borderWidth: 0
                    }]
                },
                options: { cutout: '70%', plugins: { legend: { position: 'bottom' } } }
            });
        }
    },
    
    initPayments() {
        const ctxPay = document.getElementById('paymentsChart');
        if (ctxPay) {
            new Chart(ctxPay, {
                type: 'bar',
                data: {
                    labels: ['Direct', 'Corporate', 'Contract'],
                    datasets: [{
                        label: 'Revenue Source',
                        data: [45000, 80000, 23000],
                        backgroundColor: ['#0284c7', '#10b981', '#f59e0b']
                    }]
                }
            });
        }
    },

    initAnalytics() {
        const ctxDelivery = document.getElementById('deliveryChart');
        if (ctxDelivery) {
            new Chart(ctxDelivery, {
                type: 'pie',
                data: {
                    labels: ['On Time', 'Delayed', 'Failed'],
                    datasets: [{
                        data: [92, 5, 3],
                        backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
                    }]
                }
            });
        }
        
        const ctxCost = document.getElementById('costChart');
        if (ctxCost) {
            new Chart(ctxCost, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Operational Costs',
                        data: [5000, 5200, 4800, 6000, 5800, 5500],
                        borderColor: '#ef4444',
                        tension: 0.4
                    }]
                }
            });
        }
    }
};

// ─── Document Forms ───────────────────────────────────────────────────────────
const DocForms = {
    companySettings: () => `
        <form>
            <div class="form-row">
                <div class="form-group">
                    <label>Company Name *</label>
                    <input type="text" value="SwiftMove Logistics Pvt. Ltd.">
                </div>
                <div class="form-group">
                    <label>GSTIN *</label>
                    <input type="text" value="27AABCS1234A1Z5" placeholder="15-digit GSTIN">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>PAN</label>
                    <input type="text" value="AABCS1234A">
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" value="+91 98765 43210">
                </div>
            </div>
            <div class="form-group">
                <label>Address</label>
                <textarea>123 Transport Nagar, Mumbai - 400001, Maharashtra</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" value="support@swiftmove.com">
                </div>
                <div class="form-group">
                    <label>Website</label>
                    <input type="text" value="www.swiftmove.com">
                </div>
            </div>
            <div class="form-group">
                <label>Footer / Terms text (appears on all documents)</label>
                <textarea placeholder="E.g. Goods once booked will not be cancelled. Subject to Mumbai jurisdiction.">Goods accepted subject to company's standard terms &amp; conditions. All disputes subject to Mumbai jurisdiction only.</textarea>
            </div>
            <div style="margin-top:8px;display:flex;gap:10px;flex-wrap:wrap">
                <button type="button" class="btn btn-primary" onclick="UI.showToast('Company header saved!','success');UI.closeModal()">Save Header</button>
                <button type="button" class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
            </div>
        </form>`,

    quotation: () => `
        <form>
            <div class="form-row">
                <div class="form-group">
                    <label>Quotation No. *</label>
                    <input type="text" value="QTN-${Date.now().toString().slice(-4)}">
                </div>
                <div class="form-group">
                    <label>Date *</label>
                    <input type="date" value="${new Date().toISOString().slice(0,10)}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Valid Until *</label>
                    <input type="date">
                </div>
                <div class="form-group">
                    <label>Customer / Client *</label>
                    <input type="text" placeholder="e.g. Tesla Motors India">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Origin *</label>
                    <input type="text" placeholder="e.g. Mumbai, MH">
                </div>
                <div class="form-group">
                    <label>Destination *</label>
                    <input type="text" placeholder="e.g. Delhi, DL">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Cargo Type</label>
                    <select>
                        <option>General Goods</option>
                        <option>Fragile / High Value</option>
                        <option>Perishable / Cold Chain</option>
                        <option>Hazardous / Dangerous</option>
                        <option>Over-Dimensional Cargo</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Approx. Weight (Tons)</label>
                    <input type="number" placeholder="0.00" step="0.1">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Base Freight Rate (₹)</label>
                    <input type="number" placeholder="0.00" id="q-base">
                </div>
                <div class="form-group">
                    <label>Loading / Unloading (₹)</label>
                    <input type="number" placeholder="0.00" id="q-load">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>GST % (SAC 9965)</label>
                    <select id="q-gst">
                        <option value="5">5% (Standard Freight)</option>
                        <option value="12">12% (Full ITC)</option>
                        <option value="0">0% (Exempt)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Payment Terms</label>
                    <select>
                        <option>Advance 50%, Balance on Delivery</option>
                        <option>100% Advance</option>
                        <option>Net 15 Days</option>
                        <option>Net 30 Days</option>
                        <option>To Pay (Consignee)</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Special Notes</label>
                <textarea placeholder="E.g. Price subject to diesel surcharge if fuel price changes by more than 5%."></textarea>
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px">
                <button type="button" class="btn btn-primary" onclick="DocPrint.quotation(DocPrint.sampleData.quotation)">🖨 Generate &amp; Print</button>
                <button type="button" class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
            </div>
        </form>`,

    lorryReceipt: () => `
        <form>
            <div class="form-row">
                <div class="form-group">
                    <label>LR No. *</label>
                    <input type="text" value="LR-2026-${Date.now().toString().slice(-3)}">
                </div>
                <div class="form-group">
                    <label>Date *</label>
                    <input type="date" value="${new Date().toISOString().slice(0,10)}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Vehicle No. *</label>
                    <input type="text" placeholder="e.g. MH 04 AB 1234">
                </div>
                <div class="form-group">
                    <label>Driver Name</label>
                    <input type="text" placeholder="e.g. Rajesh Kumar">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>From (Origin) *</label>
                    <input type="text" placeholder="e.g. Mumbai">
                </div>
                <div class="form-group">
                    <label>To (Destination) *</label>
                    <input type="text" placeholder="e.g. Delhi">
                </div>
            </div>
            <p style="font-size:0.8rem;font-weight:700;color:var(--primary);margin:12px 0 4px;text-transform:uppercase;letter-spacing:.5px">Consignor (Sender)</p>
            <div class="form-row">
                <div class="form-group">
                    <label>Name *</label>
                    <input type="text" placeholder="Sender company name">
                </div>
                <div class="form-group">
                    <label>GSTIN</label>
                    <input type="text" placeholder="15-digit GSTIN">
                </div>
            </div>
            <div class="form-group">
                <label>Address</label>
                <input type="text" placeholder="Full address">
            </div>
            <p style="font-size:0.8rem;font-weight:700;color:var(--success);margin:12px 0 4px;text-transform:uppercase;letter-spacing:.5px">Consignee (Receiver)</p>
            <div class="form-row">
                <div class="form-group">
                    <label>Name *</label>
                    <input type="text" placeholder="Receiver company name">
                </div>
                <div class="form-group">
                    <label>GSTIN</label>
                    <input type="text" placeholder="15-digit GSTIN">
                </div>
            </div>
            <div class="form-group">
                <label>Address</label>
                <input type="text" placeholder="Full delivery address">
            </div>
            <p style="font-size:0.8rem;font-weight:700;color:var(--text-main);margin:12px 0 4px;text-transform:uppercase;letter-spacing:.5px">Goods Details</p>
            <div class="form-row">
                <div class="form-group">
                    <label>Description of Goods *</label>
                    <input type="text" placeholder="e.g. Electronic Components">
                </div>
                <div class="form-group">
                    <label>HSN Code</label>
                    <input type="text" placeholder="e.g. 8542">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>No. of Packages</label>
                    <input type="number" placeholder="0">
                </div>
                <div class="form-group">
                    <label>Actual Weight (Kg)</label>
                    <input type="number" placeholder="0.00">
                </div>
                <div class="form-group">
                    <label>Charged Weight (Kg)</label>
                    <input type="number" placeholder="0.00">
                </div>
            </div>
            <p style="font-size:0.8rem;font-weight:700;color:var(--text-main);margin:12px 0 4px;text-transform:uppercase;letter-spacing:.5px">Freight Charges</p>
            <div class="form-row">
                <div class="form-group">
                    <label>Basic Freight (₹)</label>
                    <input type="number" placeholder="0.00">
                </div>
                <div class="form-group">
                    <label>Loading Charges (₹)</label>
                    <input type="number" placeholder="0.00">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Other Charges (₹)</label>
                    <input type="number" placeholder="0.00">
                </div>
                <div class="form-group">
                    <label>GST @ 5% (SAC 9965)</label>
                    <input type="number" placeholder="Auto-calculated" readonly style="opacity:.7">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>E-way Bill No.</label>
                    <input type="text" placeholder="12-digit EWB number">
                </div>
                <div class="form-group">
                    <label>Payment Mode</label>
                    <select>
                        <option>Paid (Consignor)</option>
                        <option>To Pay (Consignee)</option>
                        <option>To Be Billed</option>
                    </select>
                </div>
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px">
                <button type="button" class="btn btn-primary" onclick="DocPrint.lorryReceipt(DocPrint.sampleData.lr)">🖨 Generate &amp; Print</button>
                <button type="button" class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
            </div>
        </form>`,

    challan: () => `
        <form>
            <div class="form-row">
                <div class="form-group">
                    <label>Challan No. *</label>
                    <input type="text" value="DC-2026-${Date.now().toString().slice(-3)}">
                </div>
                <div class="form-group">
                    <label>Date *</label>
                    <input type="date" value="${new Date().toISOString().slice(0,10)}">
                </div>
            </div>
            <div class="form-group">
                <label>Reason for Movement *</label>
                <select>
                    <option>Job Work</option>
                    <option>Stock Transfer</option>
                    <option>Supply on Approval / Sale or Return</option>
                    <option>Recipient Not Known</option>
                    <option>Exhibition / Fair</option>
                    <option>Others</option>
                </select>
            </div>
            <p style="font-size:0.8rem;font-weight:700;color:var(--primary);margin:12px 0 4px;text-transform:uppercase;letter-spacing:.5px">Supplier (Consignor)</p>
            <div class="form-row">
                <div class="form-group">
                    <label>Name *</label>
                    <input type="text" placeholder="Supplier name">
                </div>
                <div class="form-group">
                    <label>GSTIN *</label>
                    <input type="text" placeholder="15-digit GSTIN">
                </div>
            </div>
            <div class="form-group">
                <label>Address</label>
                <input type="text" placeholder="Full address">
            </div>
            <p style="font-size:0.8rem;font-weight:700;color:var(--success);margin:12px 0 4px;text-transform:uppercase;letter-spacing:.5px">Recipient (Consignee)</p>
            <div class="form-row">
                <div class="form-group">
                    <label>Name *</label>
                    <input type="text" placeholder="Recipient name">
                </div>
                <div class="form-group">
                    <label>GSTIN / UIN</label>
                    <input type="text" placeholder="15-digit GSTIN or UIN">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Address</label>
                    <input type="text" placeholder="Full address">
                </div>
                <div class="form-group">
                    <label>Place of Supply *</label>
                    <input type="text" placeholder="e.g. Delhi (07)">
                </div>
            </div>
            <p style="font-size:0.8rem;font-weight:700;color:var(--text-main);margin:12px 0 4px;text-transform:uppercase;letter-spacing:.5px">Goods</p>
            <div class="form-row">
                <div class="form-group">
                    <label>Description *</label>
                    <input type="text" placeholder="Item description">
                </div>
                <div class="form-group">
                    <label>HSN Code</label>
                    <input type="text" placeholder="e.g. 7308">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Quantity</label>
                    <input type="number" placeholder="0">
                </div>
                <div class="form-group">
                    <label>Unit</label>
                    <select><option>Nos</option><option>Kgs</option><option>Bags</option><option>Boxes</option><option>MT</option></select>
                </div>
                <div class="form-group">
                    <label>Taxable Value (₹)</label>
                    <input type="number" placeholder="0.00">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Tax Type</label>
                    <select><option>CGST + SGST (Intra-state)</option><option>IGST (Inter-state)</option></select>
                </div>
                <div class="form-group">
                    <label>GST Rate</label>
                    <select><option>5%</option><option>12%</option><option>18%</option><option>0%</option></select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Vehicle No.</label>
                    <input type="text" placeholder="e.g. MH 04 AB 1234">
                </div>
                <div class="form-group">
                    <label>E-way Bill No.</label>
                    <input type="text" placeholder="12-digit EWB number">
                </div>
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px">
                <button type="button" class="btn btn-primary" onclick="DocPrint.challan(DocPrint.sampleData.challan)">🖨 Generate &amp; Print</button>
                <button type="button" class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
            </div>
        </form>`,

    gstInvoice: () => `
        <form>
            <div class="form-row">
                <div class="form-group">
                    <label>Invoice No. *</label>
                    <input type="text" value="INV-2026-${Date.now().toString().slice(-3)}">
                </div>
                <div class="form-group">
                    <label>Date *</label>
                    <input type="date" value="${new Date().toISOString().slice(0,10)}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>LR Reference No.</label>
                    <input type="text" placeholder="Linked LR number">
                </div>
                <div class="form-group">
                    <label>E-way Bill No.</label>
                    <input type="text" placeholder="12-digit EWB number">
                </div>
            </div>
            <p style="font-size:0.8rem;font-weight:700;color:var(--primary);margin:12px 0 4px;text-transform:uppercase;letter-spacing:.5px">Bill To (Consignor / Client)</p>
            <div class="form-row">
                <div class="form-group">
                    <label>Name *</label>
                    <input type="text" placeholder="Client company name">
                </div>
                <div class="form-group">
                    <label>GSTIN</label>
                    <input type="text" placeholder="15-digit GSTIN">
                </div>
            </div>
            <div class="form-group">
                <label>Address</label>
                <input type="text" placeholder="Full billing address">
            </div>
            <p style="font-size:0.8rem;font-weight:700;color:var(--text-main);margin:12px 0 4px;text-transform:uppercase;letter-spacing:.5px">Service Details</p>
            <div class="form-row">
                <div class="form-group">
                    <label>SAC Code</label>
                    <input type="text" value="9965" readonly style="opacity:.7">
                </div>
                <div class="form-group">
                    <label>Description of Service</label>
                    <input type="text" value="Road Transport of Goods by Truck">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Vehicle No.</label>
                    <input type="text" placeholder="MH 04 AB 1234">
                </div>
                <div class="form-group">
                    <label>Route</label>
                    <input type="text" placeholder="Mumbai to Delhi">
                </div>
            </div>
            <p style="font-size:0.8rem;font-weight:700;color:var(--text-main);margin:12px 0 4px;text-transform:uppercase;letter-spacing:.5px">Charges &amp; GST</p>
            <div class="form-row">
                <div class="form-group">
                    <label>Basic Freight (₹)</label>
                    <input type="number" placeholder="0.00">
                </div>
                <div class="form-group">
                    <label>Other Charges (₹)</label>
                    <input type="number" placeholder="0.00">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>GST Type</label>
                    <select><option>CGST + SGST (Intra-state)</option><option>IGST (Inter-state)</option></select>
                </div>
                <div class="form-group">
                    <label>GST Rate</label>
                    <select><option value="5">5%</option><option value="12">12%</option></select>
                </div>
            </div>
            <div class="form-group">
                <label>Payment Due Date</label>
                <input type="date">
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px">
                <button type="button" class="btn btn-primary" onclick="DocPrint.gstInvoice(DocPrint.sampleData.gstInvoice)">🖨 Generate &amp; Print</button>
                <button type="button" class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
            </div>
        </form>`
};

// Wire DocForms into Views.forms
Views.forms.companySettings = DocForms.companySettings;
Views.forms.quotation       = DocForms.quotation;
Views.forms.lorryReceipt    = DocForms.lorryReceipt;
Views.forms.challan         = DocForms.challan;
Views.forms.gstInvoice      = DocForms.gstInvoice;

// ─── DocPrint Engine ──────────────────────────────────────────────────────────
const DocPrint = {
    sampleData: {
        company: {
            name: 'SwiftMove Logistics Pvt. Ltd.',
            gstin: '27AABCS1234A1Z5',
            pan: 'AABCS1234A',
            address: '123 Transport Nagar, Andheri East, Mumbai - 400001, Maharashtra',
            phone: '+91 98765 43210',
            email: 'support@swiftmove.com',
            terms: 'Goods once booked will not be cancelled. All disputes subject to Mumbai jurisdiction only. Company not responsible for loss due to natural calamities. Goods insured at owner\'s cost.'
        },
        quotation: {
            no: 'QTN-001', date: 'March 15, 2026', validUntil: 'March 30, 2026',
            client: 'Tesla Motors India Pvt. Ltd.',
            clientAddress: '4th Floor, One BKC, Bandra, Mumbai - 400051',
            from: 'Mumbai, Maharashtra', to: 'Delhi, NCR',
            cargo: 'Electronic Vehicle Components', weight: '8.5 Tons',
            baseFreight: 42000, loading: 3500, other: 1500,
            gstRate: 5, gstType: 'CGST + SGST', paymentTerms: 'Advance 50%, Balance on Delivery',
            notes: 'Price valid for full truck load (FTL). Rates subject to diesel surcharge if price varies by more than 5%.'
        },
        lr: {
            no: 'LR-2026-001', date: 'March 14, 2026', vehicle: 'MH 04 CD 5678', driver: 'Rajesh Kumar Singh',
            from: 'Mumbai', to: 'New Delhi', ewayBill: '120312345678', payMode: 'To Pay (Consignee)',
            consignor: { name: 'SpaceX India Pvt. Ltd.', gstin: '27AABSP1234B1Z8', address: '10 Andheri Industrial Estate, Mumbai - 400058', phone: '+91 99001 12345' },
            consignee: { name: 'ISRO Satellite Centre', gstin: '07AABCI1234C1Z6', address: 'NH-48, Dwarka, New Delhi - 110075', phone: '+91 11 2567 8901' },
            goods: [{ desc: 'Satellite Communication Equipment', hsn: '8526', pkgs: 4, actWt: 1200, chgWt: 1250, rate: 92, amount: 115000 }],
            basicFreight: 115000, loading: 4500, unloading: 3000, other: 1500, gstRate: 5
        },
        challan: {
            no: 'DC-2026-001', date: 'March 13, 2026', reason: 'Stock Transfer',
            vehicle: 'MH 02 AB 9012', ewayBill: '120344556677',
            supplier: { name: 'Apple India Pvt. Ltd.', gstin: '27AABCA1000A1Z5', address: 'Saket, New Delhi - 110017' },
            recipient: { name: 'Apple Retail Store - Chicago', gstin: '09AABCA1000B1Z4', address: '123 Michigan Ave, Chicago, IL 60601', placeOfSupply: 'Uttar Pradesh (09)' },
            goods: [{ desc: 'iPhone 15 Pro (Space Black)', hsn: '8517', qty: 500, unit: 'Nos', taxableValue: 57200000 }],
            gstType: 'IGST', gstRate: 12
        },
        gstInvoice: {
            no: 'INV-2026-011', date: 'March 12, 2026', dueDate: 'March 27, 2026',
            lrRef: 'LR-2026-001', ewayBill: '120312345678', vehicle: 'MH 04 CD 5678', route: 'Chicago → Dallas',
            billTo: { name: 'Global Corp International', gstin: '29AABCG1234D1Z3', address: '5th Floor, UB City, Bangalore - 560001' },
            sac: '9965', service: 'Road Transport of Goods by Truck',
            basicFreight: 78000, otherCharges: 3200, gstType: 'IGST', gstRate: 5
        }
    },

    _open(html) {
        const w = window.open('', '_blank', 'width=1000,height=800');
        w.document.write(html);
        w.document.close();
        setTimeout(() => { try { w.print(); } catch(e) {} }, 600);
    },

    _header(c) {
        return `<div class="doc-header">
            <div class="doc-logo-box"><span style="font-size:22px">🚛</span></div>
            <div class="doc-company">
                <div class="doc-company-name">${c.name}</div>
                <div class="doc-company-sub">GSTIN: ${c.gstin} &nbsp;|&nbsp; PAN: ${c.pan}</div>
                <div class="doc-company-sub">${c.address}</div>
                <div class="doc-company-sub">${c.phone} &nbsp;|&nbsp; ${c.email}</div>
            </div>
        </div>`;
    },

    _css() {
        return `<style>
            *{margin:0;padding:0;box-sizing:border-box}
            body{font-family:'Segoe UI',Arial,sans-serif;font-size:12px;color:#111;background:#fff;padding:24px}
            h1{font-size:18px;color:#0284c7}
            .doc-header{display:flex;align-items:flex-start;gap:16px;border-bottom:3px solid #0284c7;padding-bottom:14px;margin-bottom:16px}
            .doc-logo-box{width:60px;height:60px;border:2px solid #0284c7;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
            .doc-company-name{font-size:16px;font-weight:800;color:#0284c7}
            .doc-company-sub{font-size:10.5px;color:#444;margin-top:2px}
            .doc-title{text-align:center;font-size:15px;font-weight:800;letter-spacing:2px;text-transform:uppercase;background:#f0f9ff;border:1px solid #bae6fd;border-radius:6px;padding:8px;margin:14px 0;color:#0c4a6e}
            .doc-meta{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
            .doc-meta-box{border:1px solid #ddd;border-radius:6px;padding:10px}
            .label{font-size:10px;text-transform:uppercase;color:#666;font-weight:700;letter-spacing:.4px}
            .value{font-weight:600;margin-top:2px;font-size:12px}
            .parties{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
            .party-box{border:1px solid #ddd;border-radius:6px;padding:10px}
            .party-title{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;padding:3px 8px;border-radius:4px;display:inline-block;margin-bottom:6px}
            .p-consignor{background:#eff6ff;color:#1d4ed8}
            .p-consignee{background:#f0fdf4;color:#15803d}
            table{width:100%;border-collapse:collapse;margin-bottom:14px}
            th{background:#0284c7;color:#fff;padding:8px 6px;font-size:10.5px;text-align:left}
            td{padding:7px 6px;border-bottom:1px solid #eee;font-size:11px}
            tr:nth-child(even) td{background:#f8fafc}
            .charges-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
            .charges-box{border:1px solid #ddd;border-radius:6px;padding:10px}
            .charge-row{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f0f0f0;font-size:11px}
            .charge-row.total{font-weight:800;font-size:13px;color:#0284c7;border-top:2px solid #0284c7;border-bottom:none;padding-top:8px;margin-top:4px}
            .sig-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-top:20px}
            .sig-box{border:1px solid #ddd;border-radius:6px;padding:10px;text-align:center}
            .sig-line{border-top:1px dashed #999;margin:30px 8px 6px}
            .sig-label{font-size:10px;font-weight:700;color:#444}
            .footer-terms{border-top:2px solid #0284c7;margin-top:16px;padding-top:10px;font-size:10px;color:#666;line-height:1.6}
            .print-btn{position:fixed;top:12px;right:12px;background:#0284c7;color:#fff;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:700;box-shadow:0 4px 12px rgba(0,0,0,.2)}
            @media print{.print-btn{display:none}body{padding:0}}
            .gst-table{border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;margin-bottom:14px}
            .gst-row{display:flex;border-bottom:1px solid #e2e8f0}
            .gst-cell{flex:1;padding:7px 10px;font-size:11px}
            .gst-cell.head{background:#f8fafc;font-weight:700;font-size:10px;text-transform:uppercase;color:#555}
            .gst-row:last-child{border-bottom:none}
            .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700}
        </style>`;
    },

    quotation(d) {
        const c = this.sampleData.company;
        const sub = d.baseFreight + d.loading + d.other;
        const gst = sub * d.gstRate / 100;
        const total = sub + gst;
        this._open(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Quotation ${d.no}</title>${this._css()}</head><body>
            <button class="print-btn" onclick="window.print()">🖨 Print / Save PDF</button>
            ${this._header(c)}
            <div class="doc-title">FREIGHT QUOTATION</div>
            <div class="doc-meta">
                <div class="doc-meta-box"><div class="label">Quotation No.</div><div class="value">${d.no}</div></div>
                <div class="doc-meta-box"><div class="label">Date</div><div class="value">${d.date}</div></div>
                <div class="doc-meta-box"><div class="label">Valid Until</div><div class="value">${d.validUntil}</div></div>
                <div class="doc-meta-box"><div class="label">Payment Terms</div><div class="value">${d.paymentTerms}</div></div>
            </div>
            <div class="doc-meta-box" style="margin-bottom:14px">
                <div class="label">Quotation For</div>
                <div class="value" style="font-size:14px">${d.client}</div>
                <div style="font-size:11px;color:#555;margin-top:3px">${d.clientAddress}</div>
            </div>
            <table>
                <thead><tr><th>Description</th><th>From</th><th>To</th><th>Cargo Type</th><th>Weight</th><th>Amount (₹)</th></tr></thead>
                <tbody>
                    <tr><td>Road Freight Service (FTL)</td><td>${d.from}</td><td>${d.to}</td><td>${d.cargo}</td><td>${d.weight}</td><td style="font-weight:700">₹${d.baseFreight.toLocaleString('en-IN')}</td></tr>
                    <tr><td colspan="5" style="text-align:right;color:#555">Loading / Unloading Charges</td><td>₹${d.loading.toLocaleString('en-IN')}</td></tr>
                    <tr><td colspan="5" style="text-align:right;color:#555">Other Charges</td><td>₹${d.other.toLocaleString('en-IN')}</td></tr>
                    <tr><td colspan="5" style="text-align:right;color:#555">Taxable Amount</td><td style="font-weight:700">₹${sub.toLocaleString('en-IN')}</td></tr>
                    <tr><td colspan="5" style="text-align:right;color:#555">GST @ ${d.gstRate}% (SAC 9965 — ${d.gstType})</td><td>₹${gst.toLocaleString('en-IN')}</td></tr>
                    <tr style="background:#eff6ff"><td colspan="5" style="text-align:right;font-weight:800;font-size:13px;color:#0284c7">TOTAL AMOUNT</td><td style="font-weight:800;font-size:14px;color:#0284c7">₹${total.toLocaleString('en-IN')}</td></tr>
                </tbody>
            </table>
            ${d.notes ? `<div class="doc-meta-box" style="margin-bottom:14px"><div class="label">Special Notes</div><div style="margin-top:4px;font-size:11px;color:#444">${d.notes}</div></div>` : ''}
            <div class="sig-grid">
                <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Authorized Signatory</div><div style="font-size:10px;color:#666;margin-top:2px">${c.name}</div></div>
                <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Customer Acceptance</div><div style="font-size:10px;color:#666;margin-top:2px">${d.client}</div></div>
                <div class="sig-box"><div style="padding:20px 0;font-size:10px;color:#888">This quotation is valid till<br><strong>${d.validUntil}</strong></div></div>
            </div>
            <div class="footer-terms"><strong>Terms &amp; Conditions:</strong> ${c.terms}</div>
        </body></html>`);
    },

    lorryReceipt(d) {
        const c = this.sampleData.company;
        const sub = d.basicFreight + d.loading + d.unloading + d.other;
        const gst = sub * d.gstRate / 100;
        const cgst = gst / 2, sgst = gst / 2;
        const total = sub + gst;
        const goodsRows = d.goods.map(g => `<tr><td>${g.desc}</td><td>${g.hsn}</td><td>${g.pkgs}</td><td>${g.actWt} Kg</td><td>${g.chgWt} Kg</td><td>₹${g.rate}/Kg</td><td style="font-weight:700">₹${g.amount.toLocaleString('en-IN')}</td></tr>`).join('');
        this._open(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>LR ${d.no}</title>${this._css()}</head><body>
            <button class="print-btn" onclick="window.print()">🖨 Print / Save PDF</button>
            ${this._header(c)}
            <div class="doc-title">LORRY RECEIPT (LR / GR NOTE)</div>
            <div class="doc-meta">
                <div class="doc-meta-box"><div class="label">LR No.</div><div class="value" style="font-size:14px;color:#0284c7">${d.no}</div></div>
                <div class="doc-meta-box"><div class="label">Date</div><div class="value">${d.date}</div></div>
                <div class="doc-meta-box"><div class="label">Vehicle No.</div><div class="value">${d.vehicle}</div></div>
                <div class="doc-meta-box"><div class="label">Driver</div><div class="value">${d.driver}</div></div>
                <div class="doc-meta-box"><div class="label">From</div><div class="value">${d.from}</div></div>
                <div class="doc-meta-box"><div class="label">To</div><div class="value">${d.to}</div></div>
                <div class="doc-meta-box"><div class="label">E-way Bill No.</div><div class="value">${d.ewayBill}</div></div>
                <div class="doc-meta-box"><div class="label">Payment Mode</div><div class="value"><span class="badge" style="background:#eff6ff;color:#0284c7">${d.payMode}</span></div></div>
            </div>
            <div class="parties">
                <div class="party-box"><div class="party-title p-consignor">📤 Consignor (Sender)</div><div style="font-weight:700">${d.consignor.name}</div><div style="font-size:10.5px;color:#555;margin-top:3px">${d.consignor.address}</div><div style="font-size:10.5px;color:#555">GSTIN: ${d.consignor.gstin}</div><div style="font-size:10.5px;color:#555">Ph: ${d.consignor.phone}</div></div>
                <div class="party-box"><div class="party-title p-consignee">📥 Consignee (Receiver)</div><div style="font-weight:700">${d.consignee.name}</div><div style="font-size:10.5px;color:#555;margin-top:3px">${d.consignee.address}</div><div style="font-size:10.5px;color:#555">GSTIN: ${d.consignee.gstin}</div><div style="font-size:10.5px;color:#555">Ph: ${d.consignee.phone}</div></div>
            </div>
            <table><thead><tr><th>Description of Goods</th><th>HSN</th><th>Pkgs</th><th>Actual Wt.</th><th>Charged Wt.</th><th>Rate</th><th>Amount</th></tr></thead><tbody>${goodsRows}</tbody></table>
            <div class="charges-grid">
                <div class="charges-box">
                    <div style="font-weight:800;margin-bottom:8px;font-size:11px;text-transform:uppercase;color:#0284c7">Freight Charges</div>
                    <div class="charge-row"><span>Basic Freight</span><span>₹${d.basicFreight.toLocaleString('en-IN')}</span></div>
                    <div class="charge-row"><span>Loading Charges</span><span>₹${d.loading.toLocaleString('en-IN')}</span></div>
                    <div class="charge-row"><span>Unloading Charges</span><span>₹${d.unloading.toLocaleString('en-IN')}</span></div>
                    <div class="charge-row"><span>Other Charges</span><span>₹${d.other.toLocaleString('en-IN')}</span></div>
                    <div class="charge-row total"><span>Sub Total</span><span>₹${sub.toLocaleString('en-IN')}</span></div>
                </div>
                <div class="charges-box">
                    <div style="font-weight:800;margin-bottom:8px;font-size:11px;text-transform:uppercase;color:#0284c7">GST (SAC 9965)</div>
                    <div class="charge-row"><span>CGST @ ${d.gstRate/2}%</span><span>₹${cgst.toLocaleString('en-IN')}</span></div>
                    <div class="charge-row"><span>SGST @ ${d.gstRate/2}%</span><span>₹${sgst.toLocaleString('en-IN')}</span></div>
                    <div class="charge-row"><span>Total GST</span><span>₹${gst.toLocaleString('en-IN')}</span></div>
                    <div class="charge-row total"><span>GRAND TOTAL</span><span>₹${total.toLocaleString('en-IN')}</span></div>
                </div>
            </div>
            <div class="sig-grid">
                <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Consignor Signature</div><div style="font-size:10px;color:#666;margin-top:2px">${d.consignor.name}</div></div>
                <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Transporter / Driver</div><div style="font-size:10px;color:#666;margin-top:2px">${c.name}</div></div>
                <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Consignee Signature</div><div style="font-size:10px;color:#666;margin-top:2px">${d.consignee.name}</div></div>
            </div>
            <div class="footer-terms"><strong>Terms &amp; Conditions:</strong> ${c.terms}</div>
        </body></html>`);
    },

    challan(d) {
        const c = this.sampleData.company;
        const goodsRows = d.goods.map(g => { const gst = g.taxableValue * d.gstRate / 100; return `<tr><td>${g.desc}</td><td>${g.hsn}</td><td>${g.qty.toLocaleString('en-IN')} ${g.unit}</td><td>₹${g.taxableValue.toLocaleString('en-IN')}</td><td>₹${(gst/2).toLocaleString('en-IN')}</td><td>₹${(gst/2).toLocaleString('en-IN')}</td><td style="font-weight:700">₹${(g.taxableValue+gst).toLocaleString('en-IN')}</td></tr>`; }).join('');
        const taxableTotal = d.goods.reduce((s,g) => s + g.taxableValue, 0);
        const gstTotal = taxableTotal * d.gstRate / 100;
        this._open(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Challan ${d.no}</title>${this._css()}</head><body>
            <button class="print-btn" onclick="window.print()">🖨 Print / Save PDF</button>
            ${this._header(c)}
            <div class="doc-title">DELIVERY CHALLAN</div>
            <div class="doc-meta">
                <div class="doc-meta-box"><div class="label">Challan No.</div><div class="value" style="font-size:14px;color:#0284c7">${d.no}</div></div>
                <div class="doc-meta-box"><div class="label">Date</div><div class="value">${d.date}</div></div>
                <div class="doc-meta-box"><div class="label">Reason for Movement</div><div class="value">${d.reason}</div></div>
                <div class="doc-meta-box"><div class="label">Vehicle No.</div><div class="value">${d.vehicle}</div></div>
                <div class="doc-meta-box"><div class="label">E-way Bill No.</div><div class="value">${d.ewayBill}</div></div>
                <div class="doc-meta-box"><div class="label">Place of Supply</div><div class="value">${d.recipient.placeOfSupply}</div></div>
            </div>
            <div class="parties">
                <div class="party-box"><div class="party-title p-consignor">📤 Supplier (Consignor)</div><div style="font-weight:700">${d.supplier.name}</div><div style="font-size:10.5px;color:#555;margin-top:3px">${d.supplier.address}</div><div style="font-size:10.5px;color:#555">GSTIN: ${d.supplier.gstin}</div></div>
                <div class="party-box"><div class="party-title p-consignee">📥 Recipient (Consignee)</div><div style="font-weight:700">${d.recipient.name}</div><div style="font-size:10.5px;color:#555;margin-top:3px">${d.recipient.address}</div><div style="font-size:10.5px;color:#555">GSTIN: ${d.recipient.gstin}</div></div>
            </div>
            <table><thead><tr><th>Description of Goods</th><th>HSN</th><th>Qty / Unit</th><th>Taxable Value</th><th>CGST</th><th>SGST</th><th>Total</th></tr></thead><tbody>${goodsRows}<tr style="background:#eff6ff"><td colspan="3" style="text-align:right;font-weight:800">TOTAL</td><td style="font-weight:700">₹${taxableTotal.toLocaleString('en-IN')}</td><td style="font-weight:700">₹${(gstTotal/2).toLocaleString('en-IN')}</td><td style="font-weight:700">₹${(gstTotal/2).toLocaleString('en-IN')}</td><td style="font-weight:800;color:#0284c7">₹${(taxableTotal+gstTotal).toLocaleString('en-IN')}</td></tr></tbody></table>
            <div class="sig-grid">
                <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Supplier Signature</div></div>
                <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Transporter</div></div>
                <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Recipient Signature</div></div>
            </div>
            <div class="footer-terms"><strong>Declaration:</strong> I/We hereby certify that goods described above are being dispatched for the purpose of ${d.reason} and this is not a sale. ${c.terms}</div>
        </body></html>`);
    },

    gstInvoice(d) {
        const c = this.sampleData.company;
        const sub = d.basicFreight + d.otherCharges;
        const isIGST = d.gstType === 'IGST';
        const gstAmt = sub * d.gstRate / 100;
        const total = sub + gstAmt;
        const gstRows = isIGST
            ? `<div class="gst-row"><div class="gst-cell head">IGST (${d.gstRate}%)</div><div class="gst-cell">₹${gstAmt.toLocaleString('en-IN')}</div></div>`
            : `<div class="gst-row"><div class="gst-cell head">CGST (${d.gstRate/2}%)</div><div class="gst-cell">₹${(gstAmt/2).toLocaleString('en-IN')}</div></div><div class="gst-row"><div class="gst-cell head">SGST (${d.gstRate/2}%)</div><div class="gst-cell">₹${(gstAmt/2).toLocaleString('en-IN')}</div></div>`;
        this._open(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Invoice ${d.no}</title>${this._css()}</head><body>
            <button class="print-btn" onclick="window.print()">🖨 Print / Save PDF</button>
            ${this._header(c)}
            <div class="doc-title">GST TAX INVOICE — TRANSPORT SERVICES</div>
            <div class="doc-meta">
                <div class="doc-meta-box"><div class="label">Invoice No.</div><div class="value" style="font-size:14px;color:#0284c7">${d.no}</div></div>
                <div class="doc-meta-box"><div class="label">Invoice Date</div><div class="value">${d.date}</div></div>
                <div class="doc-meta-box"><div class="label">Due Date</div><div class="value">${d.dueDate}</div></div>
                <div class="doc-meta-box"><div class="label">LR Reference</div><div class="value">${d.lrRef}</div></div>
                <div class="doc-meta-box"><div class="label">E-way Bill No.</div><div class="value">${d.ewayBill}</div></div>
                <div class="doc-meta-box"><div class="label">Vehicle No.</div><div class="value">${d.vehicle}</div></div>
            </div>
            <div class="party-box" style="margin-bottom:14px"><div class="party-title p-consignee">Bill To</div><div style="font-weight:700;font-size:13px">${d.billTo.name}</div><div style="font-size:10.5px;color:#555;margin-top:3px">${d.billTo.address}</div><div style="font-size:10.5px;color:#555">GSTIN: ${d.billTo.gstin}</div></div>
            <table>
                <thead><tr><th>SAC</th><th>Description of Service</th><th>Route</th><th>Taxable Amount</th></tr></thead>
                <tbody>
                    <tr><td>${d.sac}</td><td>${d.service}</td><td>${d.route}</td><td style="font-weight:700">₹${d.basicFreight.toLocaleString('en-IN')}</td></tr>
                    <tr><td>—</td><td>Other Charges (Loading, Handling etc.)</td><td>—</td><td>₹${d.otherCharges.toLocaleString('en-IN')}</td></tr>
                </tbody>
            </table>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
                <div class="gst-table">
                    <div class="gst-row" style="background:#f8fafc"><div class="gst-cell head" style="flex:2">GST Component (${d.gstType})</div><div class="gst-cell head">Amount</div></div>
                    <div class="gst-row"><div class="gst-cell" style="flex:2">Taxable Value</div><div class="gst-cell">₹${sub.toLocaleString('en-IN')}</div></div>
                    ${gstRows}
                    <div class="gst-row" style="background:#eff6ff"><div class="gst-cell head" style="flex:2;color:#0284c7">TOTAL PAYABLE</div><div class="gst-cell" style="font-weight:800;font-size:14px;color:#0284c7">₹${total.toLocaleString('en-IN')}</div></div>
                </div>
                <div class="charges-box">
                    <div style="font-weight:800;margin-bottom:8px;font-size:11px;text-transform:uppercase;color:#0284c7">Payment Summary</div>
                    <div class="charge-row"><span>Basic Freight</span><span>₹${d.basicFreight.toLocaleString('en-IN')}</span></div>
                    <div class="charge-row"><span>Other Charges</span><span>₹${d.otherCharges.toLocaleString('en-IN')}</span></div>
                    <div class="charge-row"><span>${d.gstType} @ ${d.gstRate}%</span><span>₹${gstAmt.toLocaleString('en-IN')}</span></div>
                    <div class="charge-row total"><span>Grand Total</span><span>₹${total.toLocaleString('en-IN')}</span></div>
                </div>
            </div>
            <div class="sig-grid">
                <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Authorized Signatory</div><div style="font-size:10px;color:#666;margin-top:2px">${c.name}</div></div>
                <div class="sig-box"><div style="padding:14px 0;font-size:10px;color:#555;line-height:1.7">Bank: HDFC Bank Ltd.<br>A/C: 50200012341234<br>IFSC: HDFC0001234<br>Branch: Andheri, Mumbai</div></div>
                <div class="sig-box"><div class="sig-line"></div><div class="sig-label">Receiver's Signature &amp; Stamp</div></div>
            </div>
            <div class="footer-terms"><strong>Terms:</strong> ${c.terms}<br><strong>Note:</strong> This is a computer-generated invoice. GST paid under Reverse Charge Mechanism (RCM) if applicable as per GST Act.</div>
        </body></html>`);
    }
};

// Initialize App
window.addEventListener('DOMContentLoaded', () => UI.init());

