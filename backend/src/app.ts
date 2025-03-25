import express, { Router, Request, Response } from 'express';
import { IRoute } from 'express-serve-static-core';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import bookRoutes from './routes/book.routes';

interface ExtendedRoute extends IRoute<any> {
  methods: { [key: string]: boolean };
}

interface ILayer {
  route?: ExtendedRoute;
  name?: string;
  handle: any;
  regexp: RegExp;
}

interface RouteInfo {
  path: string;
  methods: string[];
}

const app = express();
const port = parseInt(process.env.PORT || '5000', 10);

// Debug middleware - MUST be first
app.use((req: Request, res: Response, next) => {
  console.log(`[DEBUG] ${req.method} ${req.url}`);
  next();
});

// Essential middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    routes: app._router.stack
      .filter((r: any) => r.route)
      .map((r: any) => ({
        path: r.route.path,
        method: Object.keys(r.route.methods)[0].toUpperCase()
      }))
  });
});

// Register auth routes
console.log('Registering auth routes...');
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Mount routes with /api prefix
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);

// Add test route to verify server is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Route debugging endpoint
app.get('/debug', (req: Request, res: Response) => {
  const routes: RouteInfo[] = [];
  
  (app._router.stack as ILayer[]).forEach((middleware: ILayer) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      (middleware.handle.stack as ILayer[]).forEach((handler: ILayer) => {
        if (handler.route) {
          routes.push({
            path: `${middleware.regexp}${handler.route.path}`,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  
  res.json(routes);
});

mongoose.connect('mongodb://mongo:27017/library')
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`);
      console.log('Available routes:');
      app._router.stack
        .filter((r: any) => r.route)
        .forEach((r: any) => {
          console.log(`Route: ${Object.keys(r.route.methods)[0].toUpperCase()} ${r.route.path}`);
        });
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

export default app;