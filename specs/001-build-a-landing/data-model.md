# Data Model: Crafty Fox Publishing Landing Page

**Created**: 2025-10-14  
**Purpose**: Define data structures and content management approach

## Content Entities

### Book Entity
**Purpose**: Represents featured books in the showcase section

**Attributes**:
- `title`: String - Book title (required)
- `author`: String - Author name (required) 
- `description`: String - Brief description (100-200 characters)
- `coverImage`: String - Path to book cover image (required)
- `amazonLink`: String - Amazon product page URL (optional)
- `goodreadsLink`: String - Goodreads book page URL (optional)
- `displayOrder`: Number - Sort order in showcase (required)

**Validation Rules**:
- Title: 1-100 characters, no HTML
- Author: 1-50 characters, no HTML
- Description: 50-200 characters for consistent display
- Cover image: JPG/PNG, min 300x400px, max 2MB
- Links: Valid HTTPS URLs when provided

**Storage**: JSON data structure in JavaScript file for easy management

### Service Entity  
**Purpose**: Represents professional services offered

**Attributes**:
- `name`: String - Service name (required)
- `shortDescription`: String - Brief summary for cards (required)
- `fullDescription`: String - Detailed service information (required)
- `keyBenefits`: Array[String] - List of 3-5 main benefits
- `icon`: String - Path to service icon image
- `displayOrder`: Number - Sort order on page

**Validation Rules**:
- Name: 1-30 characters (fits in cards)
- Short description: 50-100 characters
- Full description: 200-500 characters
- Benefits: 3-5 items, 10-50 characters each

**Services**:
1. Ghost Writing
2. Editing
3. Publishing
4. Marketing  
5. ARC Review Team

### Contact Form Submission
**Purpose**: Structure for contact form data

**Attributes**:
- `name`: String - Full name (required)
- `email`: String - Valid email address (required)
- `subject`: String - Inquiry subject (required)
- `message`: String - Detailed message (required)
- `timestamp`: DateTime - Submission time (auto-generated)
- `source`: String - Always "landing-page"

**Validation Rules**:
- Name: 2-50 characters, letters and spaces only
- Email: Valid email format, max 254 characters
- Subject: 5-100 characters
- Message: 20-2000 characters

### Newsletter Subscription
**Purpose**: Structure for newsletter signup data

**Attributes**:
- `email`: String - Valid email address (required)
- `timestamp`: DateTime - Subscription time (auto-generated)
- `source`: String - Always "landing-page"
- `confirmed`: Boolean - Email confirmation status

**Validation Rules**:
- Email: Valid email format, max 254 characters
- No duplicate subscriptions (handled by service)

### Social Media Link
**Purpose**: External social media profile links

**Attributes**:
- `platform`: String - Social platform name (required)
- `url`: String - Profile URL (required)  
- `icon`: String - Path to platform icon (required)
- `displayText`: String - Link display text (required)

**Current Links**:
- Facebook: Crafty Fox Publishing page
- Amazon: Author/publisher profile  
- Goodreads: Publisher profile

## Data Management Strategy

### Content Updates
**Approach**: Direct file editing for simplicity
- Books data: `assets/js/books-data.js`
- Services data: `assets/js/services-data.js`  
- Social links: `assets/js/social-data.js`

**Benefits**:
- No database setup required
- Version controlled content changes
- Fast loading (no API calls)
- Easy backup and deployment

### Form Data Processing
**Approach**: Third-party service integration
- Contact forms → Email forwarding service
- Newsletter → Email marketing service integration
- No local storage or database required for MVP

## Content Management Workflow

### Adding New Books
1. Prepare optimized cover image (WebP + JPEG fallback)
2. Add image files to `assets/images/books/`
3. Update `books-data.js` with new book entry
4. Test display and links
5. Commit changes to Git repository

### Updating Services
1. Edit service content in `services-data.js`
2. Update any associated images/icons
3. Test layout and responsive design
4. Commit changes

### Deployment Process
1. Content changes pushed to Git repository
2. Automatic deployment via hosting platform
3. Validation of live site functionality
4. Monitor form submissions and performance