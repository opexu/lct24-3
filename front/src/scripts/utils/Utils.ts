export function CalcDiff<T extends { [ key: string ]: any }>( arr1: T[], arr2: T[], key?: string ) {
    const isAdded = arr1.length > arr2.length;
    const max = isAdded ? arr1 : arr2;
    const min = isAdded ? arr2 : arr1;
    const diff = max.filter( m => ( key ? !min.includes( m[ key ] ) : !min.includes( m ) ) );
    return { isAdded, diff }
}

type NestedObject = { [ key: string ]: NestedObject | number };
export function getValue( obj: NestedObject, key: string ): any | undefined {
    return key.split( '.' ).reduce( ( acc: NestedObject | undefined, currentKey: string ): any | undefined => {
        return acc ? acc[ currentKey ] as number | undefined : undefined;
    }, obj );
}