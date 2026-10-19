# Crafty Fox Publishing - Landing Page

A one-page site for Marc Reynolds’s Crafty Fox Publishing business, focused on
book outline development, with formatting and KDP support as secondary services.

## 🎯 Project Overview

This website serves as the digital presence for Crafty Fox Publishing, featuring:

- **Services**: Book outline development, formatting and KDP support
- **How it works**: Share the idea, agree the scope, develop the outline together
- **Published work**: Marc’s own books and personal web projects
- **Contact**: Existing Facebook route; the online form stays unavailable until a destination is verified

## 🚀 Features

- ✅ Responsive design (mobile-first approach)
- Keyboard navigation, visible focus and book/service detail popups
- Contact validation and safeguards against unconfigured submissions
- Local desktop/mobile browser regression coverage; see the review for its limits

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript ES6+
- **Styling**: CSS Grid, Flexbox, CSS Custom Properties
- **Forms**: Formspree integration
- **Hosting**: Netlify/Vercel (static hosting)
- **Version Control**: Git & GitHub

## 📁 Project Structure

```
CraftyFoxWeb/
├── index.html              # Main landing page
├── src/
│   ├── css/
│   │   ├── styles.css      # Main stylesheet
│   │   ├── reset.css       # CSS reset/normalize
│   │   └── components/     # Component-specific styles
│   ├── js/
│   │   ├── main.js         # Main JavaScript file
│   │   └── components/     # JavaScript components
│   └── images/             # Optimized images
├── specs/                  # Project specifications
│   └── 001-build-a-landing/
│       ├── spec.md         # Feature specification
│       ├── plan.md         # Technical plan
│       ├── tasks.md        # Implementation tasks
│       └── ...             # Other planning documents
└── README.md              # This file
```

## 🎨 Design Principles

Following SpecKit constitutional principles:

1. **Specification-First Development**: All features documented before implementation
2. **User Story Independence**: Each feature can be developed and deployed separately
3. **Constitutional Authority**: All decisions align with project constitution
4. **Quality Gates**: Code quality and accessibility standards enforced
5. **Continuous Integration**: Automated testing and deployment

## 📋 Development Tasks

The project is organized into 15 detailed tasks across 5 phases:

1. **Foundation Setup** (Day 1): Project structure, HTML foundation, CSS architecture
2. **Content Implementation** (Days 2-3): Header, hero section, books showcase, services
3. **Interactive Features** (Day 4): Contact form, newsletter, social media integration
4. **Enhancement & Polish** (Day 5): JavaScript enhancements, performance, accessibility
5. **Deployment** (Day 6): Testing and hosting setup

See `specs/001-build-a-landing/tasks.md` for detailed task breakdown.

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/[username]/CraftyFoxWeb.git
   cd CraftyFoxWeb
   ```

2. **Install dependencies** (if using build tools):
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   # Using Live Server or similar
   npx live-server
   ```

4. **Open in browser**:
   Navigate to `http://localhost:8080` (or the port shown in terminal)

## 📖 Development Workflow

For screenshots, regression test results and outstanding owner configuration,
see [the homepage refresh review](docs/HOMEPAGE_REFRESH.md).

1. **Planning**: All features start with specification in `specs/` directory
2. **Implementation**: Follow task-driven development from `tasks.md`
3. **Testing**: Cross-browser testing and accessibility validation
4. **Deployment**: Automated deployment via GitHub integration

## 🔗 Links & Resources

- **Live Site**: [To be deployed]
- **Facebook**: [Crafty Fox Publishing Facebook Page]
- **Amazon**: [Author/Publisher Page]
- **Goodreads**: [Crafty Fox Publishing Profile]

## 📞 Contact

For inquiries about services or collaboration, please use the contact form on the website or reach out through our social media channels.

## 📄 License

© 2025 Crafty Fox Publishing. All rights reserved.

---

*Built with ❤️ using SpecKit framework and constitutional development principles.*
