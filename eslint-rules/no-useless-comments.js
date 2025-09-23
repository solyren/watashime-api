/**
 * Custom ESLint Rule: no-useless-comments
 * Hapus semua komentar `// ...` kecuali yang mengandung `--`
 *
 * @type {import('eslint').Rule.RuleModule}
 */
const noUselessComments = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Hapus komentar ga guna (kecuali yang ada --)',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
  },
  create(context) {
    return {
      Program() {
        const sourceCode = context.getSourceCode();
        const comments = sourceCode.getAllComments();

        comments.forEach((comment) => {
          if (comment.type === 'Line' && !comment.value.includes('--')) {
            context.report({
              loc: comment.loc,
              message: 'Komentar tidak berguna ditemukan.',
              fix(fixer) {
                return fixer.removeRange(comment.range);
              },
            });
          }
        });
      },
    };
  },
};

export default noUselessComments;
