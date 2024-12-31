module.exports = (path, options) => {
    // 在这里处理 @ 别名
    if (path.startsWith('@/')) {
      return options.defaultResolver(path.replace('@/', '<rootDir>/src/'), options);
    }
    return options.defaultResolver(path, options);
  };