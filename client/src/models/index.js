// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const AccountType = {
  "BUYER": "BUYER",
  "TRADER": "TRADER",
  "SUPPLIER": "SUPPLIER",
  "SHIPPING_LINE": "SHIPPING_LINE"
};

const { Users } = initSchema(schema);

export {
  Users,
  AccountType
};