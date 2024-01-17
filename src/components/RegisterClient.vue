<template>
  <section class="vh-100" style="background-color:white;">
    <div class="container h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-lg-6 col-sm-9">
          <div class="card text-black  shadow-lg p-3 mb-5 bg-white rounded">
            <div class="card-body">
              <div class="row justify-content-center">
                <div class="col-md-10">

                  <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Register a new client</p>

                  <Form @submit="handleReg" :validation-schema="schema" class="mx-1 mx-md-4">
                    <div v-if="!successful">

                      <div class="d-flex flex-row align-items-center mb-4">
                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div class="form-outline flex-fill mb-0">
                          <label class="form-label" for="name">Name</label>
                          <Field type="text" name="name" class="form-control  form-control-sm" />
                          <ErrorMessage name="name" class="error-feedback" />

                        </div>
                      </div>

                      <div class="d-flex flex-row align-items-center mb-4">
                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div class="form-outline flex-fill mb-0">
                          <label class="form-label" for="address">Address</label>
                          <Field type="text" name="address" class="form-control  form-control-sm" />
                          <ErrorMessage name="address" class="error-feedback" />

                        </div>
                      </div>

                      <div class="d-flex flex-row align-items-center mb-4">
                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div class="form-outline flex-fill mb-0">
                          <label class="form-label" for="age">Age</label>
                          <Field type="text" name="age" class="form-control  form-control-sm" />
                          <ErrorMessage name="age" class="error-feedback" />
                        </div>
                      </div>

                      <div class="d-flex flex-row align-items-center mb-4">
                        <i class="fas fa-envelope fa-lg me-3 fa-fw"></i>
                        <div class="form-outline flex-fill mb-0">
                          <label class="form-label" for="email">Email</label>
                          <Field type="email" name="email" class="form-control  form-control-sm" />
                          <ErrorMessage name="email" class="error-feedback" />
                        </div>
                      </div>

                      <div class="d-flex flex-row align-items-center mb-4">
                        <i class="fas fa-lock fa-lg me-3 fa-fw"></i>
                        <div class="form-outline flex-fill mb-0">
                          <label class="form-label" for="password">Password</label>
                          <Field type="password" name="password" class="form-control  form-control-sm" />
                          <ErrorMessage name="password" class="error-feedback" />
                        </div>
                      </div>

                      <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button class="button-222" role="button">
                          Save client
                        </button>
                      </div>
                    </div>

                  </Form>

                  <div v-if="message" class="alert" :class="successful ? 'alert-success' : 'alert-danger'">
                    {{ message }}
                    <div>
                      <router-link to="/AdminHome" class="register-link">
                        <button type="submit" role="button" class="button-222">Back to home page</button>
                      </router-link>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <div class="container">
    <router-view />
  </div>
</template>
  
<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import AdminService from "@/services/admin.service";
//import Dropdown from "primevue/dropdown";
import * as yup from "yup";

export default {
  name: "RegisterClient",
  components: {
   Form,
    Field,
    ErrorMessage,
    //Dropdown,
  },
  data() {
    const schema = yup.object().shape({
      email: yup
        .string()
        .required("Email is required!")
        .email("Email is invalid!")
        .max(50, "Must be maximum 50 characters!"),
      password: yup
        .string()
        .required("Password is required!")
        .min(6, "Must be at least 6 characters!")
        .max(40, "Must be maximum 40 characters!"),
      name: yup
        .string()
        .required("Name is required!"),
      address: yup
        .string()
        .required("Address is required!"),
      age: yup
        .number()
        .required("Age is required!")
        .min(18, "Must be at least 18 years old!"),
     
    });

    return {
      successful: false,
      loading: false,
      message: "",
      schema,
    };
  },
  methods: {
   
    handleReg(user) {
      this.message = "";
      this.successful = false;
      this.loading = true;
      console.log(user);
     AdminService.registerClient(user).then(
        () => {
          this.message = "CLIENT CREATED!";
          this.successful = true;
          this.loading = false;
        },
        (error) => {
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          this.successful = false;
          this.loading = false;
        }
      );
    },
  },
  created() {
    
  }
};
</script>
  
<style scoped>
@import url(../assets/styles/update_button.css);
.error-feedback {
  color: red;
  font-size: 0.8rem;
}
</style>