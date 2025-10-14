# Quickstart Guide: Crafty Fox Publishing Landing Page

**Purpose**: Step-by-step guide for setting up, testing, and deploying the landing page  
**Prerequisites**: Basic HTML/CSS/JavaScript knowledge, Git, modern web browser

## Quick Setup (5 minutes)

### 1. Project Structure Setup
```bash
# Create project directory
mkdir crafty-fox-landing
cd crafty-fox-landing

# Initialize Git repository
git init

# Create basic structure
mkdir -p assets/{css,js,images/{books,icons,logo},fonts}
mkdir docs
touch index.html .gitignore
```

### 2. Essential Files Creation
```bash
# Create main files
touch assets/css/{main.css,responsive.css,forms.css}
touch assets/js/{main.js,validation.js,books.js}
touch assets/js/{books-data.js,services-data.js,social-data.js}
touch docs/README.md
```

### 3. Basic HTML Structure (index.html)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crafty Fox Publishing - Professional Publishing Services</title>
    <meta name="description" content="Crafty Fox Publishing offers ghost writing, editing, publishing, marketing, and ARC review services for authors.">
    
    <!-- CSS -->
    <link rel="stylesheet" href="assets/css/main.css">
    <link rel="stylesheet" href="assets/css/responsive.css">
    <link rel="stylesheet" href="assets/css/forms.css">
</head>
<body>
    <!-- Navigation -->
    <nav><!-- Navigation content --></nav>
    
    <!-- Hero Section -->
    <section id="hero"><!-- Hero content --></section>
    
    <!-- Featured Books (P1 - MVP) -->
    <section id="books"><!-- Book showcase --></section>
    
    <!-- Services (P2) -->
    <section id="services"><!-- Service descriptions --></section>
    
    <!-- Contact & Newsletter (P3) -->
    <section id="contact"><!-- Forms --></section>
    
    <!-- Social Media (P4) -->
    <footer id="social"><!-- Social links --></footer>
    
    <!-- JavaScript -->
    <script src="assets/js/main.js"></script>
    <script src="assets/js/validation.js"></script>
    <script src="assets/js/books.js"></script>
</body>
</html>
```

## Development Workflow

### Phase 1: MVP - Featured Books (Priority P1)
**Goal**: Get book showcase working first

1. **Setup Books Data**
```javascript
// assets/js/books-data.js
const booksData = [
  {
    title: "Sample Book Title",
    author: "Author Name", 
    description: "Brief compelling description of the book...",
    coverImage: "assets/images/books/sample-book.jpg",
    amazonLink: "https://amazon.com/...",
    goodreadsLink: "https://goodreads.com/...",
    displayOrder: 1
  }
  // Add 3-6 books total
];
```

2. **Create Book Display Logic**
```javascript
// assets/js/books.js  
function displayBooks() {
  const container = document.getElementById('books-container');
  booksData.forEach(book => {
    const bookElement = createBookElement(book);
    container.appendChild(bookElement);
  });
}
```

3. **Test MVP**
- Books display properly on desktop
- Book links open in new tabs
- Images load correctly
- Mobile responsive design works

### Phase 2: Services Section (Priority P2)
1. Setup services data structure
2. Create service cards layout
3. Add service descriptions and benefits
4. Test responsive design

### Phase 3: Forms (Priority P3)
1. **Setup Formspree Account**
   - Create account at formspree.io
   - Create contact form endpoint
   - Create newsletter form endpoint
   - Note form IDs for configuration

2. **Implement Contact Form**
```javascript
// Update form action in HTML
<form id="contact-form" action="https://formspree.io/f/{YOUR-FORM-ID}" method="POST">
```

3. **Add Form Validation**
```javascript  
// assets/js/validation.js
function validateContactForm(formData) {
  const errors = [];
  
  if (!formData.name || formData.name.length < 2) {
    errors.push({field: 'name', message: 'Name must be at least 2 characters'});
  }
  
  if (!isValidEmail(formData.email)) {
    errors.push({field: 'email', message: 'Please enter a valid email'});
  }
  
  return errors;
}
```

4. **Test Form Functionality**
   - Submit valid form data
   - Test validation with invalid data
   - Verify email delivery
   - Check error handling

### Phase 4: Social Integration (Priority P4)
1. Add social media links
2. Test external link functionality  
3. Verify links open in new tabs
4. Check social icons display

## Testing Checklist

### Functionality Tests
- [ ] Books display with covers, titles, authors, descriptions
- [ ] Book links open Amazon/Goodreads pages in new tabs
- [ ] Contact form submits successfully with valid data
- [ ] Contact form shows errors for invalid data
- [ ] Newsletter signup works with valid email
- [ ] Newsletter signup validates email format
- [ ] Social media links open correct profiles
- [ ] All external links open in new tabs

### Responsive Design Tests
- [ ] Page displays properly on 320px width (mobile)
- [ ] Page displays properly on 768px width (tablet)
- [ ] Page displays properly on 1920px width (desktop)
- [ ] Images scale appropriately on all screen sizes
- [ ] Forms are usable on mobile devices
- [ ] Text remains readable at all screen sizes

### Performance Tests
- [ ] Page loads in under 3 seconds
- [ ] Images are optimized (WebP with JPEG fallback)
- [ ] CSS and JavaScript files are minified for production
- [ ] Forms respond within 1 second of submission

### Accessibility Tests
- [ ] All images have appropriate alt text
- [ ] Page structure uses semantic HTML
- [ ] Color contrast meets WCAG 2.1 AA standards
- [ ] Forms are keyboard navigable
- [ ] Screen reader compatibility verified

## Deployment Options

### Option 1: Netlify (Recommended)
1. Connect GitHub repository to Netlify
2. Configure build settings (if using build tools)
3. Setup form handling in Netlify dashboard
4. Configure custom domain (optional)
5. Enable HTTPS and CDN

### Option 2: Vercel
1. Import GitHub repository to Vercel
2. Configure build settings
3. Deploy with automatic SSL
4. Setup custom domain (optional)

### Option 3: GitHub Pages
1. Enable GitHub Pages in repository settings  
2. Set source to main branch
3. Access via username.github.io/repository-name
4. Custom domain setup (optional)

## Production Checklist

### Pre-Launch
- [ ] All placeholder content replaced with real content
- [ ] Book covers and images optimized
- [ ] Form endpoints configured and tested
- [ ] Social media links verified
- [ ] Contact information updated
- [ ] SEO meta tags completed
- [ ] Google Analytics configured (optional)
- [ ] Privacy policy and terms added (if required)

### Post-Launch
- [ ] Test all functionality on live site
- [ ] Monitor form submissions
- [ ] Check page performance metrics
- [ ] Verify search engine indexing
- [ ] Monitor error logs
- [ ] Setup regular content updates

## Troubleshooting

### Common Issues
- **Forms not working**: Check Formspree configuration and form IDs
- **Images not loading**: Verify file paths and image optimization
- **Mobile layout issues**: Check responsive CSS media queries
- **JavaScript errors**: Check browser console for error messages
- **Slow loading**: Optimize images and minify CSS/JS files

### Performance Optimization
- Compress images to WebP format with JPEG fallbacks
- Minify CSS and JavaScript files
- Enable GZIP compression on hosting platform
- Use CDN for static assets
- Implement lazy loading for below-fold content