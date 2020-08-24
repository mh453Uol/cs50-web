
let config = {
    getApiUrl() {
        let template = `http://localhost:5000/api/v1/{{tenant}}/prayers`

        return template.replace(/{{tenant}}/g, config.tenant);
    },
    tenants: [{
            name: 'Aylesbury Islamic Cultural & Community Centre',
            id: '4'
        },
        {
            name: 'Aylesbury Jamia Masjid Ghausia',
            id: '3'
        }
    ],
    tenant: '',
    getTenantName() {
        const tenant = this.tenants.find(t => t.id == this.tenant);

        if (tenant) {
            return tenant.name;
        }

        console.warn(`could not find tenant ${this.tenant}`);

        return '';
    }
}

function getSelectedTenant() {
    const tenant = window.localStorage.getItem('tenant');
    
    if (tenant === null) {
        // look at the url since we have a tenant parameter e.g. xyz.com?tenant=1
        const url = new URL(window.location.href);
        let tenantId = url.searchParams.get('tenant');

        // default back to first tenant if tenant not available
        if (!tenantId) {
            tenantId = config.tenants[0].id;
        }

        window.localStorage.setItem('tenant', tenantId);
        config.tenant = tenantId;

        return tenantId;
    }
    return tenant;
}

function setTenant(tenantId) {
    config.tenant = tenantId;
    window.localStorage.setItem('tenant', tenantId);
}

function initialize() {
    config.tenant = getSelectedTenant();
}

export {
    config,
    initialize,
    setTenant
}