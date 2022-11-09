import styled, { StyledComponent } from 'styled-components';

export const StyledEmailContent: StyledComponent<any, any> = styled.div`
  margin-top: 24px;
  padding: 24px;
  box-shadow: 0 0 #000, 0 0 #000, 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
  background: ${(props) => props.theme.secondaryText};
  border-radius: 10px;
`;

export const StyledFunctions: StyledComponent<any, any> = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const BtnFunction: StyledComponent<any, any> = styled.div`
  cursor: pointer;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;
  transition: all 0.3s;

  svg {
    path {
      fill: ${(props) => props.theme.blue};
      transition: all 0.3s;
    }
  }

  &:hover {
    background: ${(props) => props.theme.softBlue};
    svg {
      path {
        fill: ${(props) => props.theme.blueHover};
      }
    }
  }
`;
