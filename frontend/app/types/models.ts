import { Collection, Item, Property, Rights, Scheme, User } from '@prisma/client';

export type ItemWithProperties = Item & {
  properties: Property[];
};

export type UserWithRights = User & {
  rights: Rights | null;
};

export type CollectionFull = Collection & {
  schemes: Scheme[];
  items: ItemWithProperties[];
};

// import { Collection, Item as Item_, Scheme, Property as _Property } from '@prisma/client';

// export type Property =
//   | {
//       type: 'Line' | 'Multiline' | 'Date';
//       value: string;
//     }
//   | {
//       type: 'Bool';
//       value: boolean;
//     }
//   | {
//       type: 'Int';
//       value: number;
//     };

// export type Item = Item_ & {
//   properties: Property[];
// };

// export type CollectionOverview = Collection & {
//   itemCount: number;
// };

// export type CollectionFull = Collection & {
//   schemes: Scheme[];
//   items: Item[];
// };

// export class Model {
//   static Item(item: Item_ & { properties: _Property[] }, schemes: Scheme[]): Item {
//     const {properties, ...rest} = item
//     return {
//       ...rest,
//       properties: properties.map((property, i) => {
//         switch(schemes[i].type) {

//         }
//       } )
//     }
//   }
// }
