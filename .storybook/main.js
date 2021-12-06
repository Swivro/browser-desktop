module.exports = {
  stories: [
    '../src/renderer/**/**/*.stories.mdx',
    '../src/renderer/**/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: '@storybook/react',
};
