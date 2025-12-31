# Deployment Guide

## Deploying Prodify

Prodify is a static web application that can be deployed to any static hosting service. Here are the most popular options:

### 1. Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Or use the Vercel dashboard:
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will automatically detect it's a Vite project
4. Click Deploy

### 2. Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

Or use the Netlify dashboard:
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `dist` folder
3. Or connect your GitHub repository

### 3. GitHub Pages

1. Build the project:
```bash
npm run build
```

2. Push the `dist` folder to the `gh-pages` branch:
```bash
git subtree push --prefix dist origin gh-pages
```

3. Enable GitHub Pages in your repository settings

### 4. Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

### 5. Self-Hosting

#### Using Node.js with serve

```bash
# Install serve
npm install -g serve

# Build the project
npm run build

# Serve on port 3000
serve -s dist -p 3000
```

#### Using Nginx

1. Build the project:
```bash
npm run build
```

2. Copy the `dist` folder to your web server:
```bash
scp -r dist/* user@server:/var/www/prodify/
```

3. Configure Nginx:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/prodify;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Using Apache

1. Build and copy files as above

2. Create a `.htaccess` file in your web root:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 6. Docker

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t prodify .
docker run -p 80:80 prodify
```

## PWA Deployment (Optional)

To make Prodify installable as a Progressive Web App, you can add a service worker and manifest file. This will allow users to install it on their devices and use it offline.

## Environment Variables

Prodify doesn't require any environment variables as it uses browser localStorage for data storage.

## Custom Domain

After deploying to any platform, you can configure a custom domain in the platform's settings.

## SSL/HTTPS

Most modern hosting platforms automatically provide SSL certificates. For self-hosting, consider using Let's Encrypt.

## Storage Considerations

- All user data is stored in browser localStorage
- localStorage limit is typically 5-10MB per domain
- Users should regularly export their data as backup
- Consider implementing IndexedDB for larger data storage needs in the future

## Performance Optimization

The production build is already optimized with:
- Code splitting
- Minification
- Tree shaking
- Asset optimization

For additional performance:
- Enable gzip compression on your server
- Configure CDN caching headers
- Use HTTP/2 or HTTP/3

## Monitoring

Since Prodify doesn't have a backend, traditional server monitoring isn't needed. However, you can add:
- Client-side error tracking (e.g., Sentry)
- Analytics (e.g., Google Analytics, Plausible)
- Uptime monitoring for your hosting platform
