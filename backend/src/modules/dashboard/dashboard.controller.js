import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { dashboardService } from './dashboard.service.js';

export const dashboardController = {
  get: asyncHandler(async (_req, res) => res.json(await dashboardService.get()))
};
