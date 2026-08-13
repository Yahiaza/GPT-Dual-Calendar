module.exports = {
  owner: 'Yahiaza',
  repo: 'GPT-Dual-Calendar',

  /*
   * The updater looks for the portable EXE in the latest GitHub Release.
   * Example:
   * GPT-Dual-Calendar-1.0.12-Portable.exe
   */
  portableAssetPattern:
    /Portable\.exe$/i,

  /*
   * Optional SHA256 asset generated alongside the EXE.
   * Example:
   * GPT-Dual-Calendar-1.0.12-Portable.exe.sha256
   */
  sha256AssetPattern:
    /Portable\.exe\.sha256$/i,

  autoCheckDelayMs:
    8000
};
