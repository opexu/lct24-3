import type { IManyRelation, IOneRelation, IStrapi } from "./strapi";

export interface ITitle { Title: string; }
export interface ITitleDb { title: string; }
export type IEntity<T> = T & { id: number; }

//#region IBalanceHolder - Балансодержатель
export interface IBalanceHolder extends ITitle {}
export interface IBalanceHolderDb extends ITitleDb {}
//#endregion

//#region IYardArea - Дворовая территория
export type IYardAreaDistrictRelation = IOneRelation<'district', IStrapi<IDistrict>>;
export type IYardAreaGRBCRelation = IOneRelation<'grbc', IStrapi<IGRBC>>;
export type IYardAreaRegionRelation = IOneRelation<'region', IStrapi<IRegion>>;
export type IYardAreaBalanceHolderRelation = IOneRelation<'balance_holder', IStrapi<IBalanceHolder>>;
export type IYardAreaRelations = IYardAreaDistrictRelation & IYardAreaGRBCRelation & IYardAreaRegionRelation & IYardAreaBalanceHolderRelation;
export interface IYardArea extends ITitle {
    Title: string; // ДТ\Витебская ул. 3 к.1
    Square: number; // 40398,47
}
export interface IYardAreaDb extends ITitleDb {
    id: number;
    square: number;
}
export type IYardAreaFull = IYardArea & IYardAreaRelations;

export interface IDistrict extends ITitle {
    FundingLimit?: number;
} // ЗАО
export interface IDistrictDb extends ITitleDb {
    funding_limit?: number;
}

export interface IGRBC extends ITitle {}// Префектура ЗАО
export interface IGRBCDb extends ITitleDb {}

export interface IRegion extends ITitle {} // внутригородская территория Можайский
export interface IRegionDb extends ITitleDb {}
//#endregion

//#region IPlayground - Плоскостное сооружение | Площадка
export interface IPoint2D { x: number, y: number }
// export type IMultiDimArray<T> = T[] | IMultiDimArray<T>[];
export type IMultiDimArray<T> = T[] | T[][];
export interface ICoords { coords: IMultiDimArray<IPoint2D> };
export interface IMinMax { min: number, max: number };
export type IPlaygroundYardAreaRelation = IOneRelation<'yard_area', IStrapi<IYardAreaFull>>;
export type IPlaygroundMafRelation = IManyRelation<'mafs', IStrapi<IMaf>>;
export type IPlaygroundRelations = IPlaygroundYardAreaRelation & IPlaygroundMafRelation;
export interface IPlayground {
    Status: string; // Утвержден
    Type: 'Детская площадка' | 'Спортивная площадка' | 'Для тихого отдыха';
    TypeComment?: string;
    Square: number;
    Coords?: IMultiDimArray<IPoint2D>;
    MinMax?: IMinMax;
    FundingLimit?: number;
}
export interface IPlaygroundDb {
    id: number;
    status: string;
    type: 'Детская площадка' | 'Спортивная площадка' | 'Для тихого отдыха';
    type_comment?: string;
    square: number;
    coords?: string;
    min_max?: string;
    funding_limit?: number;
}

export type IPlaygroundFull = IPlayground & IPlaygroundRelations;
//#endregion

//#region Maf
export type IMafTypeRelation = IOneRelation<'maf_type', IStrapi<IMafType>>;
export type IMafPlaygroundRelation = IOneRelation<'playground', IStrapi<IPlayground>>;
export type IMafCatalogMafRelation = IOneRelation<'catalog', IStrapi<ICatalog>>;
export type IMafProviderRelation = IOneRelation<'provider', IStrapi<IProvider>>;
export type IMafTerritoryTypesRelation = IManyRelation<'territory_types', IStrapi<ITerritoryType>[]>;
export type IMafAgeCategoryRelation = IOneRelation<'age_categories', IStrapi<IAgeCategory>[]>;
export type IMafRelations = IMafTypeRelation & IMafPlaygroundRelation & IMafCatalogMafRelation & IMafProviderRelation & IMafTerritoryTypesRelation & IMafAgeCategoryRelation;
export interface IMaf {
    Image: string; // image - Имя файла картинки
    VendorCode: string; // vendorCode - Номер по номенклатуре
    AnalogSample: string; // analogSample - Наименование производителя
    SampleCode: string; // sampleCode - Артикул образца
    Dimensions: string; // dimensions - Габаритные размеры
    Description: string; // description - Примечание
    Price: number; // price - Цена МАФ
    Name: string; // name - Наименование МАФ
    Units: string; // units - Ед. измерения
    TypeEquipment: string; // typeEquipment - Тип оборудования
    SafetyZones: string; // safetyZones - Имя файла зон безопасности
    TechDocumentation: string; // techDocumentation - Имя файла технической документации

    // maf_type: IStrapi<IMafType>;
    // playground: IStrapi<IPlayground>;
    // catalog_maf: IStrapi<ICatalogMaf>; // catalogName - Название каталога
    // provider: IStrapi<IProviderMaf>; // provider - Поставщик МАФ
    // territory_types: IStrapi<ITerritoryType>[]; // territoryType - Тип территории
    // age_categories: IStrapi<IAgeCategory>; // ageCategory - Возрастная категория
}
export interface IMafDb {
    id: number,
    image: string,
    // catalog_name: string,
    vendor_code: string,
    analog_sample: string,
    sample_code: string,
    dimensions: string,
    description: string,
    price: number,
    name: string,
    // provider: string,
    // type: string,
    units: string,
    type_equipment: string,
    safety_zones: string,
    tech_documentation: string,
    // age_categories: string,
}
export type IMafFull = IMaf & IMafRelations;

export interface IMafType extends ITitle {}
export interface IMafTypeDb extends ITitleDb {}
//#endregion

//#region Catalog - Каталог
export interface ICatalog extends ITitle {}
export interface ICatalogDb extends ITitleDb {}
//#endregion

//#region IProviderMaf - Поставщик
export interface IProvider extends ITitle {}
export interface IProviderDb extends ITitleDb {}
//#endregion

//#region ITerritoryType - Тип территории
export interface ITerritoryType extends ITitle {}
export interface ITerritoryTypeDb extends ITitleDb {}
//#endregion

//#region IAgeCategory - Возрастная категория
export interface IAgeCategory extends ITitle {
    Min: number;
    Max: number;
}
export interface IAgeCategoryDb extends ITitleDb {
    min: number;
    max: number;
}
//#endregion
