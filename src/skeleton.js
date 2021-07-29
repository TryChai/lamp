import Vue from 'vue';
import shellPage from './skeleton/shell-page.vue';
import shellProductDetails from './skeleton/shell-product-details';

export default new Vue({
  components: {
    shellPage,
    shellProductDetails
  },
  template: `
        <div>
            <shellPage id="shellPage" />
            <shellProductDetails id="shellProductDetails" style="display:none"></shellProductDetails>
        </div>
    `
});