<template>
  <section class="vh-100" style="background-color:white;">
    <br>
    <div class="container h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-lg-4 col-sm-11">
          <div class="card text-black  shadow-lg p-3 mb-5 bg-white rounded">
            <div class="card-body">
              <div class="row justify-content-center">
                <div class="col-md-14">

                  <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Edit Client Info</p>

                  <Form @submit="handleEdit"  class="mx-1 mx-md-4">
                    <div v-if="!successful">

                      <div class="d-flex flex-row align-items-center mb-4">
                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div class="form-outline flex-fill mb-0">
                          <label class="form-label" for="name">Name</label>
                          <Field v-model="this.currentClient.name" type="text" name="name"
                            class="form-control form-control-sm" />
                          <ErrorMessage name="name" class="error-feedback" />

                        </div>
                      </div>

                      <div class="d-flex flex-row align-items-center mb-4">
                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div class="form-outline flex-fill mb-0">
                          <label class="form-label" for="address">Address</label>
                          <Field v-model="this.currentClient.address" type="text" name="address" class="form-control  form-control-sm" />
                          <ErrorMessage name="address" class="error-feedback" />

                        </div>
                      </div>

                      <div class="d-flex flex-row align-items-center mb-4">
                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div class="form-outline flex-fill mb-0">
                          <label class="form-label" for="age">Age</label>
                          <Field v-model="this.currentClient.age" type="text" name="age" class="form-control  form-control-sm" />
                          <ErrorMessage name="age" class="error-feedback" />

                        </div>
                      </div>

                      <div class="d-flex flex-row align-items-center mb-4">
                        <i class="fas fa-envelope fa-lg me-3 fa-fw"></i>
                        <div class="form-outline flex-fill mb-0">
                          <label class="form-label" for="email">Email</label>
                          <Field v-model="this.currentClient.email" type="email" name="email" class="form-control  form-control-sm" />
                          <ErrorMessage name="email" class="error-feedback" />
                        </div>
                      </div>


                      <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button role="button" class="button-222">
                          Update
                        </button>
                      </div>
                    </div>

                  </Form>

                  <div v-if="message" class="alert" :class="successful ? 'alert-success' : 'alert-danger'">
                    {{ message }}
                    <div>
                      <router-link to="/AdminHome" class="register-link">
                        <button class="btn btn-info">Back to home page</button>
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
//import Dropdown from 'primevue/dropdown';
//import Card from 'primevue/card';
import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import "primevue/resources/themes/soho-light/theme.css";  //theme   
import "primevue/resources/primevue.min.css"; //core
import "primeicons/primeicons.css"; //icons
import ClientService from '@/services/client.service';
import AdminService from '@/services/admin.service';

export default {
  name: "UpdateClientAccount",
  components: {
    Form,
    Field,
    ErrorMessage,
   // Dropdown,
  },

  data() {

    const schema = yup.object().shape({
      address: yup
        .string()
        .required("Address is required!"),
      email: yup
        .string()
        .required("Email is required!")
        .email("Email is invalid!")
        .max(50, "Must be maximum 50 characters!"),
     
      name: yup
        .string()
        .required("Name is required!"),
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
      currentClient: ""
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
    selectedClientId() {
      return JSON.parse(localStorage.getItem('clientToUpdateId'));
    }
  },
  methods: {
    handleEdit() {
      this.message = "";
      this.successful = false;
      this.loading = true;
     // this.currentDoctor.location = this.selectedLocation;

      console.log("Sunt in handleEdit")

      AdminService.updateClient(this.currentClient).then(
        () => {
          this.message = "UPDATED!"
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
    ClientService.getClientData(this.selectedClientId).then(
      (respone) => {
        console.log(respone.data)
        this.currentClient = respone.data
      },
      (error) => {
        this.message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      }
    )}
};
</script>
  
<style scoped>
@import url(../assets/styles/delete_button.css);
.error-feedback {
  color: red;
  font-size: 0.8rem;
}
</style>