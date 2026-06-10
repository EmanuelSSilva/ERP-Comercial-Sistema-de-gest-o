import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { inventoryService } from './inventory.service.js';

export const inventoryController = {
  list: asyncHandler(async (req, res) => res.json(await inventoryService.list(req.query))),
  inventory: asyncHandler(async (_req, res) => res.json(await inventoryService.inventory())),
  create: asyncHandler(async (req, res) => res.status(201).json(await inventoryService.create(req.body, req.user)))
};
