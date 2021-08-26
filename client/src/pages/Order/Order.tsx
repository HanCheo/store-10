import React, { useState } from 'react';
import * as S from './styles';
import OrderSummary from '@/components/Order/OrderSummary';
import Title from '@/components/Shared/Title';
import OrderAddress from '@/components/Order/OrderAddress';
import OrderProducts from '@/components/Order/OrderProducts';
import OrderCoupon from '@/components/Order/OrderCoupon';
import OrderPayment from '@/components/Order/OrderPayment';
import { useParams, Redirect } from '@/lib/Router';
import { useGetOrder, useUpdateOrder } from '@/hooks/queries/order';
import { IAddress, IOrder } from '@/types';
import { calculateDiscount } from '@/utils/helper';

const Order = () => {
  const { id } = useParams().params;
  const { data, isLoading, isError } = useGetOrder(+id);
  const { mutate } = useUpdateOrder();
  const [updateDefaultAddress, setUpdateDefaultAddress] = useState(false);
  const [address, selectAddress] = useState<IAddress | null>(null);
  const [order, setOrder] = useState<Partial<IOrder>>({
    id: +id,
    status: 'paid',
    delivery_request_message: null,
    address_id: null,
    payment_id: 1,
    userCoupon_id: null,
    coupon_discount: 0,
  });

  const updateOrder = () => {
    if (typeof order === 'object') {
      mutate({ order, updateDefaultAddress });
    }
  };

  const totalPrice =
    data?.products.reduce(
      (sum, product) => sum + product.price * product.count,
      0
    ) || 0;

  const totalClount = data?.products?.length || 0;
  const totalProductsDiscount =
    data?.products.reduce((sum, product) => {
      return (
        sum +
        (product.price -
          calculateDiscount({
            price: product.price,
            discount: product.discount,
          })) *
          product.count
      );
    }, 0) || 0;

  if (isError || (data && data.status !== 'created')) {
    return <Redirect to="/notfound" />;
  }

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <S.OrderContainer className="container">
      <S.Order>
        <S.OrderHeader>
          <Title level={4}>주문/결제</Title>
        </S.OrderHeader>
        <OrderAddress
          setOrder={setOrder}
          updateDefaultAddress={updateDefaultAddress}
          setUpdateDefaultAddress={setUpdateDefaultAddress}
          address={address}
          selectAddress={selectAddress}
        />
        <OrderProducts products={data?.products} />
        <OrderCoupon
          setOrder={setOrder}
          selectedCoupon={order?.userCoupon_id || null}
        />
        <OrderPayment setOrder={setOrder} order={order} />
      </S.Order>
      <S.OrderAside>
        <OrderSummary
          totalPrice={totalPrice}
          totalProductsDiscount={totalProductsDiscount}
          deliveryFee={2500}
          couponDiscount={order.coupon_discount}
          productCount={totalClount}
          updateOrder={updateOrder}
          address={address}
          data={data}
        />
      </S.OrderAside>

      <S.OrderFooter>
        <OrderSummary
          totalPrice={totalPrice}
          totalProductsDiscount={totalProductsDiscount}
          deliveryFee={2500}
          couponDiscount={order.coupon_discount}
          productCount={totalClount}
          updateOrder={updateOrder}
          address={address}
          data={data}
        />
      </S.OrderFooter>
    </S.OrderContainer>
  );
};

export default Order;
