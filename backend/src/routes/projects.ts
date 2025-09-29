import { Router } from 'express';
import { PrismaClient, ProjectStatus, ProjectType } from '../generated/prisma';
import { authenticateJwt, requireRoles } from '../middleware/auth';
import { z } from 'zod';

const prisma = new PrismaClient();
export const projectsRouter = Router();

const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  type: z.nativeEnum(ProjectType),
  pricePerCredit: z.coerce.number().positive(),
  estimatedCredits: z.coerce.number().int().nonnegative().default(0),
});

projectsRouter.post('/', authenticateJwt, requireRoles(['CREATOR', 'ADMIN']), async (req, res) => {
  const parsed = createProjectSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const data = parsed.data;
  const project = await prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      location: data.location,
      type: data.type,
      pricePerCredit: data.pricePerCredit,
      estimatedCredits: data.estimatedCredits,
      status: ProjectStatus.PENDING_VALIDATION,
      creatorId: req.user!.id,
      creditLedger: { create: {} },
    },
  });
  res.status(201).json(project);
});

projectsRouter.get('/', authenticateJwt, async (_req, res) => {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(projects);
});

projectsRouter.get('/mine', authenticateJwt, requireRoles(['CREATOR', 'ADMIN']), async (req, res) => {
  const projects = await prisma.project.findMany({ where: { creatorId: req.user!.id }, orderBy: { createdAt: 'desc' } });
  res.json(projects);
});


