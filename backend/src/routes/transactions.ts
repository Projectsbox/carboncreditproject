import { Router } from 'express';
import { PrismaClient } from '../generated/prisma';
import { authenticateJwt, requireRoles } from '../middleware/auth';
import { z } from 'zod';

const prisma = new PrismaClient();
export const transactionsRouter = Router();

const purchaseSchema = z.object({
  projectId: z.string().min(1),
  credits: z.coerce.number().int().positive(),
});

transactionsRouter.post('/purchase', authenticateJwt, requireRoles(['BUYER', 'ADMIN']), async (req, res) => {
  const parsed = purchaseSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { projectId, credits } = parsed.data;

  const project = await prisma.project.findUnique({ where: { id: projectId }, include: { creditLedger: true } });
  if (!project || !project.creditLedger) return res.status(404).json({ error: 'Project not found' });
  if (project.creditLedger.remaining < credits) return res.status(400).json({ error: 'Not enough credits available' });

  const unitPrice = Number(project.pricePerCredit);
  const totalPrice = unitPrice * credits;

  const tx = await prisma.$transaction(async (trx) => {
    await trx.creditLedger.update({
      where: { projectId },
      data: {
        totalSold: { increment: credits },
        remaining: { decrement: credits },
      },
    });
    const transaction = await trx.transaction.create({
      data: {
        buyerId: req.user!.id,
        projectId,
        credits,
        unitPrice,
        totalPrice,
      },
    });
    return transaction;
  });

  res.status(201).json(tx);
});

transactionsRouter.get('/mine', authenticateJwt, requireRoles(['BUYER', 'ADMIN']), async (req, res) => {
  const items = await prisma.transaction.findMany({ where: { buyerId: req.user!.id }, orderBy: { createdAt: 'desc' } });
  res.json(items);
});


