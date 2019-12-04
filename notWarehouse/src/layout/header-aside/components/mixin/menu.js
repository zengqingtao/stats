import util from '@/libs/util.js'
import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions("d2admin/menu", ["asideCollapseToggle"]),
    handleMenuSelect (index, indexPath) {
      var clientWidth = document.body.clientWidth
      if (/^d2-menu-empty-\d+$/.test(index) || index === undefined) {
        this.$message.warning('临时菜单')
      } else if (/^https:\/\/|http:\/\//.test(index)) {
        util.open(index)
      } else {
        // console.log("屏幕宽度",clientWidth);
        if(clientWidth<=480){
          this.asideCollapseToggle()
        }
        // console.log("点击了菜单++++",index);
        this.$router.push({
          path: index
        })
      }
    }
  }
}
