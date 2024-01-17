<template>
  <br>
  <br>
  <div v-if="message" class="alert alert-success">
    {{ message }}
  </div>
  <div class="cont">
  
  <div  class="header">
    <h2 class="title">Map client to device</h2>
  </div>

  <hr class="divider">
    <Form  @submit="handleMapping" :validation-schema="schema" class="mx-1 mx-md-4">
      <div v-if="!successful">

        <div class="d-flex flex-row align-items-center mb-4">
          <i class="fas fa-user fa-lg me-3 fa-fw"></i>
          <div class="form-outline flex-fill mb-0">
         
            <Field type="text" name="user_id" class="form-control  form-control-sm" placeholder="Client ID"/>
            <ErrorMessage name="user_id" class="error-feedback" />

          </div>
        </div>

        <div class="d-flex flex-row align-items-center mb-4">
          <i class="fas fa-user fa-lg me-3 fa-fw"></i>
          <div class="form-outline flex-fill mb-0">
            <Field type="text" name="device_id" class="form-control  form-control-sm" placeholder="Device ID" />
            <ErrorMessage name="device_id" class="error-feedback" />
          </div>
        </div>
        </div>
        <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
          <button role="button" class="button-222">
            Map
          </button>
        </div>
      </Form>
   
    
  </div>
  <div class="form-group">
    <div v-if="message" class="alert alert-danger" role="alert">
      {{ message }}
    </div>
  </div>
  
  <br>
  <br>
</template>


<script>
import AdminService from "../services/admin.service";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
export default {
  name: "AddMapping",

  components:{
    Form,
    Field,
    ErrorMessage,
  },

  data() {
    const schema = yup.object().shape({
      user_id: yup
        .string()
        .required("Client ID is required!"),
      device_id: yup
        .string()
        .required("Device ID is required!"),     
    });
    return {
      successful: false,
      loading: false,
      message: "",
      schema
    };
  },
  computed: {
   /* currentUser() {
      return JSON.parse(localStorage.getItem("user"));
    }*/
  },
  methods: {
    deleteSelectedDevice(id){
      console.log("Delete device before service call  " + id);
      AdminService.deleteDevice(id).then(
        () => {
          this.message = "Device successfully deleted!";
          this.refreshTable();
        }
      )
    },
    handleMapping(mapping){
      this.message = "";
      this.successful = false;
      this.loading = true;
      console.log(mapping);
     AdminService.createMapping(mapping).then(
        (data) => {
          this.message = data.message;
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
  mounted() {
  }
}

</script>
<style>
@import url(../assets/styles/delete_button.css);
@import url(../assets/styles/cancel_button.css);
@import url(../assets/styles/update_button.css);

.title {
  font-family: "Roboto Slab", serif;
  font-style:bold;
  font-stretch: condensed;
  font-size: 30px;
  color:  #006554 !important; 
  text-align: left;
  margin-left: 100px;
  margin-top: 25px;
}
.bg-danger {
  background-color:#a5e1d9 !important;
  color: white;
}
.bg-notdanger {
  background-color:white !important;
  color: black;
}
.cont {
  max-width: 450px;
  max-height: 300px;
  text-align: center;
  margin: 0 auto;
  padding: 15px;
  border: 0.5px solid #ccc;
  background-color: #fff;
  box-shadow: 15px 15px 15px rgba(121, 138, 121, 0.2);
  border-radius: 10px; /* Add border radius for rounded corners */
}

.header {
  text-align: center; /* Center-align the header */
  margin-bottom: 20px; /* Add some space below the header */
}

.title {
  font-size: 24px;
  color: #006554; /* Set the title color */
}



.form-container {
  margin: 0 auto; /* Center the form within the container */
}

.message-container {
  margin-top: 20px; /* Add space above the message container */
  text-align: center; /* Center-align the messages */
}
</style>