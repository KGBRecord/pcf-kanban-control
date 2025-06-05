import * as React from 'react';
import { useContext, useMemo } from 'react';
import { Text } from '@fluentui/react/lib/Text';
import { ColumnItem } from '../../interfaces';
import { BoardContext } from '../../context/board-context';
import { useNavigation } from '../../hooks/useNavigation';

interface IProps {
  column: ColumnItem;
}

const ColumnHeader = ({ column }: IProps) => {
  const { context, activeView } = useContext(BoardContext);
  const { createNewRecord } = useNavigation(context);
  const cardWidth = parseInt(context.parameters.cardWidth.raw as string, 10);

  const onAddNewRecord = async (colId: string) => {
    await createNewRecord();
  };

  const count = useMemo(() => column.cards?.length ?? 0, [column.cards]);

  return (
    <div
      className="column-header-container"
      style={{
        backgroundColor: column.color ?? '#eeeeee',
        padding: 8,
        borderRadius: 4
        // width: cardWidth,
      }}
    >
      <div className="column-header">
        <Text variant="xLarge" nowrap>
          {column.title}
        </Text>
        <div className="column-actions">
          {count > 0 && (
            <Text variant="small" className="column-counter">
              {count}
            </Text>
          )}
          {/* <IconButton
            iconName="Add"
            onClick={() => onAddNewRecord(column.id as string)}
            noBorder
          /> */}
        </div>
      </div>
    </div>
  );
};

export default ColumnHeader;
