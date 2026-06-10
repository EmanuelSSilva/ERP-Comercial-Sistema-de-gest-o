import { AppError } from '../errors/AppError.js';

export const permissions = {
  ADMIN: ['*'],
  GERENTE: ['dashboard:read', 'customer:write', 'supplier:write', 'product:write', 'financial:write', 'inventory:read', 'inventory:write', 'purchase:write', 'sale:write', 'report:read'],
  VENDEDOR: ['customer:write', 'sale:write', 'inventory:read', 'dashboard:read'],
  ESTOQUISTA: ['inventory:read', 'inventory:write', 'product:write', 'purchase:write', 'dashboard:read'],
  FINANCEIRO: ['financial:write', 'cashflow:write', 'dashboard:read', 'report:read']
};

export function authorize(...requiredPermissions) {
  return (req, _res, next) => {
    const rolePermissions = permissions[req.user?.role] || [];
    const allowed = rolePermissions.includes('*') || requiredPermissions.every((item) => rolePermissions.includes(item));

    if (!allowed) {
      throw new AppError('Você não possui permissão para executar esta ação.', 403);
    }

    next();
  };
}
