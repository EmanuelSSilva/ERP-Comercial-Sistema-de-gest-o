import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { saleService } from './sale.service.js';

export const saleController = {
  list: asyncHandler(async (_req, res) => res.json(await saleService.list())),
  getById: asyncHandler(async (req, res) => res.json(await saleService.getById(req.params.id))),
  create: asyncHandler(async (req, res) => res.status(201).json(await saleService.create(req.body, req.user)))
};
