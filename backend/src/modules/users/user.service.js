import bcrypt from 'bcrypt';
import { userRepository } from './user.repository.js';
import { createService } from '../../shared/utils/crudFactory.js';

const baseService = createService(userRepository, { softDelete: true, defaultWhere: { ativo: true } });
const hidePassword = (user) => {
  const { senha, ...safeUser } = user;
  return safeUser;
};

export const userService = {
  ...baseService,
  async list(query) {
    const result = await baseService.list(query);
    return { ...result, data: result.data.map(hidePassword) };
  },
  async getById(id) {
    return hidePassword(await baseService.getById(id));
  },
  async create(data) {
    return hidePassword(await userRepository.create({ ...data, senha: await bcrypt.hash(data.senha, 10) }));
  },
  async update(id, data) {
    await baseService.getById(id);
    const payload = data.senha ? { ...data, senha: await bcrypt.hash(data.senha, 10) } : data;
    return hidePassword(await userRepository.update(id, payload));
  }
};
