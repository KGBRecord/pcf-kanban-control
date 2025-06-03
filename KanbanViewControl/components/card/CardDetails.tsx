import * as React from "react";
import { CardInfo, UniqueIdentifier } from "../../interfaces";
import { Text } from "@fluentui/react/lib/Text";
import { isEntityReference, isNullOrEmpty } from "../../lib/utils";
import { Lookup } from "../lookup/Lookup";
import { useNavigation } from "../../hooks/useNavigation";
import { BoardContext } from "../../context/board-context";
import { useContext } from "react";
import { MultiType } from "../../interfaces/card.type";

interface ICardInfoProps {
  id: UniqueIdentifier;
  info: CardInfo;
}

const CardDetails = ({ info }: ICardInfoProps) => {
  console.log(info);
  
  const { context } = useContext(BoardContext);
  const { openForm } = useNavigation(context);

  const onLookupClicked = (entityName: string, id: string) => {
    openForm(entityName, id);
  };

  const handleInfoValue = (value: MultiType) => {
    if (typeof value === "number") {
      return context.formatting.formatCurrency(value);
    }
    
    return !value || value === "Unallocated" ? undefined : value;
  };
  // console.log(info.label);
  
  return info.label ? (
    <div
      className="card-info"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%", // chiếm trọn chiều ngang card
      }}
    >
      <Text
        className="card-info-label"
        variant="small"
        block
        style={{ marginBottom: 2, color: "#666" }}
      >
        {info.label}
      </Text>
      {isEntityReference(info.value) ? (
        <Lookup info={info} onOpenLookup={onLookupClicked} />
      ) : (
        <Text className="card-info-value" variant="medium" block>
          {handleInfoValue(info.value)}
        </Text>
      )}
    </div>
  ) : null;
};

interface IProps {
  children: React.ReactNode;
}

const CardDetailsList = ({ children }: IProps) => {
  return (
    <div
      className="card-info-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start", // đảm bảo không bị stretch toàn dòng
        gap: 8,
      }}
    >
      {children}
    </div>
  );
};

export { CardDetailsList, CardDetails };
