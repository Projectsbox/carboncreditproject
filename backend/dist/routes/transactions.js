"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionsRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../generated/prisma");
const auth_1 = require("../middleware/auth");
const zod_1 = require("zod");
const prisma = new prisma_1.PrismaClient();
exports.transactionsRouter = (0, express_1.Router)();
const purchaseSchema = zod_1.z.object({
    projectId: zod_1.z.string().min(1),
    credits: zod_1.z.coerce.number().int().positive(),
});
exports.transactionsRouter.post('/purchase', auth_1.authenticateJwt, (0, auth_1.requireRoles)(['BUYER', 'ADMIN']), async (req, res) => {
    const parsed = purchaseSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const { projectId, credits } = parsed.data;
    const project = await prisma.project.findUnique({ where: { id: projectId }, include: { creditLedger: true } });
    if (!project || !project.creditLedger)
        return res.status(404).json({ error: 'Project not found' });
    if (project.creditLedger.remaining < credits)
        return res.status(400).json({ error: 'Not enough credits available' });
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
                buyerId: req.user.id,
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
exports.transactionsRouter.get('/mine', auth_1.authenticateJwt, (0, auth_1.requireRoles)(['BUYER', 'ADMIN']), async (req, res) => {
    const items = await prisma.transaction.findMany({ where: { buyerId: req.user.id }, orderBy: { createdAt: 'desc' } });
    res.json(items);
});
//# sourceMappingURL=transactions.js.map