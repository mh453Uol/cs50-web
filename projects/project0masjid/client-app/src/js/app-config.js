import { getQueryString, inRange, toUTC, dateDiff } from './util.js'

let config = {
    getApiUrl() {
        // TODO revert back to https://masjidma.herokuapp.com since as of today (28/12/2020) that dyno has ran out of usage.
        // revert back to above url by end of month (1/1/2021)
        const baseUrl = "https://masjidma2.herokuapp.com";
        
        let template = `${baseUrl}/api/v1/{{tenant}}/prayers`

        return template.replace(/{{tenant}}/g, config.tenant);
    },
    tenants: [{
            name: 'Southcourt Masjid',
            id: '4',
            displayRamadanTimes: false,
            // Date.UTC month is from 0 to 11
            ramadanStart: new Date(Date.UTC(2021,3,13)),
            ramadanEnd: new Date(Date.UTC(2021,4,12,23,0,0,0,0)),
            //ramadanTimetable: 'https://drive.google.com/file/d/1MtxZTlSaGghoXsuFkrPlfCutTlBAAbEC/view'
            ramadanTimetable: 'https://drive.google.com/uc?export=view&id=1MtxZTlSaGghoXsuFkrPlfCutTlBAAbEC',
            announcements : [
                {
                    message: "🎉 Eid Salah Jamaat Times - 6:30AM, 8:00AM and 9:30AM",
                    from: new Date(Date.UTC(2021,4,12,21,0,0,0,0)),
                    to: new Date(Date.UTC(2021,4,13,23,0,0,0,0))
                }
            ]
        },
        {
            name: 'Aylesbury Masjid ',
            id: '3',
            displayRamadanTimes: false,
            ramadanStart:new Date(Date.UTC(2021,3,14)),
            ramadanEnd: new Date(Date.UTC(2021,4,13,23,0,0,0,0)),
            ramadanTimetable: 'https://drive.google.com/uc?export=view&id=1kS2mh-SoS-qkRvrt3G9dpzWTzpI9LvmC',
            announcements : [
                {
                    message: "🎉 Eid Prayer Jamaat Times - 8:00AM, 9:00AM and 10:00AM",
                    from: new Date(Date.UTC(2021,4,13,22,0,0,0,0)),
                    to: new Date(Date.UTC(2021,4,14,23,0,0,0,0))
                }
            ]
        }
    ],
    tenant: '',
    getTenant() {
        const tenant = this.tenants.find(t => t.id == this.tenant);

        if (tenant) {
            return tenant;
        }

        console.warn(`could not find tenant ${this.tenant}`);

        return null;
    },
}
function getSelectedTenant() {
    const tenantId = window.localStorage.getItem("tenant");

    const tenant = config.tenants.find(t => t.id === tenantId);

    return tenant;
}

function getSelectedTenantId() {    
    // look at the url since we have a tenant parameter e.g. xyz.com?tenant=1
    let tenantId = getQueryString('tenant', window.location.href);

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

function isRamadan(date) {
    const tenantId = window.localStorage.getItem("tenant");

    const tenant = config.tenants.find(t => t.id === tenantId);

    if (tenant) {
        return tenant.displayRamadanTimes || inRange(date, tenant.ramadanStart, tenant.ramadanEnd);
    }

    return false;
}

function setTenant(tenantId) {
    config.tenant = tenantId;
    window.localStorage.setItem('tenant', tenantId);
}

function initialize() {
    config.tenant = getSelectedTenantId();
}

export {
    config,
    initialize,
    setTenant,
    isRamadan,
    getSelectedTenant
}
