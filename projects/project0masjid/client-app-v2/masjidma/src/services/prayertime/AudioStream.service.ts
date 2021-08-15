import configuration from '../../config/config.prod.json';
import { Stream } from '../../models/Stream';

export const getApiUrl = () => {
    let template = `${configuration.baseUrl}/api/v1/{{tenant}}`

    let tenant = window.localStorage.getItem('tenant');

    if (tenant === null) {
        tenant = configuration.tenants[0].id.toString();
    }

    return template.replace(/{{tenant}}/g, tenant)
}

export function isStreaming(): Promise<Stream> {
    const url = `${getApiUrl()}/stream`;

    const headers = {
        'Content-Type': 'application/json'
    };


    return fetch(url, { headers: headers })
        .then(response => response.json())
}
