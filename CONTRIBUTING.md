# Contributing to Prodify

Thank you for your interest in contributing to Prodify! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/prodify.git`
3. Install dependencies: `npm install`
4. Create a new branch: `git checkout -b feature/your-feature-name`
5. Make your changes
6. Test your changes: `npm run build`
7. Commit your changes: `git commit -m "Add your feature"`
8. Push to your fork: `git push origin feature/your-feature-name`
9. Open a Pull Request

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code style and conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Component Guidelines

- Create reusable components when possible
- Use functional components with hooks
- Keep components focused on a single responsibility
- Use TypeScript interfaces for props

### State Management

- Use Zustand for global state
- Keep local state in components when appropriate
- Avoid unnecessary re-renders

### Styling

- Use Tailwind CSS utility classes
- Support both light and dark modes
- Ensure responsive design
- Follow the existing design patterns

### Database/Storage

- All database operations go through service layers
- Maintain backward compatibility with existing data
- Test data migrations carefully

## Testing

Currently, Prodify doesn't have automated tests. We welcome contributions to add:
- Unit tests (Jest, Vitest)
- Integration tests
- E2E tests (Playwright, Cypress)

## Feature Requests

- Open an issue describing the feature
- Explain the use case and benefits
- Wait for feedback before starting implementation

## Bug Reports

When reporting bugs, please include:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser and version
- Screenshots if applicable

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the documentation for any new features
3. The PR will be merged once it has been reviewed and approved
4. Ensure your code builds without errors: `npm run build`
5. Follow the existing code style

## Areas for Contribution

### High Priority
- PWA support and service worker
- Data migration system
- Keyboard shortcuts implementation
- Accessibility improvements
- Performance optimizations

### Features
- Pomodoro timer
- Smart notifications
- CSV/PDF export
- File attachments for notes
- Advanced search
- Task dependencies
- Recurring tasks
- Tags for tasks
- Task templates

### UI/UX
- Additional themes
- Custom color schemes
- Animation improvements
- Mobile responsiveness
- Touch gestures

### Technical
- Unit tests
- E2E tests
- Code documentation
- Performance monitoring
- Error handling improvements

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

## Questions?

Feel free to open an issue for any questions about contributing to Prodify.

## License

By contributing to Prodify, you agree that your contributions will be licensed under the MIT License.
