import { inject } from '@vercel/analytics';

import '../web/app.js';

const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]']);

function isFilePreview() {
    return window.location.protocol === 'file:';
}

function isLocalHost() {
    return LOCAL_HOSTNAMES.has(window.location.hostname);
}

if (!isFilePreview()) {
    inject({
        mode: isLocalHost() ? 'development' : 'production',
        debug: isLocalHost(),
    });
}