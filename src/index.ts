import isNpmOrYarn from './isNpmOrYarn';
import hasNewVersion from './hasNewVersion';
import { IUpdate } from './types';
import borderedText from './borderedText';

const printUpdateMessage = (
  pkgName: string,
  oldVersion: string,
  latestVersion: string
) => {
  console.error(
    borderedText(`New version of ${pkgName} available!
Current Version: ${oldVersion}
Latest Version: ${latestVersion}`)
  );
};

const simpleUpdateNotifier = async (args: IUpdate) => {
  if (
    !args.alwaysRun &&
    (!process.stdout.isTTY || (isNpmOrYarn && !args.shouldNotifyInNpmScript))
  ) {
    if (args.debug) {
      console.error('Opting out of running simpleUpdateNotifier()');
    }
    return;
  }

  try {
    const latestVersion = await hasNewVersion(args);
    if (latestVersion) {
      return () =>
        printUpdateMessage(args.pkg.name, args.pkg.version, latestVersion);
    }
  } catch (err) {
    // Catch any network errors or cache writing errors so module doesn't cause a crash
    if (args.debug && err instanceof Error) {
      console.error('Unexpected error in simpleUpdateNotifier():', err);
    }
  }

  return null;
};

export default simpleUpdateNotifier;
