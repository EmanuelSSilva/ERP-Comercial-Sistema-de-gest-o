import { createController } from '../../shared/utils/crudFactory.js';
import { userService } from './user.service.js';

export const userController = createController(userService);
