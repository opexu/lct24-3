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

export function downloadXmlFile( xmlContent: string, fileName: string = 'file.xml' ): void {
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
}

export function getFormattedDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
};