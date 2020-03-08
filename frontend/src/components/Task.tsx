import React from "react";
import styled from "@emotion/styled";
import { Quote, AuthorColors } from "types";
import {
  DraggableProvided,
  Draggable,
  DraggableStateSnapshot
} from "react-beautiful-dnd";
import { N30, N0, N900, N70 } from "colors";
import { grid, borderRadius } from "const";
import TaskEditor from "components/TaskEditor";
import EditButton from "./EditButton";

const getBackgroundColor = (
  isDragging: boolean,
  isGroupedOver: boolean,
  authorColors: AuthorColors
) => {
  if (isDragging) {
    return authorColors.soft;
  }

  if (isGroupedOver) {
    return N30;
  }

  return N0;
};

const getBorderColor = (isDragging: boolean, authorColors: AuthorColors) =>
  isDragging ? authorColors.hard : "transparent";

const imageSize = 40;

interface ContainerProps {
  isDragging: boolean;
  isGroupedOver: boolean;
  colors: AuthorColors;
}

const Container = styled.span<ContainerProps>`
  border-radius: ${borderRadius}px;
  border: 2px solid transparent;
  border-color: ${props => getBorderColor(props.isDragging, props.colors)};
  background-color: ${props =>
    getBackgroundColor(props.isDragging, props.isGroupedOver, props.colors)};
  box-shadow: ${({ isDragging }) =>
    isDragging ? `2px 2px 1px ${N70}` : "none"};
  box-sizing: border-box;
  padding: ${grid}px;
  min-height: ${imageSize}px;
  margin-bottom: ${grid}px;
  user-select: none;

  /* anchor overrides */
  color: ${N900};

  &:hover,
  &:active {
    color: ${N900};
    text-decoration: none;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.colors.hard};
    box-shadow: none;
  }

  /* flexbox */
  display: flex;
`;

const Avatar = styled.img`
  width: ${imageSize}px;
  height: ${imageSize}px;
  border-radius: 50%;
  margin-right: ${grid}px;
  flex-shrink: 0;
  flex-grow: 0;
`;

const Content = styled.div`
  /* flex child */
  flex-grow: 1;
  /*
    Needed to wrap text in ie11
    https://stackoverflow.com/questions/35111090/why-ie11-doesnt-wrap-the-text-in-flexbox
  */
  flex-basis: 100%;
  /* flex parent */
  display: flex;
  flex-direction: column;
`;

const BlockQuote = styled.div``;

const Footer = styled.div`
  display: flex;
  margin-top: ${grid}px;
  align-items: center;
`;

const Author = styled.small<any>`
  color: ${props => props.colors.hard};
  flex-grow: 0;
  margin: 0;
  background-color: ${props => props.colors.soft};
  border-radius: ${borderRadius}px;
  font-weight: normal;
  padding: ${grid / 2}px;
`;

const QuoteId = styled.small`
  flex-grow: 1;
  flex-shrink: 1;
  margin: 0;
  font-weight: normal;
  text-overflow: ellipsis;
  text-align: right;
`;

const getStyle = (provided: DraggableProvided, style?: Record<string, any>) => {
  if (!style) {
    return provided.draggableProps.style;
  }

  return {
    ...provided.draggableProps.style,
    ...style
  };
};

interface Props {
  quote: Quote;
  style?: Record<string, any>;
  index: number;
}

const Task = ({ quote, style, index }: Props) => {
  const [hover, setHover] = React.useState<boolean>(false);
  const [editing, setEditing] = React.useState<boolean>(false);

  const beginHover = () => setHover(true);
  const endHover = () => setHover(false);

  if (editing) {
    return <TaskEditor setEditing={setEditing} />;
  }

  return (
    <Draggable key={quote.id} draggableId={quote.id} index={index}>
      {(
        dragProvided: DraggableProvided,
        dragSnapshot: DraggableStateSnapshot
      ) => (
        <Container
          isDragging={dragSnapshot.isDragging}
          isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
          colors={quote.author.colors}
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
          style={getStyle(dragProvided, style)}
          data-is-dragging={dragSnapshot.isDragging}
          data-testid={quote.id}
          data-index={index}
          aria-label={`${quote.author.name} quote ${quote.content}`}
          onMouseEnter={beginHover}
          onMouseLeave={endHover}
        >
          <Avatar src={quote.author.avatarUrl} alt={quote.author.name} />
          <Content>
            <BlockQuote>{quote.content}</BlockQuote>
            <Footer>
              <Author colors={quote.author.colors}>{quote.author.name}</Author>
              <QuoteId>id:{quote.id}</QuoteId>
            </Footer>
          </Content>
          {hover && <EditButton handleClick={() => setEditing(true)} />}
        </Container>
      )}
    </Draggable>
  );
};

export default React.memo<Props>(Task);