import { Router } from 'express';
import { PrismaClient, ProjectStatus, ValidationStatus } from '../generated/prisma';
import { authenticateJwt, requireRoles } from '../middleware/auth';

const prisma = new PrismaClient();
export const adminRouter = Router();

// Only ADMIN role can access these endpoints
adminRouter.use(authenticateJwt, requireRoles(['ADMIN']));

adminRouter.get('/overview', async (_req, res) => {
  const [totalProjects, pendingCount, approvedCount, rejectedCount, txAgg] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: ProjectStatus.PENDING_VALIDATION } }),
    prisma.project.count({ where: { status: ProjectStatus.APPROVED } }),
    prisma.project.count({ where: { status: ProjectStatus.REJECTED } }),
    prisma.transaction.aggregate({
      _sum: { totalPrice: true, credits: true },
      _count: { _all: true },
    }),
  ]);

  const totalRevenue = Number(txAgg._sum.totalPrice ?? 0);
  const totalCreditsSold = Number(txAgg._sum.credits ?? 0);

  const issuedAgg = await prisma.creditLedger.aggregate({ _sum: { totalIssued: true } });
  const totalIssued = Number(issuedAgg._sum.totalIssued ?? 0);

  res.json({
    totals: {
      totalProjects,
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
      totalIssued,
      totalCreditsSold,
      totalRevenue,
      transactionsCount: txAgg._count._all,
    },
  });
});

adminRouter.get('/projects', async (req, res) => {
  const status = (req.query.status as string | undefined) as keyof typeof ProjectStatus | undefined;
  const where = status ? { status: ProjectStatus[status] } : {};
  const projects = await prisma.project.findMany({ where, orderBy: { createdAt: 'desc' }, include: { creator: true } });
  res.json(projects);
});

adminRouter.get('/transactions', async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 25;
  const items = await prisma.transaction.findMany({ orderBy: { createdAt: 'desc' }, take: limit, include: { project: true, buyer: true } });
  res.json(items);
});

adminRouter.get('/timeseries', async (_req, res) => {
  // Last 6 months by month for approvals (sum approvedCredits) and sales (sum credits)
  const since = new Date();
  since.setMonth(since.getMonth() - 5);
  since.setDate(1);

  const [approvals, sales] = await Promise.all([
    prisma.validation.findMany({
      where: { status: ValidationStatus.APPROVED, decidedAt: { gte: since } },
      select: { decidedAt: true, project: { select: { approvedCredits: true, name: true } } },
    }),
    prisma.transaction.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true, credits: true, totalPrice: true } }),
  ]);

  function key(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  const months: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const dt = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(key(dt));
  }

  const issuanceByMonth: Record<string, number> = Object.fromEntries(months.map(m => [m, 0]));
  const salesByMonth: Record<string, { credits: number; revenue: number }> = Object.fromEntries(months.map(m => [m, { credits: 0, revenue: 0 }]));

  approvals.forEach(a => {
    const k = key(new Date(a.decidedAt!));
    if (k in issuanceByMonth) {
      issuanceByMonth[k] += a.project?.approvedCredits ?? 0;
    }
  });
  sales.forEach(s => {
    const k = key(new Date(s.createdAt));
    if (k in salesByMonth) {
      salesByMonth[k].credits += s.credits;
      salesByMonth[k].revenue += Number(s.totalPrice);
    }
  });

  const data = months.map(m => ({ month: m, approvedCredits: issuanceByMonth[m], soldCredits: salesByMonth[m].credits, revenue: salesByMonth[m].revenue }));
  res.json({ data });
});


