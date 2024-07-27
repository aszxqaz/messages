import { PropertyType } from '@prisma/client';

export const CONTENT_PROPERTY_TYPE: Record<PropertyType, string> = {
  Bool: 'Boolean',
  Date: 'Date',
  Int: 'Integer',
  Line: 'Text',
  Multiline: 'Multiline',
};

export function getPropertyTypeByContent(content: string): PropertyType | undefined {
  return Object.entries(CONTENT_PROPERTY_TYPE).find(([_, value]) => value == content)?.[0] as
    | PropertyType
    | undefined;
}

export function getContentByPropertyType(propertyType: PropertyType): string {
  return CONTENT_PROPERTY_TYPE[propertyType];
}
