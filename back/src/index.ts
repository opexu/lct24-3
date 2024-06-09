import { Strapi } from "@strapi/strapi";

export default {
    /**
     * An asynchronous register function that runs before
     * your application is initialized.
     *
     * This gives you an opportunity to extend code.
     */
    register(/*{ strapi }*/ ) { },

    /**
     * An asynchronous bootstrap function that runs before
     * your application gets started.
     *
     * This gives you an opportunity to set up your data model,
     * run jobs, or perform some special logic.
     */
    async bootstrap({ strapi }: { strapi: Strapi }){
        console.log('bootstrap 2')
        await createUnique( 'mafs', 'vendor_code' );
        await createUnique( 'balance_holders', 'title' );
        await createUnique( 'regions', 'title' );
        await createUnique( 'grbcs', 'title' );
        await createUnique( 'districts', 'title' );
        
        await createUnique( 'catalogs', 'title' );
        await createUnique( 'providers', 'title' );
        await createUnique( 'maf_types', 'title' );
        await createUnique( 'territory_types', 'title' );
    },
};

async function createUnique( collection: string, field: string ){
    try{
        await strapi.db.connection.schema.alterTable( collection, table => table.unique( field, { indexName: 'idx_' + collection + '_' + field }));
        console.log(`create index ${collection} ${field}`);
    }catch(e){
        console.log(`Except ${collection} ${field}`);
    }
}
