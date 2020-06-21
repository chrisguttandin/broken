import { IStringifyable } from '../interfaces';
import { TStringifyableJsonObject } from './stringifyable-json-object';

export type TStringifyableJsonValue =
    | boolean // tslint:disable-line:no-null-undefined-union
    | null
    | number
    | string
    | undefined
    | IStringifyable
    | TStringifyableJsonObject
    | TStringifyableJsonValue[];
