"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationsRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../generated/prisma");
const auth_1 = require("../middleware/auth");
const zod_1 = require("zod");
const prisma = new prisma_1.PrismaClient();
exports.validationsRouter = (0, express_1.Router)();
exports.validationsRouter.get('/pending', auth_1.authenticateJwt, (0, auth_1.requireRoles)(['VALIDATOR', 'ADMIN']), async (_req, res) => {
    const pending = await prisma.project.findMany({ where: { status: prisma_1.ProjectStatus.PENDING_VALIDATION }, orderBy: { createdAt: 'asc' } });
    res.json(pending);
});
const decisionSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(prisma_1.ValidationStatus),
    notes: zod_1.z.string().optional(),
    approvedCredits: zod_1.z.coerce.number().int().nonnegative().optional(),
});
exports.validationsRouter.post('/:projectId/decide', auth_1.authenticateJwt, (0, auth_1.requireRoles)(['VALIDATOR', 'ADMIN']), async (req, res) => {
    const { projectId } = req.params;
    if (!projectId)
        return res.status(400).json({ error: 'ProjectId is required' });
    const parsed = decisionSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const { status, notes, approvedCredits } = parsed.data;
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project)
        return res.status(404).json({ error: 'Project not found' });
    const isApprove = status === prisma_1.ValidationStatus.APPROVED;
    const result = await prisma.$transaction(async (tx) => {
        const validation = await tx.validation.create({
            data: {
                projectId: projectId,
                status,
                notes: notes ?? null,
                validatorId: req.user.id,
                decidedAt: new Date(),
            },
        });
        const updatedProject = await tx.project.update({
            where: { id: projectId },
            data: {
                status: isApprove ? prisma_1.ProjectStatus.APPROVED : prisma_1.ProjectStatus.REJECTED,
                approvedCredits: isApprove ? (approvedCredits ?? project.estimatedCredits) : 0,
            },
        });
        if (isApprove) {
            const creditsToIssue = approvedCredits ?? project.estimatedCredits;
            await tx.creditLedger.update({
                where: { projectId: projectId }, // ensure projectId is unique in schema
                data: {
                    totalIssued: { increment: creditsToIssue },
                    remaining: { increment: creditsToIssue },
                },
            });
        }
        return { validation, project: updatedProject };
    });
    res.json(result);
});
//# sourceMappingURL=validations.js.map