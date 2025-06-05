import * as React from 'react';
import { useContext, useMemo } from 'react';
import { Text } from '@fluentui/react/lib/Text';
import CardHeader from './CardHeader';
import CardBody from './CardBody';
import { CardItem, CardInfo } from '../../interfaces';
import { CardDetails, CardDetailsList } from './CardDetails';
import { BoardContext } from '../../context/board-context';
import { useNavigation } from '../../hooks/useNavigation';

interface IProps {
  item: CardItem;
  triggerOnChange: (val: string) => void;
}

const Card = ({ item, triggerOnChange }: IProps) => {
  const { context } = useContext(BoardContext);
  const { openForm } = useNavigation(context);

  const cardWidthRaw = context.parameters.cardWidth?.raw;
  const cardWidth =
    cardWidthRaw && !isNaN(Number(cardWidthRaw)) ? Number(cardWidthRaw) : 280;

  const onCardClick = () => {
    triggerOnChange(`OPEN#${item.id.toString()}`);
  };

  const cardDetails = useMemo(
    () =>
      Object.entries(item).filter(
        (k) => !['title', 'tag', 'id', 'column'].includes(k[0])
      ),
    [item]
  );

  return (
    <div
      className="card-container"
      style={{
        // width: cardWidth,
        // minWidth: 180,
        maxWidth: 500
      }}
      onClick={onCardClick}
    >
      <CardHeader>
        <Text className="card-title" nowrap>
          {item?.title?.value ?? item?.title}
        </Text>
      </CardHeader>
      <CardBody>
        <CardDetailsList>
          {cardDetails.map((info) => (
            <CardDetails
              key={`${info[0]}-${item.id}`}
              id={item.id}
              info={info[1] as CardInfo}
            />
          ))}
        </CardDetailsList>
      </CardBody>
      {/* <CardFooter>
        <IconButton
          iconName="ChevronRight"
          cursor="pointer"
          noBorder
          onClick={onCardClick}
        />
      </CardFooter> */}
    </div>
  );
};

export default Card;
