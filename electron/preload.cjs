const {
  contextBridge,
  ipcRenderer
} = require('electron');

contextBridge.exposeInMainWorld(
  'desktopAPI',
  {
    showNotification:
      payload =>
        ipcRenderer.invoke(
          'show-notification',
          payload
        ),

    minimizeWindow:
      () =>
        ipcRenderer.invoke(
          'window-minimize'
        ),

    hideWindow:
      () =>
        ipcRenderer.invoke(
          'window-hide'
        ),

    quitApp:
      () =>
        ipcRenderer.invoke(
          'window-quit'
        ),

    toggleMaximize:
      () =>
        ipcRenderer.invoke(
          'window-toggle-maximize'
        ),

    setCloseBehavior:
      value =>
        ipcRenderer.invoke(
          'set-close-behavior',
          value
        ),

    printHtml:
      html =>
        ipcRenderer.invoke(
          'print-html',
          html
        ),

    checkForUpdates:
      () =>
        ipcRenderer.invoke(
          'update-check'
        ),

    downloadUpdate:
      () =>
        ipcRenderer.invoke(
          'update-download'
        ),

    showDownloadedUpdate:
      () =>
        ipcRenderer.invoke(
          'update-show-file'
        ),

    onUpdateProgress:
      callback => {
        const listener =
          (
            _event,
            value
          ) =>
            callback(
              value
            );

        ipcRenderer.on(
          'update-progress',
          listener
        );

        return () =>
          ipcRenderer.removeListener(
            'update-progress',
            listener
          );
      },

    onUpdateAvailable:
      callback => {
        const listener =
          (
            _event,
            value
          ) =>
            callback(
              value
            );

        ipcRenderer.on(
          'update-available',
          listener
        );

        return () =>
          ipcRenderer.removeListener(
            'update-available',
            listener
          );
      }
  }
);
