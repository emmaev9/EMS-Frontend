<template>
  <br>
  <br>
  <br>
  <section class="vh-100" style="background-color:white;">
    <div class="container h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-lg-4 col-sm-11">
          <div class="card text-black  shadow-lg p-3 mb-5 bg-white rounded">
            <div class="card-body">
              <div class="row justify-content-center">
                <div class="col-md-12">

                  <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Edit Device Info</p>

                  <Form @submit="handleEdit"  class="mx-1 mx-md-4">
                    <div v-if="!successful">

                      <div class="d-flex flex-row align-items-center mb-4">
                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div class="form-outline flex-fill mb-0">
                          <label class="form-label" for="description">Description</label>
                          <Field v-model="this.currentDevice.description" type="text" name="description"
                            class="form-control form-control-sm" />
                          <ErrorMessage name="description" class="error-feedback" />

                        </div>
                      </div>

                      <div class="d-flex flex-row align-items-center mb-4">
                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div class="form-outline flex-fill mb-0">
                          <label class="form-label" for="address">Address</label>
                          <Field v-model="this.currentDevice.address" type="text" name="address" class="form-control  form-control-sm" />
                          <ErrorMessage name="address" class="error-feedback" />

                        </div>
                      </div>

                      <div class="d-flex flex-row align-items-center mb-4">
                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div class="form-outline flex-fill mb-0">
                          <label class="form-label" for="maxEnergyConsumption">Max energy consumption</label>
                          <Field v-model="this.currentDevice.maxEnergyConsumption" type="text" name="maxEnergyConsumption" class="form-control  form-control-sm" />
                          <ErrorMessage name="maxEnergyConsumption" class="error-feedback" />

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
import DeviceService from '@/services/device.service';
import AdminService from '@/services/admin.service';

export default {
  name: "UpdateDevice",
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
      description: yup
        .string()
        .required("Description is required!"),
      maxEnergyConsumption: yup
        .number()
        .required("Maximum energy consumption is required!")
    
    });

    return {
      successful: false,
      loading: false,
      message: "",
      schema,
      currentDevice: ""
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
    selectedDeviceId() {
      return JSON.parse(localStorage.getItem('deviceToUpdateId'));
    }
  },
  methods: {
    handleEdit() {
      this.message = "";
      this.successful = false;
      this.loading = true;
     // this.currentDoctor.location = this.selectedLocation;

      console.log("Sunt in handleEdit")

      AdminService.updateDevice(this.currentDevice).then(
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
    DeviceService.getDeviceData(this.selectedDeviceId).then(
      (respone) => {
        console.log(respone.data)
        this.currentDevice = respone.data
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