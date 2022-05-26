import styled from "styled-components";
import { makeCssObject } from "../../utils/commonUtils";

export const StyleDiv = styled.div`
  ${({ inStyle }) => makeCssObject(inStyle)}
`;

export const StyleHeader = styled.header`
  ${({ inStyle }) => makeCssObject(inStyle)}
`;
