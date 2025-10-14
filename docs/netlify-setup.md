# Netlify Deployment Guide

## 🚀 Automated Deployment Setup

This guide will help you connect your GitHub repository to Netlify for automatic deployment.

## 📋 Prerequisites

✅ GitHub repository created: `Marc-Reynolds/CraftyFoxWeb`  
✅ Netlify configuration file: `netlify.toml` (included)  
✅ Project ready for deployment  

## 🔗 Step-by-Step Setup

### 1. Create Netlify Account
1. Visit [netlify.com](https://netlify.com)
2. Click "Sign up" 
3. Choose "Sign up with GitHub" for seamless integration
4. Authorize Netlify to access your GitHub repositories

### 2. Connect Your Repository
1. From Netlify dashboard, click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Select your repository: **`Marc-Reynolds/CraftyFoxWeb`**
4. Configure build settings:
   - **Branch to deploy:** `001-build-a-landing` (or `main` when ready)
   - **Build command:** `echo 'Static site - no build required'`
   - **Publish directory:** `.` (root directory)
5. Click **"Deploy site"**

### 3. Configure Site Settings
1. **Site name:** Change from random name to `craftyfox-publishing` (or preferred name)
2. **Domain:** Will be `craftyfox-publishing.netlify.app` (can add custom domain later)
3. **Branch settings:** 
   - Production branch: `main` (when ready to switch from development)
   - Deploy previews: Enable for pull requests

### 4. Environment Variables (for forms)
1. Go to **Site settings** → **Environment variables**
2. Add variables if using additional form services:
   ```
   FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
   ```
3. These will be available when you implement the contact forms

### 5. Form Handling Setup
Two options for form handling:

#### Option A: Netlify Forms (Recommended for simplicity)
- Already configured in `netlify.toml`
- No additional setup needed
- Forms automatically detected in HTML

#### Option B: Formspree (As planned in specification)
- Sign up at [formspree.io](https://formspree.io)
- Create contact form endpoint
- Add newsletter form endpoint
- Update environment variables

## 🔧 Deployment Configuration

Your `netlify.toml` file includes:

- **Security headers** for protection
- **Performance optimization** with caching
- **Form handling** configuration
- **Redirect rules** for clean URLs
- **Branch-specific settings** for different environments

## 📱 Deployment Workflow

Once connected, your deployment workflow will be:

1. **Push to GitHub** → Automatic deployment triggered
2. **Pull Request** → Deploy preview created automatically
3. **Merge to main** → Production site updated
4. **Build logs** → Available in Netlify dashboard

## 🌐 Custom Domain (Optional)

To add your own domain later:
1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow DNS configuration instructions
4. SSL certificate will be automatically provisioned

## 📊 Monitoring & Analytics

Netlify provides:
- **Build logs** for troubleshooting
- **Deploy history** with rollback options
- **Form submissions** tracking
- **Performance insights** and Core Web Vitals
- **Analytics** (premium feature)

## 🚨 Important Notes

- First deployment may take 2-3 minutes
- Deploy previews created for all pull requests
- Form submissions will appear in Netlify dashboard
- Free tier includes 100GB bandwidth/month
- Automatic HTTPS with Let's Encrypt certificates

## 🔄 Next Steps After Setup

1. **Test deployment** by pushing a small change
2. **Configure form endpoints** when implementing contact forms
3. **Set up custom domain** if desired
4. **Enable deploy notifications** (Slack, email, etc.)
5. **Monitor site performance** through Netlify dashboard

---

*This configuration supports your SpecKit development workflow with automatic deployments and branch-based environments.*