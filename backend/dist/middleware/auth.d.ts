import { Request, Response, NextFunction } from 'express';
export type JwtUser = {
    id: string;
    role: 'CREATOR' | 'VALIDATOR' | 'BUYER' | 'ADMIN';
    email: string;
};
declare global {
    namespace Express {
        interface Request {
            user?: JwtUser;
        }
    }
}
export declare function authenticateJwt(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export declare function requireRoles(roles: JwtUser['role'][]): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map