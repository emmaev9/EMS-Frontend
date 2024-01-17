<template>
  <section class="vh-100" style="background-color:white;">
    <div class="container h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-lg-6 col-sm-9">
          <div class="card text-black  shadow-lg p-3 mb-5 bg-white rounded">
            <div class="card-body">
              <div class="row justify-content-center">
                <div class="col-md-10">

                  <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Register a new device</p>

                  <Form @submit="handleReg" :validation-schema="schema" class="mx-1 mx-md-4">
                    <div v-if="!successful">

                      <div class="d-flex flex-row align-items-center mb-4">
                        <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div class="form-outline flex-fill mb-0">
                          <label class="form-label" for="description">Description</label>
                          <Field type="text" name="description" class="form-control  form-control-sm" />
                          <ErrorMessage name="description" class="error-feedback" />

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
                          <label class="form-label" for="maxEnergyConsumption">Max Energy Consumption</label>
                          <Field type="text" name="maxEnergyConsumption" class="form-control  form-control-sm" />
                          <ErrorMessage name="maxEnergyConsumption" class="error-feedback" />
                        </div>
                      </div>

                      <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button class="button-222" role="button">
                          Save device
                        </button>
                      </div>
                    </div>

                  </Form>

                  <div v-if="message" class="alert" :class="successful ? 'alert-success' : 'alert-danger'">
                    {{ message }}
                    <div>
                      <router-link to="/AdminHome">
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
import { Form, Field, ErrorMessage } from "vee-validate";
import AdminService from "@/services/admin.service";
//import Dropdown from "primevue/dropdown";
import * as yup from "yup";

export default {
  name: "RegisterDevice",
  components: {
   Form,
    Field,
    ErrorMessage,
    //Dropdown,
  },
  data() {
    const schema = yup.object().shape({
      description: yup
        .string()
        .required("Description is required!"),
      address: yup
        .string()
        .required("Address is required!"),
      maxEnergyConsumption: yup
        .number()
        .required("Maximum energy consumption is required!")
     
    });

    return {
      successful: false,
      loading: false,
      message: "",
      schema,
    };
  },
  methods: {
   
    handleReg(device) {
      this.message = "";
      this.successful = false;
      this.loading = true;
      console.log(device);
     AdminService.registerDevice(device).then(
        () => {
          this.message = "DEVICE CREATED!";
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