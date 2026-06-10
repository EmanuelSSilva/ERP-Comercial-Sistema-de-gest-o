import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { authService } from './auth.service.js';

export const authController = {
  login: asyncHandler(async (req, res) => res.json(await authService.login(req.body))),
  refresh: asyncHandler(async (req, res) => res.json(await authService.refresh(req.body))),
  logout: asyncHandler(async (req, res) => res.json(await authService.logout(req.body))),
  forgotPassword: asyncHandler(async (req, res) => res.json(await authService.forgotPassword(req.body))),
  changePassword: asyncHandler(async (req, res) => res.json(await authService.changePassword(req.user.id, req.body))),
  me: asyncHandler(async (req, res) => res.json(req.user))
};
