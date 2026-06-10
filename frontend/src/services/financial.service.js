import { createCrudService } from './crud.service';
export const accountsPayableService = createCrudService('/accounts-payable');
export const accountsReceivableService = createCrudService('/accounts-receivable');
