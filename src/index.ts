import { Client } from "./client";

export { default as Field } from './builder/Field';
export { default as InlineFragment } from './builder/InlineFragment';
export { default as Query } from './builder/Query';
export { default as Mutation } from './builder/Mutation';
export { default as Batch } from './builder/Batch';

export default new Client();