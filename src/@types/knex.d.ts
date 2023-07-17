import { Knex } from 'knex';

declare module 'knex/types/tables' {
    export interface Tables {
      user: {
        userId: string;
        login: string;
        name: string;
        email: string;
        password: string;
      }
    }
  }