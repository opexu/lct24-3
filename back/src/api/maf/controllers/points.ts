import utils, { parseMultipartData } from '@strapi/utils';
const { ApplicationError } = utils.errors;
import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as path from 'path';
import DxfParser, { IDxf } from 'dxf-parser';
import { DXFParser, IDxfParsedMafObj } from '../../../utils/DXFParser';

export default {

    async points( ctx ){
        const { query } = ctx;
        const mafsIdArr = query?.mafsIdArr;
        if( !Array.isArray( mafsIdArr ) || mafsIdArr.length === 0 ) throw new ApplicationError('Неверные параметры запроса');
        
        const dbResult = await strapi.db.connection.raw(`
            select * from mafs m
            where m.id in ( ${mafsIdArr.join(',')} )
        `);

        if( dbResult.rows.lenght === 0 ) throw new ApplicationError('Мафы не найдены');
        
        const objsArr: IDxfParsedMafObj[] = [];
        
        const parser = new DxfParser();
        const parser2 = new DXFParser();
        for( let i = 0; i < dbResult.rows.length; i++ ){
            const dwgFileName = dbResult.rows[i].safety_zones;
            if( !dwgFileName || dwgFileName === '' ) continue;
            const dwgPath = path.join( strapi.dirs.static.public, 'uploads', 'документация 2024', dwgFileName );
            try{
                await fsp.access( dwgPath );
                console.log('CAN access: ', dwgPath)
            }catch(e){
                console.error('CANT access: ', dwgPath);
                throw new ApplicationError('Нет доступа к файлу .dwg')
            }

            const rs = fs.createReadStream( dwgPath );
            rs.on('error', ( err ) => {
                console.error(`rs err ${dwgPath}: `, err);
                throw new ApplicationError('Ошибка чтения файла');
            })
            const dxf = await parser.parseStream( rs );
            const parsedDxfObj = parser2.parse( dxf );
            objsArr.push({ id: dbResult.rows[i].id, ...parsedDxfObj } );
        }
        
        return objsArr;
    }
}