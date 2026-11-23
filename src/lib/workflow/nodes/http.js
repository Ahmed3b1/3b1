export async function executeHttpNode(config: any) {
    const { method, url, headers, body } = config;

    try {
        const response = await fetch(url, {
            method,
            headers: headers ? JSON.parse(JSON.stringify(headers)) : {},
            body: body && method !== 'GET' ? JSON.stringify(body) : undefined,
        });

        const responseData = await response.json().catch(() => ({ text: response.statusText }));

        return {
            status: response.status,
            data: responseData,
        };
    } catch (error: any) {
        throw new Error(`HTTP Request failed: ${error.message}`);
    }
}