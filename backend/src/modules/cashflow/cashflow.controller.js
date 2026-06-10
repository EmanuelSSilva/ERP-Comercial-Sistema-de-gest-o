import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { cashflowService } from './cashflow.service.js';

export const cashflowController = {
  list: asyncHandler(async (_req, res) => res.json(await cashflowService.list())),
  open: asyncHandler(async (req, res) => res.status(201).json(await cashflowService.open(req.body, req.user))),
  close: asyncHandler(async (req, res) => res.json(await cashflowService.close(req.params.id, req.body))),
  movement: asyncHandler(async (req, res) => res.status(201).json(await cashflowService.movement(req.params.id, req.body)))
};
