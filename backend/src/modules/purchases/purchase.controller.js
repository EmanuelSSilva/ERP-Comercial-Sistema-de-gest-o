import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { purchaseService } from './purchase.service.js';

export const purchaseController = {
  list: asyncHandler(async (_req, res) => res.json(await purchaseService.list())),
  getById: asyncHandler(async (req, res) => res.json(await purchaseService.getById(req.params.id))),
  create: asyncHandler(async (req, res) => res.status(201).json(await purchaseService.create(req.body, req.user)))
};
