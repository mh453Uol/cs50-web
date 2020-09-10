
let config = {
    getApiUrl() {
        // TODO Heroku does not allow TLS on free dynos
        const baseUrl = "https://masjidma.herokuapp.com";
        
        let template = `${baseUrl}/api/v1/{{tenant}}/prayers`

        return template.replace(/{{tenant}}/g, config.tenant);
    },
    tenants: [{
            name: 'Southcourt Masjid',
            id: '4'
        },
        {
            name: 'Aylesbury Masjid ',
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
    // look at the url since we have a tenant parameter e.g. xyz.com?tenant=1
    const url = new URL(window.location.href);
    let tenantId = url.searchParams.get('tenant');

    // if tenant not specified look at localStorage else default back
    if (!tenantId) {
        const tenant = window.localStorage.getItem('tenant');

        if (tenant) {
            tenantId = tenant;
        } else {
            tenantId = config.tenants[0].id;
        }
    }

    window.localStorage.setItem('tenant', tenantId);
    config.tenant = tenantId;

    return tenantId;
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