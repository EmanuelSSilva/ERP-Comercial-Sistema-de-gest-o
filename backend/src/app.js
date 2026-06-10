import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './shared/config/env.js';
import { sanitizeInput } from './shared/middlewares/sanitize.js';
import { errorHandler } from './shared/middlewares/errorHandler.js';
import { notFound } from './shared/middlewares/notFound.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { userRoutes } from './modules/users/user.routes.js';
import { customerRoutes } from './modules/customers/customer.routes.js';
import { supplierRoutes } from './modules/suppliers/supplier.routes.js';
import { categoryRoutes } from './modules/categories/category.routes.js';
import { productRoutes } from './modules/products/product.routes.js';
import { inventoryRoutes } from './modules/inventory/inventory.routes.js';
import { saleRoutes } from './modules/sales/sale.routes.js';
import { purchaseRoutes } from './modules/purchases/purchase.routes.js';
import { cashflowRoutes } from './modules/cashflow/cashflow.routes.js';
import { payableRoutes } from './modules/accounts-payable/accounts-payable.routes.js';
import { receivableRoutes } from './modules/accounts-receivable/accounts-receivable.routes.js';
import { dashboardRoutes } from './modules/dashboard/dashboard.routes.js';
import { reportRoutes } from './modules/reports/report.routes.js';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 250 }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(sanitizeInput);

app.get('/health', (_req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/cashflow', cashflowRoutes);
app.use('/api/accounts-payable', payableRoutes);
app.use('/api/accounts-receivable', receivableRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

app.use(notFound);
app.use(errorHandler);
