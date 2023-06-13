import styled from 'styled-components';

export const StyledDownload = styled.div`
  cursor: pointer;
  position: absolute;
  right: -60px;
  top: -1px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  width: 56px;
  border: 1px solid ${(props) => props.theme.baseGray};
  transition: all 0.3s ease-in-out;
`;
