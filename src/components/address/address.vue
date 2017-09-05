<template>
  <div class="wrapper">
    <div class="headLine">
      <span class="icon"><i class="icon-arrow_lift"></i></span>
      <span class="tabText">收货地址</span>
    </div>
  	<ul>
  	  <li v-for="(item,index) in aheadAddress" class="item">
  	  	<div class="checked" :class="{'icon-checkmark':index==currentIndex}"></div>
  	  	<div class="inform" @click="currentIndex = index">
  	  	  <div class="userInform">
  	  	    <span class="name">{{item.userName}}</span>
  	  	    <span class="tel">{{item.tel}}</span>
  	  	  </div>
  	  	  <div class="address">{{item.streetName}}</div>
  	  	</div>
  	  	<div class="edit">
  	  	  <span v-if="item.isDefault" class="isDefault">默认地址</span>
  	  	  <span v-if="!item.isDefault" @click="setDefault(item.addressId)">设为默认</span>
  	  	</div>
  	  </li>
  	</ul>
  	<a @click="changeMore()" class="more" href="javascript: ">{{more}}</a>
  	<div class="add"><div class="addAddress">+新增地址</div></div>
  </div>
</template>
<script>
  export default{
    data () {
      return {
        address: [],
        currentIndex: 0,
        limitNum: 3,
        more: '加载更多'
      }
    },
    created () {
      this.$http.get('/api/address').then(response => {
        response = response.body
        if (response.errno === 0) {
          this.address = response.data
          console.log(this.address)
        }
      }).catch(e => {
        console.log(e)
      })
    },
    methods: {
      changeMore () {
        if (this.limitNum === 3) {
          this.limitNum = this.currentIndex.length
          this.more = '收起'
        } else {
          this.limitNum = 3
          this.more = '加载更多'
        }
      },
      setDefault (addressId) {
        this.address.forEach((item, index) => {
          if (item.addressId === addressId) {
            item.isDefault = true
          } else {
            item.isDefault = false
          }
        })
      }
    },
    computed: {
      aheadAddress () {
        return this.address.slice(0, this.limitNum)
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.wrapper{
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  z-index: 1000
  background: white
}
  .headLine{
    position: relative
    width: 100%
    height: 45px
    line-height: 45px
    border-bottom: 1px solid #DCDCDE
    font-size: 16px
    background: #F6F6F6
  }
    .icon{
      position: absolute
      top: 0
      left: 10px
      color: #989A9C
    }
    .tabText{
      display: block
      text-align: center
    }
  .item{
    display: flex
    margin-left: 10px
    padding: 10px 0
    border-bottom: 1px solid #E0E0E0
  }
    .icon-checkmark{
      flex: 0 0 30px
      height: 30px
      line-height: 40px
      font-size: 25px
      color: red
    }
    .inform{
      flex: 1
    }
      .userInform{
      	margin-bottom: 10px
      }
        .name{
          color: #222222
        }
      .address{
      	color: #808080
      }
    .edit{
      flex: 0 0 60
      height: 30px
      line-height: 30px
      padding: 0 20px
      border-left: 1px solid #E0E0E0
      color: #808080
    }
      .isDefault{
      	color: red
      }
  .more{
  	display: block
  	width: 120px
  	height: 35px
  	line-height: 35px
  	text-align: center
  	border: 1px solid #E0E0E0
  	border-radius: 8%
    margin: 30px auto
  	color: red
  }
  & a:active{
    border: 1px solid #808080
  }
  .add{
    position: fixed
    width: 100%
    height: 50px
  	left: 0
  	right: 0
  	bottom: 0
    background: #F8F8F8
  }
    .addAddress{
  	  width: 50%
  	  height: 33px
  	  line-height: 33px
  	  text-align: center
  	  margin: 10px auto
  	  border-radius: 3%
  	  color: white
  	  background: #F23030
    }
  
</style>