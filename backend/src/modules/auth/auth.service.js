import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { authRepository } from './auth.repository.js';
import { env } from '../../shared/config/env.js';
import { AppError } from '../../shared/errors/AppError.js';
import { logger } from '../../shared/logger/logger.js';

const publicUser = ({ senha, ...user }) => user;
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

function signAccessToken(user) {
  return jwt.sign({ role: user.role }, env.jwtAccessSecret, {
    subject: user.id,
    expiresIn: env.jwtAccessExpiresIn
  });
}

function signRefreshToken(user) {
  return jwt.sign({}, env.jwtRefreshSecret, {
    subject: user.id,
    expiresIn: env.jwtRefreshExpiresIn
  });
}

export const authService = {
  async login({ email, senha }) {
    const user = await authRepository.findUserByEmail(email);
    const passwordMatches = user ? await bcrypt.compare(senha, user.senha) : false;

    if (!user || !passwordMatches || !user.ativo) {
      throw new AppError('Credenciais inválidas.', 401);
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    const decoded = jwt.decode(refreshToken);

    await authRepository.createRefreshToken({
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      expiresAt: new Date(decoded.exp * 1000)
    });
    await authRepository.updateUser(user.id, { ultimoLogin: new Date() });
    logger.info({ message: 'Login realizado', userId: user.id });

    return { user: publicUser(user), accessToken, refreshToken };
  },

  async refresh({ refreshToken }) {
    const payload = jwt.verify(refreshToken, env.jwtRefreshSecret);
    const storedToken = await authRepository.findRefreshToken(hashToken(refreshToken));

    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      throw new AppError('Refresh token inválido.', 401);
    }

    await authRepository.revokeRefreshToken(storedToken.id);
    const accessToken = signAccessToken(storedToken.user);
    const nextRefreshToken = signRefreshToken(storedToken.user);
    const decoded = jwt.decode(nextRefreshToken);

    await authRepository.createRefreshToken({
      tokenHash: hashToken(nextRefreshToken),
      userId: payload.sub,
      expiresAt: new Date(decoded.exp * 1000)
    });

    return { accessToken, refreshToken: nextRefreshToken, user: publicUser(storedToken.user) };
  },

  async logout({ refreshToken }) {
    const storedToken = await authRepository.findRefreshToken(hashToken(refreshToken));
    if (storedToken && !storedToken.revokedAt) {
      await authRepository.revokeRefreshToken(storedToken.id);
      logger.info({ message: 'Logout realizado', userId: storedToken.userId });
    }

    return { message: 'Sessão encerrada.' };
  },

  async forgotPassword({ email }) {
    const user = await authRepository.findUserByEmail(email);
    if (user) {
      logger.info({ message: 'Solicitação de recuperação de senha', userId: user.id });
    }

    return { message: 'Se o e-mail existir, as instruções serão enviadas.' };
  },

  async changePassword(userId, { senhaAtual, novaSenha }) {
    const user = await authRepository.findUserById(userId);
    const passwordMatches = user ? await bcrypt.compare(senhaAtual, user.senha) : false;

    if (!passwordMatches) {
      throw new AppError('Senha atual inválida.', 401);
    }

    await authRepository.updateUser(userId, { senha: await bcrypt.hash(novaSenha, 10) });
    return { message: 'Senha alterada com sucesso.' };
  }
};
