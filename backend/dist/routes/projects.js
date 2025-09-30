"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectsRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../generated/prisma");
const auth_1 = require("../middleware/auth");
const zod_1 = require("zod");
const prisma = new prisma_1.PrismaClient();
exports.projectsRouter = (0, express_1.Router)();
const createProjectSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    location: zod_1.z.string().min(1),
    type: zod_1.z.nativeEnum(prisma_1.ProjectType),
    pricePerCredit: zod_1.z.coerce.number().positive(),
    estimatedCredits: zod_1.z.coerce.number().int().nonnegative().default(0),
});
exports.projectsRouter.post('/', auth_1.authenticateJwt, (0, auth_1.requireRoles)(['CREATOR', 'ADMIN']), async (req, res) => {
    const parsed = createProjectSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const data = parsed.data;
    const project = await prisma.project.create({
        data: {
            name: data.name,
            description: data.description,
            location: data.location,
            type: data.type,
            pricePerCredit: data.pricePerCredit,
            estimatedCredits: data.estimatedCredits,
            status: prisma_1.ProjectStatus.PENDING_VALIDATION,
            creatorId: req.user.id,
            creditLedger: { create: {} },
        },
    });
    res.status(201).json(project);
});
exports.projectsRouter.get('/', auth_1.authenticateJwt, async (_req, res) => {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(projects);
});
exports.projectsRouter.get('/mine', auth_1.authenticateJwt, (0, auth_1.requireRoles)(['CREATOR', 'ADMIN']), async (req, res) => {
    const projects = await prisma.project.findMany({ where: { creatorId: req.user.id }, orderBy: { createdAt: 'desc' } });
    res.json(projects);
});
//# sourceMappingURL=projects.js.map