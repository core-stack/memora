# 🤝 Contributing to Snipet

Thank you for considering contributing to this project! This guide will help you understand how to contribute effectively and make the most impact.

## 🎯 How to Contribute

### 🐛 Reporting Bugs

If you found a bug in Snipet:

1. **Check if an issue already exists** about the problem
2. **Create a new issue** with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)

### ✨ Suggesting Improvements

To suggest new features or improvements:

1. **Clearly describe** the desired functionality
2. **Explain the problem** it solves
3. **Provide examples** of how it should work
4. **Consider implementing** it yourself if possible

### 📝 Improving Documentation

Documentation is always welcome! You can help with:

- Fixing typos and grammar errors
- Improving explanations and clarity
- Adding examples and use cases
- Translating to other languages

## 🛠️ Contribution Process

### 1. Fork the Repository

```bash
# Clone your fork
git clone https://github.com/core-stack/snipet.git
cd snipet

# Add the original repository as upstream
git remote add upstream https://github.com/core-stack/snipet.git
```

### 2. Create a Branch

```bash
# Create a branch for your contribution
git checkout -b feature/your-contribution-name
```

### 3. Make Your Changes

- **Keep consistency** with existing style
- **Test your changes** before submitting
- **Document** new features
- **Update CHANGELOG.md** if necessary

### 4. Commit and Push

```bash
# Add your changes
git add .

# Commit with descriptive message
git commit -m "feat: add new feature for Snipet"

# Push to your branch
git push origin feature/your-contribution-name
```

### 5. Open Pull Request

1. **Go to your fork** on GitHub
2. **Click "New Pull Request"**
3. **Fill out the template** provided
4. **Wait for review**

## 📋 Code Standards

### TypeScript / Node.js Standards

- **Follow ESLint and Prettier** configurations in the project
- **Write clear comments** for complex code
- **Use meaningful variable names**
- **Keep functions small, pure, and modular**

### Commit Messages

Use the [Conventional Commits](https://conventionalcommits.org/) standard:

```
feat: add new [FEATURE_TYPE] functionality
fix: resolve [ISSUE_TYPE] in [COMPONENT]
docs: update [DOCUMENTATION_SECTION]
style: improve [STYLING_ELEMENT] formatting
```

### Naming Conventions

- **Files**: `user-auth.ts`, `vector-search.service.ts`
- **Branches**: `feature/description`, `fix/description`, `docs/description`
- **Variables**: `camelCase` for JS/TS, `PascalCase` for classes

## 🧪 Testing Your Changes

Before submitting, test your changes:

1. **Run existing tests**: pnpm test
2. **Add new tests** for new features or bug fixes
3. **Verify build works**: pnpm build
4. **Check formatting**: pnpm lint
5. **Ensure functionality** across supported environments (Node 22+, web app)

## 📝 Types of Contributions

### 🆕 New Features

- Knowledge management improvements
- AI memory enhancements
- Plugin SDK extensions
- Performance optimizations

### 🔧 Bug Fixes

- Search index synchronization
- Plugin loading issues
- Memory retrieval errors
- Security vulnerabilities

### 📚 Documentation

- Usage guides and examples
- API reference updates
- Developer setup instructions
- Translations and localization

### 🎨 Design

- UI/UX improvements
- Accessibility enhancements
- Visual consistency
- Responsive design

## 🎯 Roadmap

### Upcoming Features

- [ ] Multi-tenant workspace support
- [ ] Plugin marketplace integration
- [ ] Offline/local-first sync mode
- [ ] Smart semantic search


### Priority Contributions

1. **Improve plugin SDK stability**
2. **Enhance AI memory performance**
3. **Add more developer documentation**
4. **Refine self-host setup experience**

## ❓ Questions?

If you have questions about contributing:

1. **Open an issue** with the `question` tag
2. **Check existing issues** for similar questions
3. **Contact maintainers** via [GitHub Discussions](https://github.com/core-stack/snipet/discussions)

## 🏆 Recognition

Contributors will be recognized:

- In the contributors section of README
- In the CHANGELOG.md file
- On the project website (when available)

## 📄 License

By contributing, you agree that your contributions will be licensed under the **Snipet License (based on Apache 2.0).**.

---

**Thank you for contributing to Snipet! 🎉**

Every contribution, no matter how small, makes a difference for the community.

## 💡 Pro Tips for Contributors

### 🎨 Development Tips

1. **Read the codebase** - understand modules like memory, search, and plugins.
2. **Start small** - Begin with documentation or small bug fixes
3. **Ask questions** - Don't hesitate to ask for clarification
4. **Test thoroughly** - Make sure your changes work as expected
5. **Follow conventions** - Maintain consistency with existing code

### 🔧 Technical Tips

1. **Use the development environment** - Set up local development properly
2. **Write tests** - Add tests for new functionality
3. **Check dependencies** - Ensure all dependencies are properly managed
4. **Review existing code** - Learn from existing implementations
5. **Document changes** - Explain complex changes clearly

### 📚 Documentation Tips

1. **Write clear descriptions** - Make your contributions easy to understand
2. **Include examples** - Show how to use new features
3. **Update related docs** - Keep all documentation in sync
4. **Use consistent formatting** - Follow the project's documentation style
5. **Be comprehensive** - Cover all aspects of your changes

---

**Ready to contribute?** Start by forking the repository and creating your first branch! 🚀
