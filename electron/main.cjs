const {
  app,
  BrowserWindow,
  ipcMain,
  Notification,
  Tray,
  Menu,
  shell
} = require('electron');

const path = require('path');
const fs = require('fs');
const https = require('https');
const crypto = require('crypto');

const updateConfig =
  require('./update-config.cjs');

const isDev = !app.isPackaged;

let mainWindow = null;
let tray = null;
let isQuitting = false;
let closeBehavior = 'tray';
let backgroundNoticeShown = false;

const iconPath =
  path.join(
    __dirname,
    '..',
    'build',
    'icon.ico'
  );

if (
  process.platform ===
  'win32'
) {
  app.setAppUserModelId(
    'com.gptdualcalendar.app'
  );
}

/*
 * ============================================
 * Single Instance
 * ============================================
 *
 * لو التطبيق شغال بالفعل، تشغيل نفس النسخة
 * مرة ثانية لا ينشئ نافذة/عملية مستقلة.
 * بدل ذلك نعيد إظهار النسخة الحالية.
 */
const gotSingleInstanceLock =
  app.requestSingleInstanceLock();

if (
  !gotSingleInstanceLock
) {
  app.quit();
} else {
  app.on(
    'second-instance',
    () => {
      if (
        !mainWindow
      ) {
        return;
      }

      if (
        mainWindow.isMinimized()
      ) {
        mainWindow.restore();
      }

      if (
        !mainWindow.isVisible()
      ) {
        mainWindow.show();
      }

      mainWindow.focus();
    }
  );
}

function showBackgroundNotice() {
  if (
    backgroundNoticeShown ||
    !Notification.isSupported()
  ) {
    return;
  }

  backgroundNoticeShown = true;

  const notice =
    new Notification({
      title:
        'GPT Dual Calendar',
      body:
        'التطبيق ما زال يعمل في الخلفية، وستصلك التذكيرات في مواعيدها. يمكنك فتحه من أيقونة شريط النظام.',
      icon:
        iconPath,
      silent:
        true
    });

  notice.on(
    'click',
    () => {
      if (
        !mainWindow
      ) {
        return;
      }

      if (
        mainWindow.isMinimized()
      ) {
        mainWindow.restore();
      }

      mainWindow.show();
      mainWindow.focus();
    }
  );

  notice.show();
}

function hideToTray() {
  if (
    !mainWindow
  ) {
    return;
  }

  mainWindow.hide();
  showBackgroundNotice();
}

function createWindow() {
  mainWindow =
    new BrowserWindow({
      width: 1542,
      height: 674,
      minWidth: 1542,
      minHeight: 674,
      show: false,
      frame: false,
      backgroundColor:
        '#f4efe6',
      icon:
        iconPath,
      webPreferences: {
        preload:
          path.join(
            __dirname,
            'preload.cjs'
          ),
        contextIsolation:
          true,
        nodeIntegration:
          false
      }
    });

  if (isDev) {
    mainWindow.loadURL(
      'http://localhost:5173'
    );
  } else {
    mainWindow.loadFile(
      path.join(
        __dirname,
        '..',
        'dist',
        'index.html'
      )
    );
  }

  mainWindow.once(
    'ready-to-show',
    () => {
      mainWindow.show();
    }
  );

  mainWindow.on(
    'close',
    event => {
      if (
        isQuitting
      ) {
        return;
      }

      if (
        closeBehavior ===
        'exit'
      ) {
        isQuitting = true;
        app.quit();
        return;
      }

      event.preventDefault();
      hideToTray();
    }
  );

  mainWindow.on(
    'closed',
    () => {
      mainWindow = null;
    }
  );
}

function showMainWindow() {
  if (
    !mainWindow
  ) {
    createWindow();
    return;
  }

  if (
    mainWindow.isMinimized()
  ) {
    mainWindow.restore();
  }

  mainWindow.show();
  mainWindow.focus();
}

function createTray() {
  if (tray) {
    return;
  }

  tray =
    new Tray(
      iconPath
    );

  tray.setToolTip(
    'GPT Dual Calendar'
  );

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label:
          'فتح التقويم',
        click:
          showMainWindow
      },
      {
        type:
          'separator'
      },
      {
        label:
          'خروج نهائي',
        click: () => {
          isQuitting = true;
          app.quit();
        }
      }
    ])
  );

  tray.on(
    'click',
    showMainWindow
  );

  tray.on(
    'double-click',
    showMainWindow
  );
}

ipcMain.handle(
  'window-minimize',
  () => {
    mainWindow?.minimize();
    return true;
  }
);

ipcMain.handle(
  'window-quit',
  () => {
    isQuitting = true;

    if (tray) {
      tray.destroy();
      tray = null;
    }

    app.quit();
    return true;
  }
);

ipcMain.handle(
  'window-hide',
  () => {
    if (
      closeBehavior ===
      'exit'
    ) {
      isQuitting = true;
      app.quit();
    } else {
      hideToTray();
    }

    return true;
  }
);

ipcMain.handle(
  'window-toggle-maximize',
  () => {
    if (
      !mainWindow
    ) {
      return false;
    }

    if (
      mainWindow.isMaximized()
    ) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }

    return mainWindow.isMaximized();
  }
);

ipcMain.handle(
  'set-close-behavior',
  (
    _event,
    value
  ) => {
    closeBehavior =
      value ===
      'exit'
        ? 'exit'
        : 'tray';

    return closeBehavior;
  }
);

ipcMain.handle(
  'show-notification',
  async (
    _event,
    {
      title =
        'GPT Dual Calendar',
      body = ''
    } = {}
  ) => {
    if (
      !Notification.isSupported()
    ) {
      return false;
    }

    new Notification({
      title,
      body,
      icon:
        iconPath
    }).show();

    return true;
  }
);


/*
 * ============================================
 * GitHub Portable Update Center
 * Repository:
 * https://github.com/Yahiaza/GPT-Dual-Calendar
 * ============================================
 */
let latestUpdateInfo =
  null;

let downloadedUpdatePath =
  '';

function compareVersions(
  current,
  latest
) {
  const parse =
    value =>
      String(
        value ||
        ''
      )
        .replace(
          /^v/i,
          ''
        )
        .split('.')
        .map(
          part =>
            Number(
              part.replace(
                /\D.*$/,
                ''
              )
            ) || 0
        );

  const currentParts =
    parse(
      current
    );

  const latestParts =
    parse(
      latest
    );

  const length =
    Math.max(
      currentParts.length,
      latestParts.length
    );

  for (
    let index = 0;
    index < length;
    index += 1
  ) {
    const left =
      currentParts[
        index
      ] || 0;

    const right =
      latestParts[
        index
      ] || 0;

    if (
      right > left
    ) {
      return true;
    }

    if (
      right < left
    ) {
      return false;
    }
  }

  return false;
}

function requestJson(
  url,
  redirects = 0
) {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      if (
        redirects >
        5
      ) {
        reject(
          new Error(
            'Too many redirects'
          )
        );

        return;
      }

      const request =
        https.get(
          url,
          {
            headers: {
              'User-Agent':
                'GPT-Dual-Calendar',
              Accept:
                'application/vnd.github+json',
              'X-GitHub-Api-Version':
                '2022-11-28'
            }
          },
          response => {
            if (
              response.statusCode >=
                300 &&
              response.statusCode <
                400 &&
              response.headers
                .location
            ) {
              const next =
                response.headers
                  .location;

              response.resume();

              requestJson(
                next,
                redirects + 1
              )
                .then(
                  resolve
                )
                .catch(
                  reject
                );

              return;
            }

            let data = '';

            response.setEncoding(
              'utf8'
            );

            response.on(
              'data',
              chunk => {
                data += chunk;
              }
            );

            response.on(
              'end',
              () => {
                if (
                  response.statusCode !==
                  200
                ) {
                  if (
                    response.statusCode ===
                    404
                  ) {
                    reject(
                      new Error(
                        'لا يوجد GitHub Release منشور حتى الآن.'
                      )
                    );
                  } else {
                    reject(
                      new Error(
                        `GitHub HTTP ${response.statusCode}`
                      )
                    );
                  }

                  return;
                }

                try {
                  resolve(
                    JSON.parse(
                      data
                    )
                  );
                } catch (
                  error
                ) {
                  reject(
                    error
                  );
                }
              }
            );
          }
        );

      request.setTimeout(
        15000,
        () => {
          request.destroy(
            new Error(
              'انتهت مهلة الاتصال بـ GitHub.'
            )
          );
        }
      );

      request.on(
        'error',
        reject
      );
    }
  );
}

function requestText(
  url,
  redirects = 0
) {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      if (
        redirects >
        5
      ) {
        reject(
          new Error(
            'Too many redirects'
          )
        );

        return;
      }

      const request =
        https.get(
          url,
          {
            headers: {
              'User-Agent':
                'GPT-Dual-Calendar'
            }
          },
          response => {
            if (
              response.statusCode >=
                300 &&
              response.statusCode <
                400 &&
              response.headers
                .location
            ) {
              const next =
                response.headers
                  .location;

              response.resume();

              requestText(
                next,
                redirects + 1
              )
                .then(
                  resolve
                )
                .catch(
                  reject
                );

              return;
            }

            if (
              response.statusCode !==
              200
            ) {
              response.resume();

              reject(
                new Error(
                  `HTTP ${response.statusCode}`
                )
              );

              return;
            }

            let data = '';

            response.setEncoding(
              'utf8'
            );

            response.on(
              'data',
              chunk => {
                data += chunk;
              }
            );

            response.on(
              'end',
              () =>
                resolve(
                  data
                )
            );
          }
        );

      request.on(
        'error',
        reject
      );
    }
  );
}

function downloadFile(
  url,
  destination,
  onProgress,
  redirects = 0
) {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      if (
        redirects >
        8
      ) {
        reject(
          new Error(
            'Too many download redirects'
          )
        );

        return;
      }

      const request =
        https.get(
          url,
          {
            headers: {
              'User-Agent':
                'GPT-Dual-Calendar',
              Accept:
                'application/octet-stream'
            }
          },
          response => {
            if (
              response.statusCode >=
                300 &&
              response.statusCode <
                400 &&
              response.headers
                .location
            ) {
              const next =
                response.headers
                  .location;

              response.resume();

              downloadFile(
                next,
                destination,
                onProgress,
                redirects + 1
              )
                .then(
                  resolve
                )
                .catch(
                  reject
                );

              return;
            }

            if (
              response.statusCode !==
              200
            ) {
              response.resume();

              reject(
                new Error(
                  `Download HTTP ${response.statusCode}`
                )
              );

              return;
            }

            const total =
              Number(
                response.headers[
                  'content-length'
                ] || 0
              );

            let received =
              0;

            const tempPath =
              `${destination}.part`;

            try {
              if (
                fs.existsSync(
                  tempPath
                )
              ) {
                fs.unlinkSync(
                  tempPath
                );
              }
            } catch {}

            const output =
              fs.createWriteStream(
                tempPath
              );

            response.on(
              'data',
              chunk => {
                received +=
                  chunk.length;

                if (
                  total >
                  0
                ) {
                  onProgress?.(
                    received /
                      total *
                      100
                  );
                }
              }
            );

            response.pipe(
              output
            );

            output.on(
              'finish',
              () => {
                output.close(
                  () => {
                    try {
                      if (
                        fs.existsSync(
                          destination
                        )
                      ) {
                        fs.unlinkSync(
                          destination
                        );
                      }

                      fs.renameSync(
                        tempPath,
                        destination
                      );

                      onProgress?.(
                        100
                      );

                      resolve(
                        destination
                      );
                    } catch (
                      error
                    ) {
                      reject(
                        error
                      );
                    }
                  }
                );
              }
            );

            output.on(
              'error',
              error => {
                try {
                  if (
                    fs.existsSync(
                      tempPath
                    )
                  ) {
                    fs.unlinkSync(
                      tempPath
                    );
                  }
                } catch {}

                reject(
                  error
                );
              }
            );
          }
        );

      request.on(
        'error',
        reject
      );
    }
  );
}

function calculateSha256(
  filePath
) {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      const hash =
        crypto.createHash(
          'sha256'
        );

      const stream =
        fs.createReadStream(
          filePath
        );

      stream.on(
        'data',
        chunk => {
          hash.update(
            chunk
          );
        }
      );

      stream.on(
        'end',
        () => {
          resolve(
            hash.digest(
              'hex'
            )
          );
        }
      );

      stream.on(
        'error',
        reject
      );
    }
  );
}

async function fetchLatestUpdate() {
  const apiUrl =
    `https://api.github.com/repos/${updateConfig.owner}/${updateConfig.repo}/releases/latest`;

  const release =
    await requestJson(
      apiUrl
    );

  const latestVersion =
    String(
      release.tag_name ||
      release.name ||
      ''
    )
      .replace(
        /^v/i,
        ''
      )
      .trim();

  if (
    !latestVersion
  ) {
    throw new Error(
      'لم أستطع تحديد رقم الإصدار المنشور على GitHub.'
    );
  }

  const assets =
    release.assets ||
    [];

  const portableAsset =
    assets.find(
      item =>
        updateConfig
          .portableAssetPattern
          .test(
            item.name ||
            ''
          )
    ) ||
    null;

  const shaAsset =
    assets.find(
      item =>
        updateConfig
          .sha256AssetPattern
          .test(
            item.name ||
            ''
          )
    ) ||
    null;

  const currentVersion =
    app.getVersion();

  latestUpdateInfo = {
    currentVersion,
    latestVersion,

    updateAvailable:
      compareVersions(
        currentVersion,
        latestVersion
      ),

    notes:
      release.body ||
      '',

    releaseUrl:
      release.html_url ||
      '',

    portableAsset:
      portableAsset
        ? {
            name:
              portableAsset.name,
            url:
              portableAsset
                .browser_download_url
          }
        : null,

    shaAsset:
      shaAsset
        ? {
            name:
              shaAsset.name,
            url:
              shaAsset
                .browser_download_url
          }
        : null
  };

  return latestUpdateInfo;
}

ipcMain.handle(
  'update-check',
  async () => {
    try {
      const info =
        await fetchLatestUpdate();

      return {
        success:
          true,
        ...info
      };
    } catch (
      error
    ) {
      return {
        success:
          false,

        message:
          error?.message ||
          'تعذر الاتصال بخدمة التحديث.'
      };
    }
  }
);

ipcMain.handle(
  'update-download',
  async () => {
    try {
      if (
        !latestUpdateInfo
      ) {
        await fetchLatestUpdate();
      }

      if (
        !latestUpdateInfo
          ?.updateAvailable
      ) {
        return {
          success:
            false,
          message:
            'لا يوجد تحديث أحدث من النسخة الحالية.'
        };
      }

      if (
        !latestUpdateInfo
          ?.portableAsset
      ) {
        return {
          success:
            false,
          message:
            'الإصدار الجديد موجود، لكن ملف Portable.exe غير مرفوع داخل GitHub Release.'
        };
      }

      const destination =
        path.join(
          app.getPath(
            'downloads'
          ),
          latestUpdateInfo
            .portableAsset
            .name
        );

      downloadedUpdatePath =
        await downloadFile(
          latestUpdateInfo
            .portableAsset
            .url,
          destination,
          value => {
            if (
              mainWindow &&
              !mainWindow
                .isDestroyed()
            ) {
              mainWindow
                .webContents
                .send(
                  'update-progress',
                  value
                );
            }
          }
        );

      let verified =
        false;

      if (
        latestUpdateInfo
          .shaAsset
      ) {
        try {
          const shaText =
            await requestText(
              latestUpdateInfo
                .shaAsset
                .url
            );

          const expected =
            String(
              shaText ||
              ''
            )
              .trim()
              .split(
                /\s+/
              )[0]
              .toLowerCase();

          const actual =
            (
              await calculateSha256(
                downloadedUpdatePath
              )
            )
              .toLowerCase();

          if (
            expected &&
            expected !==
              actual
          ) {
            try {
              fs.unlinkSync(
                downloadedUpdatePath
              );
            } catch {}

            downloadedUpdatePath =
              '';

            return {
              success:
                false,

              message:
                'فشل التحقق من سلامة ملف التحديث SHA-256، لذلك تم حذف الملف.'
            };
          }

          verified =
            Boolean(
              expected
            );
        } catch (
          error
        ) {
          console.warn(
            'SHA256 verification skipped:',
            error
          );
        }
      }

      return {
        success:
          true,

        path:
          downloadedUpdatePath,

        verified
      };
    } catch (
      error
    ) {
      return {
        success:
          false,

        message:
          error?.message ||
          'فشل تنزيل التحديث.'
      };
    }
  }
);

ipcMain.handle(
  'update-show-file',
  async () => {
    if (
      !downloadedUpdatePath ||
      !fs.existsSync(
        downloadedUpdatePath
      )
    ) {
      return false;
    }

    shell.showItemInFolder(
      downloadedUpdatePath
    );

    return true;
  }
);

async function autoCheckForUpdates() {
  try {
    const info =
      await fetchLatestUpdate();

    if (
      info
        .updateAvailable &&
      mainWindow &&
      !mainWindow
        .isDestroyed()
    ) {
      mainWindow
        .webContents
        .send(
          'update-available',
          {
            success:
              true,
            ...info
          }
        );
    }
  } catch (
    error
  ) {
    /*
     * الفحص التلقائي صامت:
     * لا نزعج المستخدم إذا لم يوجد إنترنت.
     */
  }
}


/*
 * Native Windows Print Dialog
 */
ipcMain.handle(
  'print-html',
  async (
    _event,
    html
  ) => {
    if (
      !html ||
      typeof html !==
      'string'
    ) {
      return {
        success:
          false,
        reason:
          'empty-html'
      };
    }

    const printWindow =
      new BrowserWindow({
        show:
          false,
        width:
          800,
        height:
          900,
        webPreferences: {
          contextIsolation:
            true,
          nodeIntegration:
            false
        }
      });

    try {
      const encoded =
        encodeURIComponent(
          html
        );

      await printWindow.loadURL(
        `data:text/html;charset=utf-8,${encoded}`
      );

      return await new Promise(
        resolve => {
          printWindow.webContents.print(
            {
              silent:
                false,
              printBackground:
                true,
              pageSize:
                'A4',
              margins: {
                marginType:
                  'none'
              },
              landscape:
                false,
              color:
                true
            },
            (
              success,
              failureReason
            ) => {
              if (
                !printWindow.isDestroyed()
              ) {
                printWindow.close();
              }

              resolve({
                success,
                reason:
                  failureReason ||
                  ''
              });
            }
          );
        }
      );
    } catch (error) {
      if (
        !printWindow.isDestroyed()
      ) {
        printWindow.close();
      }

      return {
        success:
          false,
        reason:
          error?.message ||
          'print-error'
      };
    }
  }
);

if (
  gotSingleInstanceLock
) {
  app.whenReady().then(
    () => {
      createWindow();
      createTray();

      setTimeout(
        autoCheckForUpdates,
        Number(
          updateConfig
            .autoCheckDelayMs ||
          8000
        )
      );

      app.on(
        'activate',
        showMainWindow
      );
    }
  );
}

app.on(
  'before-quit',
  () => {
    isQuitting = true;
  }
);

app.on(
  'window-all-closed',
  () => {
    /*
     * يظل التطبيق في Tray
     * حتى يتم اختيار "خروج نهائي".
     */
  }
);
