<template>
  <div class="container vh-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-lg-4 col-sm-11">
          <div class="card text-black  shadow-lg p-3 mb-5 bg-white rounded">
            <div class="card-body">
              <div class="row justify-content-center">
                <div class="col-md-12">

                  <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Login</p>

                  <Form @submit="handleLogin" :validation-schema="schema" class="mx-1 mx-md-4">

                    <div class="d-flex flex-row align-items-center mb-4">
                      <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                      <div class="form-outline flex-fill mb-0">
                        <Field type="text" name="email" class="form-control" placeholder="Your email" />
                        <ErrorMessage name="email" class="error-feedback" />
                      </div>
                    </div>

                    <div class="d-flex flex-row align-items-center mb-4">
                      <i class="fas fa-lock fa-lg me-3 fa-fw"></i>
                      <div class="form-outline flex-fill mb-0">
                        <Field type="password" class="form-control" name="password" placeholder="Your password" />
                        <ErrorMessage name="password" class="error-feedback" />
                      </div>
                    </div>


                    <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                      <button role="button" class="button-222">
                        Login
                      </button>
                    </div>
                    <!--
                    <div class="signup-link">
                      Don't have an account?
                      <router-link to="/RegisterDonor" class="register-link">Register here!</router-link>
                    </div> -->

                  </form>

                </div>
                <div class="form-group">
                  <div v-if="message" class="alert alert-danger" role="alert">
                    {{ message }}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    

</div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import "primevue/resources/themes/mira/theme.css";  //theme   
import "primevue/resources/primevue.min.css"; //core
import "primeicons/primeicons.css"; //icons

export default {
  name: "LoginPage",
  components: {
    Form,
    Field,
    ErrorMessage,

  },
  data() {
    const schema = yup.object().shape({
      email: yup.string().required("Email is required"),
      password: yup.string().required("Password is required")
    });
    return {
      loading: false,
      message: "",
      schema,
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  created() {
    if (this.loggedIn) {
      if (this.currentUser.role === "USER") {
        this.$router.push("/ClientHome");
      }
      if (this.currentUser.role === "ADMIN") {
        this.$router.push("/AdminHome");
      }
    }
  },
  methods: {
    handleLogin(user) {
      this.login = true;

      this.$store.dispatch("auth/login", user).then(
        () => {
          console.log(this.currentUser);
          if (this.currentUser['role'] == 'USER') {
            this.$router.push("/ClientHome");
          }
          if (this.currentUser['role'] == 'ADMIN') {
            this.$router.push("/AdminHome");
          }
        },
        (error) => {
          this.loading = false;
          this.message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
  }
}

</script>

<style>
@import url(../assets/styles/update_button.css); 


.error-feedback {
  color: red;
  font-size: 0.8rem;
}
.bg-img{
  width: 100vh;
  height: 100vw;
  object-fit: contain;
}
.form-control:focus {
  border-color: #1b6d6d;
  box-shadow: 0 0 0 0.2rem rgba(71, 230, 161, 0.25);
}
</style>