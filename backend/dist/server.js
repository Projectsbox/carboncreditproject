"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("./routes/auth");
const projects_1 = require("./routes/projects");
const validations_1 = require("./routes/validations");
const transactions_1 = require("./routes/transactions");
const admin_1 = require("./routes/admin");
dotenv_1.default.config({ path: '../.env' });
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
app.use('/api/auth', auth_1.authRouter);
app.use('/api/projects', projects_1.projectsRouter);
app.use('/api/validations', validations_1.validationsRouter);
app.use('/api/transactions', transactions_1.transactionsRouter);
app.use('/api/admin', admin_1.adminRouter);
const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map