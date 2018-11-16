<template>
  <span class="v-cascade"
        :class="{'is-focus': isExpand}">
    <div calss="v-cascade__head"
         @click.stop="handleClick()">
      <div class="v-cascade__input">
        <input type="text"
               class="v-cascade__inner"
               ref="input"
               @input="handleInput"/>
      </div>
      <span class="v-cascade__suffix up">
        <i class="e-fonts">&#xe661;</i>
      </span>
      <span class="v-cascade__sel">
        <template v-for="(sel, index) in defaultOption">
          <span>{{sel.label}}</span>&nbsp;
          <span class="v-cascade__splitter"
                v-if="index !=defaultOption.length -1">/</span>&nbsp;
        </template>
      </span>
    </div>
    <transition name="fade">
      <div calss="v-cascade__body"
           v-if="isExpand">
        <div :class="{'triangle': true, 'up-triangle': bottom, 'down-triangle': !bottom}"></div>
        <div :class="['v-cascade__tree', bottom ? '' : 'up']">
          <ul class="v-cascade__list"
              ref="treeList"
              v-for="(li,index) in formattedList"
              :key="index">
            <li :class="{'v-cascade__item': true,'is-selected': isSelected(index,item)}"
                v-for="item in li"
                :key="item.value"
                @click="changeSelection(index,item)">{{item.label}}</li>
          </ul>
        </div>
      </div>
    </transition>
  </span>
</template>
<script>
export default {
  name: 'vCascade',
  componentName: 'vCascade',
  props: {
    lists: {
      type: Array,
    },
    valueTag: {
      type: String,
      default: 'value',
    },
    labelTag: {
      type: String,
      default: 'label',
    },
    value: {
      type: Array,
    },
    placeHolder: {
      type: String,
      default: '输入 搜索试试',
    },
  },
  data() {
    const defaultOpt = this.setDefaultOption();

    return {
      setOption: this.value,
      isExpand: false,
      innerList: this.lists,
      defaultOption: defaultOpt,
      selectOption: defaultOpt.slice(),
      bottom: true,
    };
  },
  computed: {
    formattedList() {
      return this.formatLists(this.selectOption);
    },
  },
  watch: {
    /*
    *  如果下拉列表框收起来，那么，将列表的显示复位为已选项
    *  并且用next-tick，来控制下拉框弹出位置
    * */
    isExpand(val) {
      const self = this;
      if (!val) {
        this.selectOption = this.defaultOption.slice();
      }
      // next-tick来控制下拉选择框是向上弹还是向下弹
      this.$nextTick(() => {
        self.setListOption();
      });
    },
    // 实现组件自定义v-model
    defaultOption(val) {
      const selValue = [];
      for (let i = 0, len = val.length; i < len; i++) {
        selValue.push(val[i].value);
      }
      this.$emit('input', selValue);
    },
  },
  methods: {
    handleClick() {
      this.isExpand = !this.isExpand;
      this.$refs.input.focus();
    },
    handleInput() {
      // todo 增加搜索功能
      this.defaultOption = [];
    },
    setDefaultOption() {
      // 如果没有设置默认项，则默认所有层级选择第一个元素
      if (typeof this.value === 'undefined') {
        return this.setOptionToEverFirst();
      }
      // 如果设置了默认选项，循环查找，并格式化默认选项
      if (this.value.length) {
        let childs = this.lists;
        let dArr = [];
        for (let i = 0; i < this.value.length; i++) {
          for (const ch of childs) {
            if (this.value[i] === ch[this.valueTag]) {
              childs = ch.childs || '';
              const t = {
                value: ch.aid,
                label: ch.name,
              };
              dArr.push(t);
            }
          }
          if (dArr.length !== (i + 1)) {
            break;
          }
        }
        return dArr;
      }
      // 如果传递进来的默认选项长度为0，那么还是选择所有层级的第一个
      return this.setOptionToEverFirst();
    },
    /* 将所有层级的第一项设置为出选项 */
    setOptionToEverFirst() {
      const first = this.lists[0];
      let child = first.childs || '';
      let defaultOpt = [];
      defaultOpt.push({
        value: first[this.valueTag],
        label: first[this.labelTag],
      });
      while (Array.isArray(child)) {
        defaultOpt.push({
          value: child[0][this.valueTag],
          label: child[0][this.labelTag],
        });
        child = child.childs || '';
      }
      return defaultOpt;
    },
    /* 格式化层级为数组
    * 例如:
    * [
    *  [{value: 1, label: 'level1-1'},{value: 2, label: 'level1-2'}],
    *  [{value: 3, label: 'level2-1'},{value: 4, label: 'level2-2'}],
    *  [{value: 5, label: 'level3-1'},{value: 6, label: 'level3-2'}]
    * ]
   */
    formatLists(defaultOpt) {
      let retArr = [];
      let level = [];
      for (const item of this.lists) {
        const tmp = {
          value: item.aid,
          label: item.name,
        };
        level.push(tmp);
        if (defaultOpt.length > 0 && item.aid === defaultOpt[0].value) {
          let a = item;
          let childs = a.childs || '';
          for (let i = 1; i <= defaultOpt.length && childs; i++) {
            let dArr = [];
            let chosen;
            for (const ch of childs) {
              if (i < this.selectOption.length && ch[this.valueTag] === this.selectOption[i].value) {
                chosen = ch;
              }
              const t = {
                value: ch.aid,
                label: ch.name,
              };
              dArr.push(t);
            }
            retArr[i] = dArr;
            childs = (chosen && chosen.childs) || '';
          }
        }
      }
      retArr[0] = level;
      return retArr;
    },
    changeSelection(index, item) {
      this.$set(this.selectOption, index, {
        value: item.value,
        label: item.label,
      });
      this.selectOption.splice(index + 1, this.selectOption.length - index);

      if (index === this.formattedList.length - 1) {
        this.isExpand = false;
        this.defaultOption = this.selectOption.slice();
      }
    },
    isSelected(index, item) {
      return this.selectOption[index] && item.value === this.selectOption[index].value;
    },
    isParent(obj, parentObj) {
      while (typeof obj !== 'undefined' && obj != null && obj.tagName.toLowerCase() !== 'body' && obj.tagName.toLowerCase() !== 'html') {
        if (obj === parentObj) {
          return true;
        }
        obj = obj.parentNode;
      }
      return false;
    },
    setListOption() {
      if (this.isExpand) {
        console.log('llala');
        const { bottom } = this.$refs.treeList[0].getBoundingClientRect();
        if (bottom > parseInt(window.innerHeight)) {
          this.bottom = false;
        }
      } else {
        this.bottom = false;
      }
    },
  },
  mounted() {
    document.addEventListener('click', (e) => {
      if (e.target) {
        if (!this.isParent(e.target, this.$el)) {
          this.isExpand = false;
        }
      }
    });
  },
};
</script>
<style lang="scss"
       scoped>
@font-face {
  font-family: 'vue-iconfont';  /* project id 625868 */
  src: url('//at.alicdn.com/t/font_625868_qfi947bo8g.eot');
  src: url('//at.alicdn.com/t/font_625868_qfi947bo8g.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_625868_qfi947bo8g.woff') format('woff'),
  url('//at.alicdn.com/t/font_625868_qfi947bo8g.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_625868_qfi947bo8g.svg#iconfont') format('svg');
}

.e-fonts {
  font-family: 'vue-iconfont';
}

.v-cascade {
  display: inline-block;
  position: relative;
  width: 200px;
  box-sizing: border-box;
  font-size: 14px;
}

.v-cascade__input {
  display: inline-block;
  position: relative;
  cursor: pointer;
  width: 100%;
}

.v-cascade__inner {
  padding: 0 20px;
  border: 1px solid #bdc1c6;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  height: 40px;
  box-shadow: 0 1px 2px #bdc1c6;
}

.v-cascade__inner:focus, .is-focus .v-cascade__inner {
  border: 1px solid #409eff;
  outline: none;
}

.v-cascade__suffix {
  position: absolute;
  top: 0;
  right: 10px;
  height: 40px;
  line-height: 40px;
  color: #bdc1c6;
  transition: all .2s linear;
  transform: rotate(0deg);
}

.vue-icon-unfold {

}

.is-focus .v-cascade__suffix {
  transform: rotate(180deg);
}

.v-cascade__sel {
  cursor: pointer;
  position: absolute;
  top: 1px;
  left: 1px;
  width: 100%;
  box-sizing: border-box;
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.v-cascade__tree {
  position: absolute;
  top: 50px;
  left: 0px;
  border: 1px solid #e4e7ed;
  box-sizing: border-box;
  width: 100%;
  height: 150px;
  border-radius: 2px;
  display: flex;
  background: #fff;
  box-shadow: 0 0 3px #e4e7ed;
  z-index: 2000;
}

.v-cascade__tree.up {
  top: -162px;
}

.v-cascade__splitter {
  color: #bdc1c6;
}

.triangle {
  position: relative;
  left: 20%;
  width: 0;
  height: 0;
  border: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
}

.triangle.up-triangle {
  top: 3px;
  border-bottom: 8px solid #e4e7ed;
}

.triangle.down-triangle {
  top: -53px;
  border-top: 8px solid #e4e7ed;
}

.triangle:after {
  position: absolute;
  content: '';
  left: -7px;
  width: 0;
  height: 0;
  border: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  z-index: 2001;
}

.triangle.up-triangle:after {
  top: 1px;
  border-bottom: 8px solid #fff;
}

.triangle.down-triangle:after {
  top: -9px;
  border-top: 8px solid #fff;
}

ul, li {
  padding: 0;
  margin: 0
}

li {
  list-style: none;
}

i {
  font-style: normal;
}

.v-cascade__list {
  border-right: 1px solid #e4e7ed;
  padding-top: 4px;
  flex: 1;
  overflow-y: scroll;
}

.v-cascade__list:last-child {
  border-right: 0;
}

.v-cascade__item {
  position: relative;
  padding-left: 10px;
  height: 32px;
  line-height: 32px;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  padding-right: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.v-cascade__item.is-selected {
  color: #409eff;
  background: #f5f7fa;
}

.v-cascade__item:hover {
  background: #f5f7fa;
}

.v-cascade__item:after {
  content: '>';
  position: absolute;
  right: 10px;
  color: #bdc1c6;
}

.v-cascade__list:last-child .v-cascade__item:after {
  content: '';
}

.fade-enter-active {
  animation: fade-in .3s ease-out;
}

.fade-leave-active {
  animation: fade-in .2s reverse;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
