module.exports = {
  packagerConfig: {
    icon: 'assets/icon.ico',
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-wix',
      config: {
        ui: {
          chooseDirectory: true,
        },
      },
    },
    // {
    //   name: '@electron-forge/maker-squirrel',
    //   config: {
    //     authors: 'boston-terrier-kirin',
    //     description: 'An example Electron app',
    //   },
    // },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};
