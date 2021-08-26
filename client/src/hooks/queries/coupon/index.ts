import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getUserCoupons, useRegisterCoupon } from '@/lib/api/user';
import { IUserCoupon } from '@/types';
import { notify } from '@/components/Shared/Toastify';

export const useGetUserCoupons = () => {
  return useQuery<IUserCoupon[], Error>('coupons', getUserCoupons);
};

export const useRegisterUserCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation(useRegisterCoupon, {
    onSuccess: () => {
      queryClient.invalidateQueries('coupons');
      notify('success', '쿠폰 등록에 성공하였습니다!');
    },
  });
};