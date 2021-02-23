Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `
    <ul>
      <li v-for="detail in details">{{detail}}</li>
    </ul>
  `
})

Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
  <div class="product">
    <div class="product-body">

      <div class="product-image">
          <img :src="image" alt="">
      </div>
      <div class="product-info">
          <h1>{{title}}</h1>
          <p>{{description}}</p>
          <p v-show="inStock > 5" :class="blue">In stock</p>
          <p v-show="inStock < 6 && inStock >= 1"
             :class="{ 'almost-out': inStock < 6 }">
              Almost out of stock</p>
          <p v-show="!inStock" 
          :class=" [inStock ?  '' : outOfStock ]"
          >Out of Stock</p>
          
          <p>Shipping: {{shipping}}</p>
          
          <product-details :details="details"></product-details>

          <p>{{ onSaleShow }}</p>
          
          <ul>
              <li v-for="size in sizes">size:  {{size}}</li>
          </ul>
          <div v-for="(variant, index) in variants" 
          :key="variant.variantId"
          class="color-box"
          :style="{ backgroundColor: variant.variantColor }"
          @mouseover="changeImage(index)"
          >  
              </div>
          <div class="cart-section" :class="{ disabledButton: !inStock }">
              <button @click="cartCount" :disabled="!inStock">Add</button>
              <button @click="cartRemove" :disabled="!inStock">Remove</button>
              <button @click="emptyCart" :disabled="!inStock">Remove All</button>
          </div>
      </div>
    </div>

      <div class="product-review">
          <h2>Reviews:</h2>
          <ul>
              <div v-for="review in reviews">
                <h3>User: {{ review.name }}</h3>
                <p>{{ review.review }}</p>
                <p>Rates: {{ review.rating }}</p>
                <p>Recommended: {{ review.recommendation }}</p>
              </div>
          </ul>
          <p v-if="!reviews.length">There are no reviews yet</p>
          <product-review @review-submitted="addReview"></product-review>
      </div>
      </div>
  `,
  data () {
    return {
      brand: 'My Sock',
      product: 'Socks',
      description: 'Questo è un bel prodotto',
      selectedVariant: 0,
      link: 'https://codepen.io/tiziano-meola',
      onSale: false,
      details: ["80% cotton", "20% silk", "Male"],
      sizes: [43, 39, 37],
      blue: 'blue-font',
      outOfStock: 'outOfStock',
      variants: [
        {
          variantId: 223,
          variantImage: 'https://media.mysockfactory.ch/1313-large_default/plain-green-socks.jpg',
          variantColor: "green",
          variantQuantity: 10,
        },
        {
          variantId: 224,
          variantImage: 'https://media.mysockfactory.ch/1278-large_default/electric-blue-socks.jpg',
          variantColor: "blue",
          variantQuantity: 4,
        }
      ],
      reviews: []
    }
  },
  methods: {
    cartCount () {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
    },
    cartRemove () {
      this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
    },
    changeImage (index) {
      this.selectedVariant = index
    },
    emptyCart () {
      this.$emit('removeAll')
    },
    addReview (productReview) {
      this.reviews.push(productReview)
    }
  },
  computed: {
    title () {
      return this.brand + ' - ' + this.product
    },
    image () {
      return this.variants[this.selectedVariant].variantImage
    },
    inStock () {
      return this.variants[this.selectedVariant].variantQuantity
    },
    onSaleShow () {
      if (this.onSale) {
        return this.brand + ' - ' + this.product
      }
    },
    shipping () {
      if(this.premium) { return 'free' }
      else return 2.99
    }
  }
}) 

Vue.component('product-review', {
  template: `
  <form class="review-form" @submit.prevent="onSubmit">
      <p v-if="errors.length">
        <b> Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors"> {{ error }}</li>
        </ul>
      </p>
      <p>
          <label for="name">Name: </label><br>
          <input type="text" id="name" name="name" v-model="name"><br>
      </p>
      <p>
          <label for="review">Review: </label><br>
          <textarea type="text" id="review" name="review" v-model="review"></textarea>
      </p>
      <p>
        <label for="rating">Rating:</label><br>
        <select id="rating" v-model.number="rating">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
        </select>
      </p>

      <input type="radio" id="yes" name="recommendation" value="yes" v-model="recommendation">
      <label for="yes">Yes</label><br>
      <input type="radio" id="maybe" name="recommendation" value="maybe" v-model="recommendation">
      <label for="maybe">Maybe</label><br>
      <input type="radio" id="no" name="recommendation" value="no" v-model="recommendation">
      <label for="no">No</label>
      <br>

      <input type="submit">

</form> 
  `,
  data () {
    return {
      name: null,
      review: null,
      rating: null,
      recommendation: null,
      errors: []
    }
  },
  methods: {
    onSubmit () {
      if (this.name && this.rating && this.review) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommendation: this.recommendation
        }
        this.$emit('review-submitted', productReview)
        this.name = null
        this.review = null
        this.rating = null
        this.recommendation = null
        } else {
        if (!this.name) this.errors.push("Name required.")
        if (!this.review) this.errors.push("Review required.")
        if (!this.rating) this.errors.push("Rating required.")
      }
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: [],
  },
  methods: {
    addToCart (id) {
      this.cart.push(id)
    },
    removeFromCart (id) {
      if (id == this.cart.slice(-1)[0]) { this.cart.pop()}
    },
    removeAll () {
      this.cart = []
    }
  }
})