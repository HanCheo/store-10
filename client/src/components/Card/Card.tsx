import React, { Dispatch, useCallback } from 'react';
import * as S from './styles';
import {
  HeartSVG as HeartButton,
  CartSVG as ShoppingCart,
} from '@/assets/svgs';
import { Link } from '@/lib/Router';
import { calculateDiscount, wonFormat } from '@/utils/helper';
import { useAddBookmark, useDeleteBookmark } from '@/hooks/queries/bookmark';
import { usePostCart } from '@/hooks/queries/cart';
import { useRecoilState } from 'recoil';
import { userState } from '@/recoil/user';
import { notify } from '../Shared/Toastify';
import { ShoppingCartModal } from '@/components/Shared/Modal';
import useModal from '@/hooks/useModal';
import Image from '@/components/Shared/Image';

const BgColor = {
  Error: 'error',
  Primary: 'primary',
  New: 'new',
  Best: 'best',
} as const;

export type BG_COLOR = typeof BgColor[keyof typeof BgColor];
interface CardProps {
  bgColor: BG_COLOR; // category 식으로 리스트화 (enum 등..) 필요
  linkId: number;
  discount?: number;
  src?: string;
  title: string;
  price: number;
  bottomDisplay?: boolean;
  checkBoxDisplay?: boolean;
  setCheckedList?: Dispatch<number[]>;
  checkedList?: number[];
  bookmarkList?: number[];
}

const Card = ({
  bgColor,
  linkId,
  discount,
  src,
  title,
  price,
  bottomDisplay = true,
  checkBoxDisplay = false,
  setCheckedList,
  checkedList,
  bookmarkList,
}: CardProps) => {
  const { mutate: addMutate } = useAddBookmark();
  const { mutate: deleteMutate } = useDeleteBookmark();
  const { mutate: addcartMutate } = usePostCart();
  const [openModal, toggleModal] = useModal(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const [user] = useRecoilState(userState);

  const isChecked = !!checkedList?.find((checkedId) => checkedId === linkId);

  const onChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && setCheckedList && checkedList) {
      setCheckedList([...checkedList, linkId]);
    } else if (setCheckedList && checkedList) {
      setCheckedList(checkedList.filter((chekcedId) => chekcedId !== linkId));
    }
  };

  const isHeartChecked = !!bookmarkList?.find(
    (checkedId) => checkedId === linkId
  );

  const checkBoxOnClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const heartBtnOnClick = useCallback(() => {
    if (!user) notify('error', '로그인이 필요합니다!');
    else if (isHeartChecked) {
      deleteMutate([linkId]);
    } else {
      addMutate(linkId);
    }
  }, [addMutate, deleteMutate, isHeartChecked, linkId, user]);

  const cartBtnOnClick = useCallback(() => {
    if (!user) {
      notify('error', '로그인이 필요합니다!');
      return;
    }

    const addCart = () => {
      addcartMutate(
        {
          count: 1,
          productId: String(linkId),
        },
        {
          onSuccess() {
            toggleModal();
          },
        }
      );
    };

    addCart();
  }, [user, linkId, addcartMutate, toggleModal]);

  return (
    <Link to={`/detail/${linkId}`}>
      <S.Card>
        <div>
          <S.Liner bgColor={bgColor} />
          <S.ThumbnailWrapper>
            {!checkBoxDisplay || (
              <S.CardCheckbox
                onChange={onChangeCheckbox}
                checked={isChecked}
                onClick={checkBoxOnClick}
              />
            )}
            {discount ? <S.NameTag>{discount}%</S.NameTag> : ''}
            {!!src && <Image src={src} alt="상품 섬네일 이미지" />}
            {!bottomDisplay || (
              <S.BottomBar onClick={handleClick}>
                <S.ButtonArea>
                  <HeartButton
                    witdh={24}
                    height={24}
                    fill={isHeartChecked ? 'red' : 'none'}
                    onClick={heartBtnOnClick}
                  />
                </S.ButtonArea>
                <S.ButtonArea>
                  <ShoppingCart
                    witdh={24}
                    height={24}
                    onClick={cartBtnOnClick}
                  />
                </S.ButtonArea>
              </S.BottomBar>
            )}
            <p className="title">{title}</p>
          </S.ThumbnailWrapper>
        </div>
        <S.ProductDetails>
          {!bottomDisplay ||
            (discount ? (
              <>
                <div className="price-tag strikethrough">
                  {wonFormat(price)}
                </div>
                <div className="price-tag discount">
                  {wonFormat(calculateDiscount({ price, discount }))}
                </div>
              </>
            ) : (
              <div className="price-tag">{wonFormat(price)}</div>
            ))}
        </S.ProductDetails>
        {openModal && <ShoppingCartModal toggleModal={toggleModal} />}
      </S.Card>
    </Link>
  );
};

export default React.memo(Card);
