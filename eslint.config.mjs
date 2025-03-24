import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  stylistic: {
    overrides: {
      'style/jsx-self-closing-comp': 'error',
    },
  },
  rules: {
    '@typescript-eslint/ban-ts-comment': ['error', {
      'ts-expect-error': 'allow-with-description',
      'ts-ignore': 'allow-with-description',
    }],
  },
})
