import { asyncHandler } from './asyncHandler.js';
import { AppError } from '../errors/AppError.js';

export function createRepository(modelName, options = {}) {
  const model = options.prisma[modelName];

  return {
    findAll: ({ page = 1, limit = 10, search, where = {}, include } = {}) => {
      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);
      const searchWhere = options.searchFields && search
        ? { OR: options.searchFields.map((field) => ({ [field]: { contains: search, mode: 'insensitive' } })) }
        : {};

      return Promise.all([
        model.findMany({
          where: { ...where, ...searchWhere },
          include,
          skip,
          take,
          orderBy: { createdAt: 'desc' }
        }),
        model.count({ where: { ...where, ...searchWhere } })
      ]);
    },
    findById: (id, include) => model.findUnique({ where: { id }, include }),
    create: (data) => model.create({ data }),
    update: (id, data) => model.update({ where: { id }, data }),
    softDelete: (id) => model.update({ where: { id }, data: { ativo: false } }),
    delete: (id) => model.delete({ where: { id } })
  };
}

export function createService(repository, options = {}) {
  return {
    async list(query) {
      const where = options.defaultWhere || {};
      const [data, total] = await repository.findAll({ ...query, where, include: options.include });
      return {
        data,
        meta: {
          total,
          page: Number(query.page || 1),
          limit: Number(query.limit || 10)
        }
      };
    },
    async getById(id) {
      const record = await repository.findById(id, options.include);
      if (!record) throw new AppError('Registro não encontrado.', 404);
      return record;
    },
    create(data) {
      return repository.create(data);
    },
    async update(id, data) {
      await this.getById(id);
      return repository.update(id, data);
    },
    async remove(id) {
      await this.getById(id);
      return options.softDelete ? repository.softDelete(id) : repository.delete(id);
    }
  };
}

export function createController(service) {
  return {
    list:    asyncHandler(async (req, res) => res.json(await service.list(req.validated?.query ?? req.query))),
    getById: asyncHandler(async (req, res) => res.json(await service.getById((req.validated?.params ?? req.params).id))),
    create:  asyncHandler(async (req, res) => res.status(201).json(await service.create(req.body, req.user))),
    update:  asyncHandler(async (req, res) => res.json(await service.update((req.validated?.params ?? req.params).id, req.body, req.user))),
    remove:  asyncHandler(async (req, res) => res.json(await service.remove((req.validated?.params ?? req.params).id, req.user)))
  };
}
