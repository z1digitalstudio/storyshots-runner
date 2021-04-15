import PromisePool from 'es6-promise-pool';
import { basename, join } from 'path';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect } from 'react';
import sharp from 'sharp';

async function importDiff({
  diff,
  setCounter,
}: {
  diff: string;
  setCounter: Dispatch<SetStateAction<number>>;
}): Promise<void> {
  const diffFilename = basename(diff);
  const image = sharp(diff);
  const metadata = await image.metadata();

  /*
   * jest-image-snapshot diffs consist are divided in three sections of equal
   * width:
   *
   * 1. The original snapshot
   * 2. The difference between the original and the result
   * 3. The resulting snapshot
   *
   * We want to take 3. and replace the original snapshot file, therefore we
   * have to crop the last 33% of the image.
   */
  const cropWidth = (metadata.width ?? 0) / 3;

  await image
    .extract({
      height: metadata.height ?? 0,
      left: cropWidth * 2,
      top: 0,
      width: cropWidth,
    })
    .toFile(
      join(diff, '../..', diffFilename.replace('-diff.png', '-snap.png')),
    );

  setCounter((c) => c + 1);
}

export function useImportDiffs({
  diffs,
  setCounter,
}: {
  diffs: readonly string[];
  setCounter: Dispatch<SetStateAction<number>>;
}): void {
  useEffect(() => {
    const promiseGenerator = function* () {
      for (let i = 0; i < diffs.length; i++) {
        yield importDiff({
          diff: diffs[i] ?? '',
          setCounter,
        });
      }
    };

    // The typings of PromisePool are incorrect and don't accept generators
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pool = new PromisePool(promiseGenerator() as any, 3);

    void pool.start();
  }, [diffs, setCounter]);
}
