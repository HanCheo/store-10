import React, { useCallback, useState } from 'react';
import { SearchSVG } from '@/assets/svgs';
import { MenuSVG, UserSVG, CartSVG, HeartSVG } from '@/assets/svgs';
import * as S from './styles';
import { Link } from '@/lib/Router';
import Sidebar from './Sidebar';
import Search from './Search';
import { useRecoilState } from 'recoil';
import { userState } from '@/recoil/user';
import Logo from '@/components/Shared/Logo';

export const Links = () => {
  const [user] = useRecoilState(userState);
  return (
    <>
      <Link to={user ? '/mypage' : '/login'}>
        <UserSVG />
      </Link>
      {user || (
        <>
          <Link to="/bookmark">
            <HeartSVG />
          </Link>
          <Link to="/cart">
            <CartSVG className="filled" />
          </Link>
        </>
      )}
    </>
  );
};

const Header = () => {
  const [sideBarIsOpen, setSideBarIsOpen] = useState(false);
  const [searchIsOpen, setSearchIsOpen] = useState(false);

  const searchWrapToggle = useCallback(() => {
    setSearchIsOpen(!searchIsOpen);
  }, [searchIsOpen]);

  return (
    <>
      <S.HeaderWrapper>
        <Sidebar isOpen={sideBarIsOpen} setIsOpen={setSideBarIsOpen} />
        <S.Header>
          <S.Menu>
            <S.MenuButton onClick={() => setSideBarIsOpen(!sideBarIsOpen)}>
              <MenuSVG />
            </S.MenuButton>
            <Link to="/">
              <S.Logo>
                <Logo width={150} />
              </S.Logo>
            </Link>
          </S.Menu>
          <S.SearchWrapper onClick={searchWrapToggle}>
            <S.SearchText />
            <SearchSVG />
          </S.SearchWrapper>
          <S.StateUl>
            <Links />
          </S.StateUl>
        </S.Header>
      </S.HeaderWrapper>
      {searchIsOpen && <Search toggleOpen={searchWrapToggle} />}
    </>
  );
};

export default Header;
