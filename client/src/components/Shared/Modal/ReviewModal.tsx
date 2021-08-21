import React, { useState } from 'react';
import { RatingSetter } from '@/components/Shared/Rating';
import Title from '@/components/Shared/Title';
import ModalLayout from './ModalLayout';
import * as S from './styles';
import Button from '@/components/Shared/Button';
import { FileInput, Textarea } from '@/components/Shared/Input';
import useFileInput from '@/hooks/useFileInput';
import Form from '@/components/Shared/Form';
import { useCreateReview } from '@/hooks/queries/product';
import { useParams } from '@/lib/Router';

interface ReviewModalProps {
  toggleModal: () => void;
}

// TODO: Input 타입을 조금 더 만들어야 하겠군뇨 호호호

const ReviewModal = ({ toggleModal }: ReviewModalProps) => {
  const { id } = useParams().params;
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const { mutate } = useCreateReview();
  const {
    fileRef,
    fileImgs,
    isError,
    handleClickOnFileInput,
    handleUploadFile,
  } = useFileInput();

  const handleOnRating = (rating: number) => {
    setRating(rating);
  };

  const handleOnTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { target } = e;
    setContent(target.value);
  };

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate({
      rating,
      product_id: id,
      content,
    });

    toggleModal();
  };

  return (
    <ModalLayout toggleModal={toggleModal}>
      <S.ModalHeader>상품후기 작성</S.ModalHeader>
      <S.ModalDivider />
      <S.ModalBody>
        <Form onSubmit={handleOnSubmit} gap={3}>
          <div className="input-wrapper">
            <Title level={5}>별점 매기기</Title>
            <RatingSetter handleOnRating={handleOnRating} />
          </div>
          <Title level={5}>사진 업로드 (최대 3장)</Title>

          <div className="input-wrapper">
            <FileInput
              fileRef={fileRef}
              name="image-uploader"
              fileImgs={fileImgs}
              isError={isError}
              handleClickOnFileInput={handleClickOnFileInput}
              handleUploadFile={handleUploadFile}
              hidden
            />
          </div>

          <div className="input-wrapper">
            <Title level={5}>리뷰 남기기</Title>
            <Textarea
              placeholder="다른 구매자와 판매자에게 도움이 될 수 있도록 자세하고 솔직하게 리뷰 작성 부탁드려요!"
              resize="vertical"
              name="review-content"
              onChange={handleOnTextarea}
              fullWidth
            />
          </div>

          <S.ModalButtonArea>
            <Button color="primary" type="submit" fullWidth>
              완료
            </Button>
          </S.ModalButtonArea>
        </Form>
      </S.ModalBody>
    </ModalLayout>
  );
};

export default ReviewModal;
