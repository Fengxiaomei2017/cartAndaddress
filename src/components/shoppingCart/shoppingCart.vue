<template>
  <div class="shoppingCart">
    <div class="headLine">
      <ul class="tab">
      	<li><span class="icon-arrow_lift"></span></li>
      	<li class="tabText">购物车</li>
      	<li class="tabIcon"><span class="icon-menu"></span></li>
      </ul>
    </div>
    <ul class="goods-wrapper" ref="goodsHook">
      <li class="allGoods" v-for="item in shoppingCart.goods">
      	<div class="businessName">
      	  <span href="javascript:" class="uncheck IconWrappar"><i class="checkedWrapper Icon" @click="checkBusiness(item)" :class="{'icon-check_circle': item.checked}"></i></span>
      	  <img width="16" height="13" class="TitleIcon avatar" :src="item.avatar">
      	  <span class="title">{{item.businessName}}</span>
      	  <span class="TitleIcon"><i class="icon-keyboard_arrow_right"></i></span>
      	</div>
        <div>
          <ul class="goodsDetail">
            <li class="checkGoods"><span class="uncheck unchecked" href="javascript:"><i class="checkedWrapper checksingleIcon" :class="{'icon-check_circle': item.checkedgoods}" @click="checkGoods(item)"></i></span></li>
            <li class="detail">
             <img class="goodsImg" width="89" height="89" :src="item.image" alt="产品图片">
             <div class="goods">
               <div class="detailTitle">{{item.title}}</div>
               <span class="color">{{item.color}}</span>
               <span class="version">{{item.version}}</span>
               <div class="chargeNum">
                 <div class="goodsNum"><a @click="changeNum(item, -1)" href="javascript: ">-</a><input type="text" value="1" v-model="item.num"><a @click="changeNum(item, 1)" href="javascript:">+</a></div>
              	 <strong>{{item.charge*item.num | formatMoney}}</strong>
               </div>
             </div>
            </li>
          </ul>
        </div>
      	<ul class="goodsExcess">
      	  <li class="excess" v-if="item.excess" v-for="items in item.excess">{{items.text}}</li>
      	</ul>
      </li>
    </ul>
    <div class="fixedBottom">
      <ul class="goCount">
        <li class="Allchecked">
          <span class="uncheck checkAllIconWrapper" href="javascript:"><i class="checkedWrapper AllcheckedIcon Icon" href="javascript:" :class="{'icon-check_circle': checkAllFlog}" @click="checkAll"></i></span><b>全选</b>
        </li>
        <li class="count">
          合计：<span class="countNum">{{shoppingCart.countNum | formatMoney}}</span>
        </li>
      </ul>
      <div class="account">
      	<router-link tag="div" to="/address">地址页面 ></router-link>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
export default{
  data () {
    return {
      shoppingCart: {},
      checkAllFlog: false,
      price: [],
      singleCharge: 0
    }
  },
  // 过滤器
  filters: {
    formatMoney: function (value) {
      return '￥ ' + value + '.00'
    }
  },
  created () {
    this.$http.get('/api/shoppingCart').then(response => {
      response = response.body
      if (response.errno === 0) {
        this.shoppingCart = response.data
      }
    }).catch(e => {
      console.log(e)
    })
  },
  methods: {
    changeNum (obj, type) {
      if (type > 0) {
        obj.num++
      } else {
        obj.num--
        if (obj.num < 1) {
          obj.num = 1
        }
      }
    },
    // 选择商店，商品也被选中，当商品全部选中后，全选按钮也被选中
    checkBusiness: function (item) {
      if (typeof item.checked === 'undefined') {
        this.$set(item, 'checked', true)
        item.checkedgoods = true
      } else {
        item.checked = !item.checked
        item.checkedgoods = !item.checkedgoods
      }
      this._checkAll(item)
      this._countNum(item)
    },
    // 选择商品，商店也被选中
    checkGoods: function (item) {
      if (typeof item.checkedgoods === 'undefined') {
        this.$set(item, 'checkedgoods', true)
        item.checked = true
      } else {
        item.checkedgoods = !item.checkedgoods
        item.checked = !item.checked
      }
      this._checkAll(item)
      this._countNum(item)
    },
    // 全选按钮选中，其余都被选中
    checkAll: function () {
      this.checkAllFlog = !this.checkAllFlog
      if (this.checkAllFlog) {
        this.shoppingCart.goods.forEach((item) => {
          if (typeof item.checked === 'undefined') {
            this.$set(item, 'checked', true)
            item.checkedgoods = true
            this._checkAllPrice(item)
          }
          if (typeof item.checked !== 'undefined' && !item.checked) {
            item.checked = !item.checked
            item.checkedgoods = !item.checkedgoods
            this._checkAllPrice(item)
          }
        })
      } else {
        this.shoppingCart.goods.forEach((item) => {
          item.checked = !item.checked
          item.checkedgoods = !item.checkedgoods
          this.shoppingCart.countNum = 0
        })
      }
    },
    _checkAll (item) {
      let k = 0
      this.shoppingCart.goods.forEach((item) => {
        if (item.checked) {
          k++
        }
        if (k === this.shoppingCart.goods.length) {
          this.checkAllFlog = true
        } else {
          this.checkAllFlog = false
        }
      })
    },
    _checkAllPrice (item) {
      this.singleCharge = item.charge * item.num
      this.shoppingCart.countNum += this.singleCharge
    },
    _countNum (item) {
      this.singleCharge = item.charge * item.num
      if (item.checkedgoods) {
        this.shoppingCart.countNum += this.singleCharge
      } else {
        this.shoppingCart.countNum -= this.singleCharge
      }
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.shoppingCart{
  position: absolute
  left: 0
  top: 0
  bottom: 0
  z-index: 11
  width: 100%
  background: #F0F2F5
}
  .headLine{
    position: relative
    width: 100%
    height: 45px
    line-height: 45px
    border-bottom: 1px solid #DCDCDE
    font-size: 0
    background: #F6F6F6
  }
    .tab{
      display: flex
      font-size: 16px
    }
      li{
      	flex: 1
      	padding: 0 10px
      }
        &.tabText{
          text-align: center  
        }
        &.tabIcon{
          text-align: right
        }
        &.icon-arrow_lift,&.icon-menu{
          font-size: 18px
          color: #828282
        }
    .allGoods{
      width: 92%
      margin: 0 5px 10px 5px
      font-size: 0
      background: white
      color: #828282
      border-bottom: 1px solid #828282
    }
      .businessName{
        height: 40px
        line-height: 40px
        font-size: 15px
        color: black
      }
        .IconWrappar{
          display: inline-block
          text-align: center
      	  margin: 0 2px
      	  vertical-align: middle
      	  color: #9E9FA1
        }
          .Icon{
          	vertical-align: top
          	margin: -4px 0 0 -4px
          }
        .TitleIcon{
          vertical-align: middle
        }
      .goodsDetail{
      	position: relative
        display: flex
      }
        .checkGoods{
      	  flex: 0 0 10px
          width: 10px
      	  font-size: 20px
        }
          .unchecked{
          	display: inline-block
            margin: 36px 0 0 -7px
            text-align: center
            border-radius: 50%
          	color: #9E9FA1
          }
            .checksingleIcon{
          	  vertical-align: middle
          	  margin: -9px 0 0 -4px
            }
              &.icon-check_circle{
                color: red
              }
            
        .detail{
      	  flex: 1
      	  display: flex
      	  padding-left: 0
        }
          .goodsImg{
            flex: 0 0 69px
            border: 1px solid #F0F2F5
            border-radius: 5%
          }
            .goods{
              flex: 1
              margin-left: 7px
            }
            .detailTitle{
              height: 30px
              line-height: 15px
              font-size: 14px
              overflow: hidden
              text-overflow: ellipsis
              color: black
            }
            .color,.version{
          	  display: inline-block
          	  width: 90px
          	  white-space: nowrap
              overflow: hidden
              text-overflow: ellipsis
          	  margin-top: 5px
          	  font-size: 10px
            }
              .chargeNum{
              	height: 30px
              	line-height: 30px
          	    margin-top: 15px
          	    font-size: 18px
          	    color: red
              }
                strong{
                  font-size: 17px
                }
                .goodsNum{
                  float: right
                  width: 90px
                  text-align: center
                  height: 24px
                  line-height: 24px
                  border: 1px solid #DCDCDE
                }
                  a{
                  	display: inline-block
                  	width: 25px
                  	height: 24px
                  }
                  input{
                  	width: 34px
                  	height: 24px
                  	text-align: center
                  	border: 1px solid #DCDCDE
                  	border-top: 0
                  	border-bottom: 0
                  }
      .goodsExcess{
        background: #FFF9F9
        width: 89%
        margin: 30px 0 0 -10px
        padding: 10px 30px
        font-size: 12px
      }
        .excess{
          width: 80%
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
        }
    .fixedBottom{
      width: 100%
      height: 50px
      line-height: 50px
      position: fixed
      display: flex
      bottom: 0
      left: 0
      right: 0
      z-index: 12
      font-size: 0
      background: #FEFEFE
    }
      .goCount{
      	flex: 1
      }
        .Allchecked{
          display: inline-block
          margin-left: 14px
          font-size: 14px
          padding: 0 5px
        }
          .checkAllIconWrapper{
          	display: inline-block
            margin-right: 5px
            vertical-align: middle
          }
            .AllcheckedIcon{
          	  margin: -5px 0 0 -4px
              color: #9E9FA1
            }
              &.icon-check_circle{
              	color: red
              }
            b{
              font-weight: bold
            }
        .count{
          display: inline-block
          font-size: 15px
          padding: 0 5px
          font-weight: bold
        }
      .account{
      	flex: 0 0 98px
      	font-size: 16px
      	color: white
      	text-align: center
      	background: #F23030
      }
</style>