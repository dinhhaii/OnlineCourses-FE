/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toast } from 'react-toastify';
import { getRandom } from '../../utils/helper';
import { updateCart, fetchCart } from '../../actions/cart';

const CartItems = (props) => {
  const headers = ['Item', 'Discount', 'Price', 'Actions'];
  const { cartState, userState } = props;
  const [couponCode, setCouponCode] = useState('');

  const handleChangeCoupon = (e) => {
    setCouponCode(e.target.value);
  };

  const applyCouponCode = () => {
    const items = [];
    cartState.cart.items.forEach(element => {
      const discount = element.course.discountList.find(value => value.code === couponCode);
      if (discount && discount.status !== 'expired') {
        items.push({
          _idCourse: element.course._id,
          _idDiscount: discount._id,
        });
      } else {
        items.push({
          _idCourse: element.course._id,
          _idDiscount: element.discount && element.discount.status !== 'expired' ? element.discount._id : null,
        });
      }
    });
    if (items.length !== 0) {
      const updateData = {
        _idCart: cartState.cart._id,
        items,
      };
      props.updateCartAction(updateData);
    } else {
      toast.warn(`Sorry, ${couponCode} is not available!`);
    }
    setCouponCode('');
  };

  return (
    <div className="col-lg-8">
      <div className="box_cart">
        <table className="table table-hover table-striped cart-list shadow">
          <thead style={{ paddingTop: 20 }}>
            <tr>
              {headers.map((value, index) => <th key={index.toString()}>{value}</th>)}
            </tr>
          </thead>
          <tbody>
            {cartState.cart && cartState.cart.items.map((item, index) => {
              const price = item.discount ? ((item.course.price * (100 - item.discount.percentage)) / 100).toFixed(2) : item.course.price;
              return (
                <tr key={index.toString()}>
                  <td>
                    <div className="thumb_cart" style={{ borderRadius: 0 }}>
                      <img src={item.course.imageURL} alt="" />
                    </div>
                    <span className="item_cart">{item.course.name}</span>
                  </td>
                  <td>{item.discount ? (
                    <> <span className={`badge ${getRandom(['badge-danger', 'badge-info', 'badge-success', 'badge-warning'])}`}>{item.discount.code}</span> {`(${item.discount.percentage}%)`} </>
                  ) : '0%'}
                  </td>
                  <td>
                    <strong>${price}</strong>
                  </td>
                  <td
                    className="options"
                    style={{ width: `${5}%`, textAlign: 'center' }}>
                    <Link onClick={() => {}}>
                      <i className="icon-trash" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="cart-options clearfix">
          <div className="float-left">
            <div className="apply-coupon">
              <div className="form-group">
                <input
                  type="text"
                  name="coupon-code"
                  value={couponCode}
                  onChange={handleChangeCoupon}
                  placeholder="Your Coupon Code"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <button
                  type="button"
                  className="btn_1 outline"
                  onClick={applyCouponCode}>
                  Apply Coupon
                </button>
              </div>
            </div>
          </div>
          <div className="float-right fix_mobile">
            <button type="button" className="btn_1 outline" onClick={() => {
              if (userState.user) {
                props.fetchCartAction(userState.user._id);
              }
            }}>
              Update Cart
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    cartState: state.cartState,
    userState: state.userState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCartAction: bindActionCreators(updateCart, dispatch),
    fetchCartAction: bindActionCreators(fetchCart, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartItems);
