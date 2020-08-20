import prayerTimeService from './prayertimes.service';

let config = {
    apiUrl: `http://localhost:5000/api/v1/{{tenant}}/prayers`,
    tenants: [{
            name: 'Aylesbury Jamia Masjid Ghausia',
            id: '1007'
        },
        {
            name: 'Aylesbury Islamic Cultural & Community Centre',
            id: '4'
        }
    ],
    tenant: ''
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

        return tenantId;
    }
    return tenant;
}

function initialize() {
    config.tenant = getSelectedTenant();
    config.apiUrl = config.apiUrl.replace(/{{tenant}}/g, config.tenant);

    const today = new Date();

    // prayerTimeService.getJamaatTimes(today);
    // prayerTimeService.getPrayerTimes(today);
}

export {
    config,
    initialize,
}