import React from 'react';
import { CloseSVG } from '@/assets/svgs';
import * as S from './styles';
import categoryList from '@/dummies/categorys';
import { Links } from '../Header';

interface Props {
  isOpen?: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userName?: string | null;
}

const Sidebar = ({ ...props }: Props) => {
  const { isOpen, setIsOpen, userName } = props;
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <S.SideBar className={isOpen ? 'active' : ''}>
        <S.Top>
          <div>
            {userName ? `${userName}님 환영합니다!` : '로그인이 필요합니다.'}
          </div>
          <S.IconsWrapper>
            <Links />
            <CloseSVG onClick={closeSidebar} />
          </S.IconsWrapper>
        </S.Top>
        <S.Contents>
          <S.ContentTitle>카테고리</S.ContentTitle>
          <S.Categories>
            {Object.keys(categoryList).map((mainCategory, mainIdx) => (
              <li key={'mainCategory_' + mainIdx} className="active">
                <div>{mainCategory}</div>
                <S.SubCategory>
                  {categoryList[mainCategory].map((subCategory, subIdx) => (
                    <dd key={'subCategory_' + subIdx}>{subCategory}</dd>
                  ))}
                </S.SubCategory>
              </li>
            ))}
          </S.Categories>
        </S.Contents>
      </S.SideBar>
      <S.Backdrop className="backdorp" onClick={closeSidebar}></S.Backdrop>
    </>
  );
};

export default Sidebar;
