import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum AccountType {
  BUYER = "BUYER",
  TRADER = "TRADER",
  SUPPLIER = "SUPPLIER",
  SHIPPING_LINE = "SHIPPING_LINE"
}



type UsersMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Users {
  readonly id: string;
  readonly address: string;
  readonly email: string;
  readonly name: string;
  readonly desc: string;
  readonly type: AccountType | keyof typeof AccountType;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Users, UsersMetaData>);
  static copyOf(source: Users, mutator: (draft: MutableModel<Users, UsersMetaData>) => MutableModel<Users, UsersMetaData> | void): Users;
}