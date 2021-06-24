export type DiskType = "SSD" | "HDD" | "Flash" | '';
export enum ShopId {
    other = -1,
    MediaExpert = 0,
    Morele = 1
};

export interface Disk{
    size: number,
    type: DiskType,
}

export interface Laptop {
    name: string,
    url: string,
    cpu: string,
    gpu: string,
    RAM: number,
    disks: Array<Disk>, 
    price: number,
    shop: ShopId,
}

export const EmptyLaptop:Laptop = {
    name: '',
    url: '',
    cpu: '',
    gpu: '',
    RAM: Infinity,
    disks: [{size: Infinity, type: ''}],
    price: Infinity,
    shop: ShopId.other,
}


export function getDiskType(s:string):DiskType{
    if(s == 'HDD') return 'HDD';
    else if(s == 'SSD') return 'SSD';
    else if(s == 'Flash') return 'Flash';
    else return '';
}