export default {
    routes: [
        {
            method: 'POST',
            path: '/maf/upload',
            handler: 'upload-maf.upload',
        },
        {
            method: 'POST',
            path: '/maf/upload-relations',
            handler: 'upload-maf-relations.upload',
        },
        {
            method: 'GET',
            path: '/maf/points',
            handler: 'points.points',
        },
    ]
}