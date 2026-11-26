import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NodeRequest, NodeResponse } from '@nestjs/platform-node';
import { NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: NodeRequest, res: NodeResponse, next: NextFunction) {
    const start = Date.now();
    const { method, originalUrl } = req;

    res.on('finish', () => {
      const duration = Date.now() - start;
      const status = res.statusCode;
      const message = `${method} ${originalUrl} ${status} - ${duration}ms`;

      if (status >= 400) {
        this.logger.error(message);
      } else {
        this.logger.log(message);
      }
    });

    next();
  }
}
