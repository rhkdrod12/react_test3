import styled from "styled-components";
import { makeCssObject } from "../../utils/commonUtils";

export const StyleDiv = styled.div`
  ${({ inStyle }) => makeCssObject(inStyle)}
`;

export const StyleHeader = styled.header`
  ${({ inStyle }) => makeCssObject(inStyle)}
`;

export const StyleLi = styled.li`
  ${({ inStyle }) => makeCssObject(inStyle)}
`;

export const StyleUl = styled.ul`
  list-style: none;
  width: max-content;
  overflow-y: auto;
  height: 200px;
  ${({ inStyle }) => makeCssObject(inStyle)};
`;
