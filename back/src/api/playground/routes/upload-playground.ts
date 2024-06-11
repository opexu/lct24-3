export default {
    routes: [
        {
            method: 'POST',
            path: '/playground/upload',
            handler: 'upload-playground.upload'
        },
        {
            method: 'POST',
            path: '/playground/upload-coords',
            handler: 'upload-playground-coords.upload'
        },
        {
            method: 'POST',
            path: '/playground/upload-mafs',
            handler: 'upload-playground-mafs.upload'
        },
        {
            method: 'POST',
            path: '/playground/upload-funding-limits',
            handler: 'upload-playground-funding-limits.upload'
        },
    ]
}