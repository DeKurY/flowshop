import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let sessionId = req.cookies?.['session_id'];

    if (!sessionId) {
      sessionId = uuidv4();
      
      // We also update req.cookies so standard @Req() sees it immediately
      if (!req.cookies) {
        req.cookies = {};
      }
      req.cookies['session_id'] = sessionId;
    }

    // Refresh cookie expiration on every request (rolling session strategy)
    // Expiration: 30 days
    res.cookie('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in prod
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    next();
  }
}
