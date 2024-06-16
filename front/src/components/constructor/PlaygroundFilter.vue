<template>
<Dialog class="text-primary w-4/5 overflow-hidden"
:pt="{ content: 'relative h-fit overflow-y-auto' }"
:pt-options="{ mergeProps: true }"
modal header="Загрузка файлов"
v-model:visible="visible">
    <template #header>
        <div class="mr-5 text-primary dark:text-surface-300 w-fit flex flex-col space-y-4">
            <span class="text-lg text-primary">Выбор параметров наполнения площадки</span>
        </div>
    </template>
    <div class="relative w-full max-h-full flex flex-col gap-2 overflow-hiden">
        
        <Fieldset legend="Фильтры поиска" toggleable>
            <div class="w-full h-full flex flex-col gap-2">

                <!-- ТИП МАФОВ -->
                <MultiSelect class="w-full"
                filter showClear
                :resetFilterOnHide="false"
                v-model="selectedMafTypesArr"
                :options="mafTypesArr"
                :optionLabel="( option: IStrapi<IMafType> ) => {
                    return option?.attributes.Title
                }"
                placeholder="Выбрать тип мафа"
                >
                    <template #option="{ option, index }: { option: IStrapi<IMafType>, index: number }">
                        {{ option?.attributes.Title }}
                    </template>
                </MultiSelect>

                <!-- КАТАЛОГИ -->
                <MultiSelect class="w-full"
                filter showClear
                :resetFilterOnHide="false"
                v-model="selectedCatalogsArr"
                :options="catalogsArr"
                :optionLabel="( option: IStrapi<ICatalog> ) => {
                    return option?.attributes.Title
                }"
                placeholder="Выбрать каталог"
                >
                    <template #option="{ option, index }: { option: IStrapi<ICatalog>, index: number }">
                        {{ option?.attributes.Title }}
                    </template>
                </MultiSelect>

                <!-- ПОСТАВЩИКИ -->
                <MultiSelect class="w-full"
                filter showClear
                :resetFilterOnHide="false"
                v-model="selectedProvidersArr"
                :options="providersArr"
                :optionLabel="( option: IStrapi<IProvider> ) => {
                    return option?.attributes.Title
                }"
                placeholder="Выбрать поставщика"
                >
                    <template #option="{ option, index }: { option: IStrapi<IProvider>, index: number }">
                        {{ option?.attributes.Title }}
                    </template>
                </MultiSelect>

                <!-- ТИПЫ ТЕРРИТОРИЙ -->
                <MultiSelect class="w-full"
                filter showClear
                :resetFilterOnHide="false"
                v-model="selectedTerritoryTypesArr"
                :options="territoryTypesArr"
                :optionLabel="( option: IStrapi<ITerritoryType> ) => {
                    return option?.attributes.Title
                }"
                placeholder="Выбрать типы территорий"
                >
                    <template #option="{ option, index }: { option: IStrapi<ITerritoryType>, index: number }">
                        {{ option?.attributes.Title }}
                    </template>
                </MultiSelect>

                <!-- ВОЗРАСТНЫЕ КАТЕГОРИИ -->
                <MultiSelect class="w-full"
                filter showClear
                :resetFilterOnHide="false"
                v-model="selectedAgeCategoriesArr"
                :options="ageCategoriesArr"
                :optionLabel="( option: IStrapi<IAgeCategory> ) => {
                    return option?.attributes.Title
                }"
                placeholder="Выбрать возрастные категории"
                >
                    <template #option="{ option, index }: { option: IStrapi<IAgeCategory>, index: number }">
                        {{ option?.attributes.Title }}
                    </template>
                </MultiSelect>

                <div class="w-full flex flex-row gap-2">
                    
                    <div class="w-full flex flex-col gap-2">
                        <label for="minPrice" class=""
                        :class="[ !useMinPrice ? 'text-surface-500': '' ]"
                        >Минимальная цена</label>
                        <div class="flex flex-row gap-2 items-center">
                            <Checkbox v-model="useMinPrice" :binary="true" />
                            <InputNumber class="w-full" inputId="minPrice"
                            v-model="minPrice"
                            :disabled="!useMinPrice"
                            />
                        </div>
                    </div>

                    <div class="w-full flex flex-col gap-2">
                        <label for="maxPrice" class=""
                        :class="[ !useMaxPrice ? 'text-surface-500' : '' ]"
                        >Максимальная цена</label>
                        <div class="flex flex-row gap-2 items-center">
                            <Checkbox v-model="useMaxPrice" :binary="true" />
                            <InputNumber class="w-full" inputId="maxPrice"
                            v-model="maxPrice"
                            :disabled="!useMaxPrice"
                            />
                        </div>
                    </div>

                    <div class="w-full flex flex-col gap-2">
                        <label for="priceLimit" class=""
                        :class="[ !usePriceLimit ? 'text-surface-500' : '' ]"
                        >Лимит площадки</label>
                        <div class="flex flex-row gap-2 items-center">
                            <Checkbox v-model="usePriceLimit" :binary="true" />
                            <InputNumber class="w-full" inputId="priceLimit"
                            v-model="priceLimit"
                            :disabled="!usePriceLimit"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Fieldset>
        
        <Button outlined class="w-full"
        :disabled="!CAN_APPLY_FILTERS"
        @click="onApplyFiltersClick"
        v-tooltip.bottom = "'Применить фильтры'"
        >Применить</Button>

        <DataTable lazy
        v-if="mafsArr.length > 0"
        :loading="IN_PROCESS"
        dataKey="id" tableStyle="min-width: 50rem"
        scrollable scrollHeight="400px"
        paginator :rows="pageSize" :rowsPerPageOptions="[10, 20, 50, 100]" 
        :totalRecords="totalRecords"
        v-model:selection="selectedMafs" 
        :value="mafsArr"
        paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="с {first} по {last} из {totalRecords}"
        :row-class="disableRows"
        @page="onPageClick"
        @update:rows="onRowsChange"
        >
            <Column selectionMode="multiple" headerStyle="width: 3rem">
            </Column>
            <Column field="id" header="ID"></Column>
            <Column field="attributes.Name" header="Наим. МАФ"></Column>
            <Column field="attributes.AnalogSample" header="Наим. производителя"></Column>
            <Column field="attributes.SampleCode" header="Арт. образца"></Column>
            <Column field="attributes.TypeEquipment" header="Тип оборудования"></Column>
            <Column field="attributes.Dimensions" header="Габаритные размеры"></Column>
            <Column field="attributes.Price" header="Цена"></Column>
        </DataTable>

        <Button outlined class="w-full"
        :disabled="selectedMafs.length === 0"
        @click="onAddToSceneClick"
        v-tooltip.bottom = "'Добавить в редактор'"
        >Добавить выделенное</Button>
    </div>
    <Toast />
</Dialog>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Fieldset from 'primevue/fieldset';
import Checkbox from 'primevue/checkbox';
import DataTable, { type DataTablePageEvent } from 'primevue/datatable';
import Column from 'primevue/column';
import MultiSelect from 'primevue/multiselect';
import { type IAxios, type IPagination, type IStrapi } from '@/types/strapi';
import { type ITerritoryType, type IAgeCategory, type ICatalog, type IMafFull, type IPlayground, type IPlaygroundFull, type IPlaygroundYardAreaRelation, type IProvider, type IMafType, type IDxfParsedMafObj } from '@/types/IReestr';
import { computed, onMounted, ref, watch } from 'vue';
import { usePlaygroundStore } from '@/stores/playground-store';
import { storeToRefs } from 'pinia';
import { useApi } from '@/composables/useAPI';
import { PLAYGROUND_API, PLAYGROUND_KEY } from '@/api/playground';
import { useCSStore } from '@/stores/cs-store';
import { MAF_API, MAF_KEY } from '@/api/maf';
import { MAF_TYPE_API, MAF_TYPE_KEY } from '@/api/maf-type';
import { CATALOG_API, CATALOG_KEY } from '@/api/catalog';
import { PROVIDER_API, PROVIDER_KEY } from '@/api/provider';
import { TERRITORY_TYPE_API, TERRITORY_TYPE_KEY } from '@/api/territory-type';
import { AGE_CATEGORY_API, AGE_CATEGORY_KEY } from '@/api/age-category';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const CSStore = useCSStore();
const { strapiget } = useApi();
const PlaygroundStore = usePlaygroundStore();

const visible = defineModel<boolean>('playgroundFilterVisible');

const mafTypesArr = ref<IStrapi<IMafType>[]>([]);
const selectedMafTypesArr = ref<IStrapi<IMafType>[]>([]);

const catalogsArr = ref<IStrapi<ICatalog>[]>([]);
const selectedCatalogsArr = ref<IStrapi<ICatalog>[]>([]);

const providersArr = ref<IStrapi<IProvider>[]>([]);
const selectedProvidersArr = ref<IStrapi<IProvider>[]>([]);

const territoryTypesArr = ref<IStrapi<ITerritoryType>[]>([]);
const selectedTerritoryTypesArr = ref<IStrapi<ITerritoryType>[]>([]);

const ageCategoriesArr = ref<IStrapi<IAgeCategory>[]>([]);
const selectedAgeCategoriesArr = ref<IStrapi<IAgeCategory>[]>([]);

const minPrice = ref(0);
const useMinPrice = ref(false);
const maxPrice = ref(0);
const useMaxPrice = ref(false);
const { priceLimit, usePriceLimit } = storeToRefs( PlaygroundStore );

const page = ref(1);
const pageSize = ref(10);
const totalRecords = ref();
onMounted( async () => {
    const [ mafTypeRes, catalogsRes, providersRes, territoryTypesRes, ageCategoriesRes ] = await Promise.all([
        strapiget<IAxios<IStrapi<IMafType>[]>, MAF_TYPE_API[MAF_TYPE_KEY.GET_ALL]>( MAF_TYPE_API[MAF_TYPE_KEY.GET_ALL] ),
        strapiget<IAxios<IStrapi<ICatalog>[]>, CATALOG_API[CATALOG_KEY.GET_ALL]>( CATALOG_API[CATALOG_KEY.GET_ALL] ),
        strapiget<IAxios<IStrapi<IProvider>[]>, PROVIDER_API[PROVIDER_KEY.GET_ALL]>( PROVIDER_API[PROVIDER_KEY.GET_ALL] ),
        strapiget<IAxios<IStrapi<ITerritoryType>[]>, TERRITORY_TYPE_API[TERRITORY_TYPE_KEY.GET_ALL]>( TERRITORY_TYPE_API[TERRITORY_TYPE_KEY.GET_ALL] ),
        strapiget<IAxios<IStrapi<IAgeCategory>[]>, AGE_CATEGORY_API[AGE_CATEGORY_KEY.GET_ALL]>( AGE_CATEGORY_API[AGE_CATEGORY_KEY.GET_ALL] ),
    ]);
    
    mafTypesArr.value = mafTypeRes.data.data;
    catalogsArr.value = catalogsRes.data.data;
    providersArr.value = providersRes.data.data;
    territoryTypesArr.value = territoryTypesRes.data.data;
    ageCategoriesArr.value = ageCategoriesRes.data.data;
});

const CAN_APPLY_FILTERS = computed(() => {
    if( IN_PROCESS.value || POINTS_IN_PROCESS.value
    //  || selectedMafTypesArr.value.length === 0 
    //  || selectedCatalogsArr.value.length === 0 
    //  || selectedProvidersArr.value.length === 0
    //  || selectedTerritoryTypesArr.value.length === 0
    //  || selectedAgeCategoriesArr.value.length === 0 
    ){
        return false;
    }else{
        return true;
    }
})

const IN_PROCESS = ref(false);
async function onApplyFiltersClick(){
    if( IN_PROCESS.value ) return;
    try{
        IN_PROCESS.value = true;
        const price: { min?: number, max?: number } = {};
        if( useMinPrice.value ) price.min = minPrice.value;
        if( useMaxPrice.value ) price.max = maxPrice.value;
        const mafsRes = await strapiget<IAxios<IStrapi<IMafFull>[],Record<'pagination', IPagination>>, MAF_API[MAF_KEY.FILTER_MAFS]>( MAF_API[MAF_KEY.FILTER_MAFS], 
            selectedMafTypesArr.value.map( v => v.id ),
            selectedCatalogsArr.value.map( v => v.id ),
            selectedProvidersArr.value.map( v => v.id ),
            selectedTerritoryTypesArr.value.map( v => v.id ),
            selectedAgeCategoriesArr.value.map( v => v.id ),
            page.value, pageSize.value,
            price,
        );
        console.log('mafsRes: ', mafsRes);
        mafsArr.value = mafsRes.data.data;
        totalRecords.value = mafsRes.data.meta?.pagination.total;
        console.log('totalRecords: ', totalRecords.value)
    }catch(e){
        console.error('Ошибка фильтров; ', e);
    }finally{
        IN_PROCESS.value = false;
    }
}

const mafsArr = ref<IStrapi<IMafFull>[]>([]);
const selectedMafs = ref<IStrapi<IMafFull>[]>([]);

function onPageClick( event: DataTablePageEvent ){
    page.value = event.page + 1;
    onApplyFiltersClick();
}
function onRowsChange( rows: number ){
    pageSize.value = rows;
}

const POINTS_IN_PROCESS = ref(false);
async function onAddToSceneClick(){
    if( POINTS_IN_PROCESS.value ) return;
    try{
        const pointsRes = await strapiget<IDxfParsedMafObj[], MAF_API[MAF_KEY.POINTS]>( MAF_API[MAF_KEY.POINTS], selectedMafs.value.map( v => v.id ) );
        console.log('pointsRes: ', pointsRes);
        for( let i = 0; i < pointsRes.data.length; i++ ){
            const g = pointsRes.data[ i ];
            const maf = selectedMafs.value.find( m => m.id === g.id );
            if( !maf ) continue;
            if( !PlaygroundStore.canAdd( maf.attributes.Price ?? 0 ) ){
                toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Превышен лимит', life: 3000 });
                continue;
            }
            PlaygroundStore.addPrice( maf.attributes.Price ?? 0 );
            CSStore.CS?.drawMaf( g, maf );
        }
        
    }catch(e){
        console.error('Ошибка получения данных для добавления в сцену', e);
    }finally{
        POINTS_IN_PROCESS.value = false;
    }
}

function disableRows( row: any ){
    console.log(`row.attributes.SafetyZones: ${row.id}`, row.attributes.SafetyZones === '');
    return row.attributes.SafetyZones === '' ? 'disabled-row' : '';
}
</script>

<style scoped>
:deep(.disabled-row) {
  cursor: default !important;
  pointer-events: none;
  user-select: none;
  background-color: red;
  opacity: 0.1;
}
</style>