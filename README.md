# Cloud VM Dashboard

A web-based dashboard for monitoring and managing virtual machines across multiple cloud platforms (OpenStack, AWS, GCP).

## Features

- Monitor VMs across different cloud providers in a single interface
- View detailed resource utilization metrics (CPU, memory)
- Perform key management actions (start, stop, restart)
- Filter instances by provider, status, or search terms
- Responsive design supporting desktop and mobile views

## Technology Stack

- **Frontend**: React with TypeScript, TailwindCSS, Shadcn UI components
- **Backend**: Node.js, Express
- **Data Storage**: In-memory storage (can be extended to use databases)
- **State Management**: React Query

## Deployment on Render

### Automatic Deployment

1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Select the "render.yaml" configuration
4. Deploy

### Manual Deployment

1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Configure the following settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV`: `production`
4. Click "Create Web Service"

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at http://localhost:5000.