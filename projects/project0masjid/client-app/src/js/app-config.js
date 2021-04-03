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
            displayRamadanTimes: true,
            ramadanStart: new Date(Date.UTC(2021,3,13)),
            ramadanEnd: new Date(Date.UTC(2021,4,13)),
            //ramadanTimetable: 'https://drive.google.com/file/d/1MtxZTlSaGghoXsuFkrPlfCutTlBAAbEC/view'
            ramadanTimetable: 'https://drive.google.com/uc?export=view&id=1MtxZTlSaGghoXsuFkrPlfCutTlBAAbEC'
        },
        {
            name: 'Aylesbury Masjid ',
            id: '3',
            displayRamadanTimes: false,
            ramadanStart:new Date(Date.UTC(2021,3,13)),
            ramadanEnd: new Date(Date.UTC(2021,4,13)),
            ramadanTimetableEndpoint: 'https://script.google.com/macros/s/AKfycbxHRHduPb9XglrXuCyuZTCdShFRH_R7g3ojvZ4-MpPad0_ORf1pXlpQxw/exec?sheetId=1WxWsepAQTQoaaUK30qiQ2GBAyEOd7q1Sf7BXCVgX9gE&sheetName=tenant-3-ramadan'
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
