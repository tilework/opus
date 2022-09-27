export type StringKeyOf<BaseType> = `${Extract<keyof BaseType, string | number>}`;

declare const emptyObjectSymbol: unique symbol;
export type EmptyObject = {[emptyObjectSymbol]?: never};