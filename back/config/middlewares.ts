export default [
    'strapi::logger',
    'strapi::errors',
    'strapi::security',
    'strapi::cors',
    'strapi::poweredBy',
    'strapi::query',
    {
        name: 'strapi::body',
        config: {
            jsonLimit: '10mb',
            formLimit: '10mb',
            textLimit: '256kb',
        },
    },
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
];
