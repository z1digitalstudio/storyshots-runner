import { Text } from 'ink';
import Spinner from 'ink-spinner';
import React, { FC, useState } from 'react';

import { useImportDiffs } from './logic';
import type { Props } from './types';

const Importer: FC<Props> = ({ diffs }) => {
  const [counter, setCounter] = useState(0);

  useImportDiffs({ diffs, setCounter });

  const done = counter === diffs.length;

  return (
    <Text color="white">
      <Text color="green">{done ? '✓' : <Spinner />}</Text>{' '}
      <Text>
        {done ? 'Importing' : 'Imported'} diffs ({counter}/{diffs.length})
      </Text>
    </Text>
  );
};

export default Importer;
