<template>
  <ValidationObserver ref="form" tag="div" class="participate step-1">
    <form @submit.prevent="toStep">
      <div class="col-12">
        <ValidationProvider
          tag="div"
          class="form-group"
          rules="required"
          v-slot="validationContext"
        >
          <label for="firstName" class="sr-only">Nom *</label>
          <b-form-input
            id="firstName"
            class="form-control"
            v-model="name"
            placeholder="Votre nom"
            :state="getValidationState(validationContext)"
          ></b-form-input>
          <b-form-invalid-feedback>
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </ValidationProvider>
      </div>
      <div class="col-12">
        <ValidationProvider
          tag="div"
          class="form-group"
          rules="required"
          v-slot="validationContext"
        >
          <label for="firstName" class="sr-only">Prénom *</label>
          <b-form-input
            id="firstName"
            class="form-control"
            v-model.trim="firstName"
            placeholder="Votre prénom"
            :state="getValidationState(validationContext)"
          ></b-form-input>
          <b-form-invalid-feedback>
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </ValidationProvider>
      </div>
      <div class="col-12">
        <ValidationProvider
          tag="div"
          class="form-group"
          rules="required|email"
          v-slot="validationContext"
        >
          <label for="email" class="sr-only">Email *</label>
          <b-form-input
            placeholder="Votre email"
            id="email"
            class="form-control"
            v-model.trim="email"
            :state="getValidationState(validationContext)"
          ></b-form-input>
          <b-form-invalid-feedback>
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </ValidationProvider>
      </div>
      <div class="col-12">
        <ValidationProvider
          tag="div"
          class="form-group"
          rules="required"
          v-slot="validationContext"
        >
          <b-form-checkbox-group id="checkbox-group-1" v-model="selected">
            <b-form-checkbox class="rgpd" value="true"
              >J'accepte les conditions d'utilisation conformes au
              <a href="#">RGPD</a>
            </b-form-checkbox>
            <div class="invalid-feedback">
              {{ validationContext.errors[0] }}
            </div>
          </b-form-checkbox-group>
        </ValidationProvider>
      </div>
      <div class="col-12 mt-5">
        <button type="submit" class="bttn-pill bttn-md bttn-primary bttn-block">
          Valider
        </button>
      </div>
    </form>
  </ValidationObserver>
</template>
<script>
import {
  ValidationProvider,
  extend,
  setInteractionMode,
  ValidationObserver
} from "vee-validate";
import { required, email } from "vee-validate/dist/rules";

setInteractionMode("eager");

extend("email", {
  ...email,
  message: "Email invalide"
});

extend("required", {
  ...required,
  message: "Champs obligatoire"
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data() {
    return {
      email: "",
      name: "",
      firstName: "",
      selected: []
    };
  },
  computed: {
    disableStepOne() {
      return this.selected[0] && this.name && this.email ? false : true;
    }
  },
  methods: {
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    toStep() {
      this.$refs.form.validate().then(success => {
        if (success === false || this.selected.length === 0) {
          return;
        } else {
          const user = {
            name: this.name,
            firstName: this.firstName,
            email: this.email,
            selected: this.selected[0]
          };
          localStorage.setItem("user", JSON.stringify(user));
          this.$router.push({ name: "step2" });
        }
      });
    },
    initStep() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.name && user.firstName) {
        this.name = user.name;
        this.firstName = user.firstName;
        this.email = user.email;
      }
    }
  },
  mounted() {
    this.$store.commit("setProfile", {});
    this.initStep();
  }
};
</script>
<style lang="scss" scoped>
.participate {
  width: 100%;
  text-align: center;
  .invalid-feedback {
    text-align: left;
  }
  .disabled {
    opacity: 0.6;
  }
  .form-group {
    margin-bottom: 2rem;
  }
  .form-control {
    background-color: transparent;
    color: white;
    border-color: white;
  }
  .rgpd {
    color: white;
    a {
      color: white;
      text-decoration: underline;
    }
  }
  .invalid-feedback {
    color: white;
  }
  .rgpd + .invalid-feedback {
    display: block;
  }
  #checkbox-group-1 {
    text-align: left;
  }
  ::placeholder {
    color: white;
  }
}
</style>
