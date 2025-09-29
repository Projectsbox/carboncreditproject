import { Router } from 'express';
import { PrismaClient, ProjectStatus, ValidationStatus } from '../generated/prisma';
import { authenticateJwt, requireRoles } from '../middleware/auth';
import { z } from 'zod';

const prisma = new PrismaClient();
export const validationsRouter = Router();

validationsRouter.get('/pending', authenticateJwt, requireRoles(['VALIDATOR', 'ADMIN']), async (_req, res) => {
  const pending = await prisma.project.findMany({ where: { status: ProjectStatus.PENDING_VALIDATION }, orderBy: { createdAt: 'asc' } });
  res.json(pending);
});

const decisionSchema = z.object({
  status: z.nativeEnum(ValidationStatus),
  notes: z.string().optional(),
  approvedCredits: z.coerce.number().int().nonnegative().optional(),
});

validationsRouter.post('/:projectId/decide', authenticateJwt, requireRoles(['VALIDATOR', 'ADMIN']), async (req, res) => {
  const { projectId } = req.params;
  const parsed = decisionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { status, notes, approvedCredits } = parsed.data;

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const isApprove = status === ValidationStatus.APPROVED;

  const result = await prisma.$transaction(async (tx) => {
    const validation = await tx.validation.create({
      data: {
        projectId,
        status,
        notes,
        validatorId: req.user!.id,
        decidedAt: new Date(),
      },
    });

    const updatedProject = await tx.project.update({
      where: { id: projectId },
      data: {
        status: isApprove ? ProjectStatus.APPROVED : ProjectStatus.REJECTED,
        approvedCredits: isApprove ? (approvedCredits ?? project.estimatedCredits) : 0,
      },
    });

    if (isApprove) {
      const creditsToIssue = approvedCredits ?? project.estimatedCredits;
      await tx.creditLedger.update({
        where: { projectId },
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


