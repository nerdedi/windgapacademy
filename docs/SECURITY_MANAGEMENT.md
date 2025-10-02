# Security Management Guide for Windgap Academy

This guide explains the security management tools available in the repository and how to use them effectively.

## Available Security Scripts

### 1. FreeSpeech-Specific Script

```bash
./scripts/update-freespeech-security.sh
```

**Purpose**: This script is designed specifically to address the 8 identified vulnerabilities in the FreeSpeech submodule.

**When to use it**: Use this script when you need to focus only on FreeSpeech security updates and want a targeted approach.

**Features**:

- Creates a backup branch before making changes
- Makes targeted dependency updates for FreeSpeech only
- Provides fallback procedures if updates fail
- Minimizes breaking changes risk

### 2. Comprehensive Security Audit Script

```bash
./scripts/comprehensive-security-audit.sh
```

**Purpose**: This script performs a security audit across all projects in the Windgap Academy workspace.

**When to use it**: Use this script for regular security audits of the entire codebase, or when you need to check all projects at once.

**Features**:

- Audits multiple projects: Windgap Academy, FreeSpeech, Backend, MCP Server
- Creates a dedicated branch for security updates
- Applies non-breaking fixes automatically
- Saves detailed audit reports for review
- Tests projects after applying fixes
- Simplifies creating pull requests for security updates

## Best Practices for Security Management

1. **Regular Audits**: Schedule regular security audits using the comprehensive script.
2. **Before Deployments**: Run security checks before major deployments.
3. **After Adding Dependencies**: Run checks after adding new dependencies.
4. **Review Audit Reports**: Always review the generated audit reports to understand security issues.
5. **Test After Fixes**: Thoroughly test the application after applying security fixes.
6. **Update Dependabot Configuration**: When adding new submodules or package directories, update the `.github/dependabot.yml` file.

## Handling Breaking Changes

If security updates require breaking changes:

1. Create a separate feature branch
2. Apply the updates manually
3. Update corresponding code to accommodate API changes
4. Write comprehensive tests
5. Document the changes in the PR description

## Security Documentation

Keep the `SECURITY_UPDATES.md` file updated with information about:

- Known vulnerabilities
- Mitigation strategies
- Implementation plans
- Security update history

## Additional Resources

- [npm audit documentation](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [GitHub security features](https://docs.github.com/en/code-security)
- [Dependabot configuration](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
