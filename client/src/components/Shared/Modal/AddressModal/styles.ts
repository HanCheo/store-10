import styled from 'styled-components';
import Checkbox from '@/components/Shared/Checkbox';
import {
  ModalHeader,
  ModalDivider,
  ModalBody,
  ModalButtonArea,
} from '../styles';

export const AddressModalHeader = styled(ModalHeader)``;
export const AddressModalDivider = styled(ModalDivider)``;
export const AddressModalBody = styled(ModalBody)`
  input {
    margin-top: 1.2rem;
  }
`;
export const AddressModalButtonArea = styled(ModalButtonArea)`
  margin-top: 1.2rem;
`;

export const PostcodeWrapper = styled.div`
  margin-top: 1.2rem;
  display: flex;
  > div {
    flex: 1;
    margin-left: 2rem;
    > input {
      margin-top: 0;
    }
  }

  button {
    border-radius: 10px;
    ${({ theme }) => theme.fontSize.m}
  }
`;

export const DefaultAddrssCheckbox = styled(Checkbox)`
  margin-top: 1.2rem;
  color: ${({ theme }) => theme.color['text-color']};
`;

export const DuamPostWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  right: 0;
  bottom: 0;
  transform: translate(-50%, -50%);
  width: 36rem;
  height: 50rem;
  background-color: rgba(1, 1, 1, 0.55);
`;
