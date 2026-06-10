import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { reportService } from './report.service.js';

export const reportController = {
  get: asyncHandler(async (req, res) => res.json(await reportService.get(req.params.type, req.query.format)))
};
