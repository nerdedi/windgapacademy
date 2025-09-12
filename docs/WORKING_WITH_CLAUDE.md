# Working with Claude on Each Request

This guide provides practical tips for effectively working with Claude on each request, following the repository's attribution policy, and getting consistent, high-quality results.

## Basic Request Flow

For each request where you need Claude's assistance:

1. **Be specific and clear** about what you need
2. **Review the output** carefully before using it
3. **Add required attribution** to files containing Claude-generated code
4. **Run pre-commit checks** before committing

## Effective Prompting Techniques

To get the best results from Claude:

### 1. Provide Context

```
"I'm working on a React component that displays user achievements. The component should:
- Accept a userId prop
- Fetch achievements from our API
- Display them in a grid with animations
- Support filtering and sorting

Here's our existing API structure: [description]
Here's our design system requirements: [description]"
```

### 2. Use Step-by-Step Instructions

```
"Please help me create a function that:
1. Takes a user ID as input
2. Fetches data from our API
3. Transforms the response into the format our UI needs
4. Handles error cases
5. Returns the processed data"
```

### 3. Show Examples of Desired Output

```
"I need a utility function similar to this existing one:

function formatCurrency(value, locale = 'en-US', currency = 'USD') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

But for formatting dates with similar parameters and flexibility."
```

### 4. Iterative Refinement

Don't expect perfect results on the first try. Iteratively refine:

```
"That's a good start, but could you modify it to:
- Use async/await instead of promises
- Add TypeScript types
- Include JSDoc comments"
```

## Attribution Workflow

1. **Add the required comment** at the top of files containing Claude-generated code:
   ```javascript
   // Portions of this file were generated with the assistance of Anthropic Claude (https://www.anthropic.com/)
   ```

2. **For partial assistance**, add the comment near the relevant section:
   ```javascript
   // The following function was created with assistance from Anthropic Claude
   function complexAlgorithm() {
     // ...code...
   }
   ```

3. **Document review process** in your PR description:
   - Note which files contain Claude-generated code
   - Describe your review process
   - Mention any modifications you made to the generated code

## Pre-Commit Validation

Before committing Claude-assisted code:

1. **Run linters and formatters**:
   ```bash
   npx eslint --fix path/to/file.js
   ```

2. **Run tests** to ensure correctness:
   ```bash
   npm test
   ```

3. **Check for secrets** with detect-secrets:
   ```bash
   source .venv/bin/activate
   detect-secrets scan path/to/file.js
   ```

4. **Verify pre-commit hooks pass**:
   ```bash
   source .venv/bin/activate
   pre-commit run --files path/to/file.js
   ```

## Handling Sensitive Information

1. **Never share** credentials, keys, or sensitive information with Claude
2. **Use placeholders** in prompts:
   ```
   "Here's our API structure (with dummy keys):
   const apiKey = 'PLACEHOLDER_API_KEY';
   const endpoint = 'https://example-api.com/v1';"
   ```
3. **Review generated output** for accidental sensitive information before using

## Troubleshooting Common Issues

### Getting Irrelevant Output

If Claude produces irrelevant output:
- Break your request into smaller, more focused questions
- Provide more specific examples of what you want
- Explicitly state what you don't want

### Managing Context Limitations

If your request is complex:
- Break it into multiple separate interactions
- Focus each request on a single specific task
- Reference previous parts of the conversation clearly

### Handling Large Codebases

For help with large codebases:
- Provide relevant file snippets rather than entire files
- Describe the architecture and relationships between components
- Focus on specific functions or modules rather than entire systems

## Example Request-Response Cycle

**Request**:
```
I need to create a React hook that manages pagination state for our data tables.
It should handle:
- Page size (rows per page)
- Current page number
- Total items count
- Navigation between pages
- URL synchronization

Our existing components use Material UI's Table component.
```

**Response and Implementation**:
1. Review Claude's suggested hook implementation
2. Add the attribution comment
3. Integrate with your codebase, making necessary adjustments
4. Test functionality
5. Run pre-commit checks
6. Commit with a descriptive message mentioning Claude's assistance

---

Remember that Claude is a tool to assist you, not replace your judgment. Always review, understand, and take responsibility for code you commit, even when assisted by AI.