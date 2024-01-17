<template>
  <div class="container">
    <header class="jumbotron">
    
    <br>
    <br>
    </header>
    <body>
      <UserDevicesList />
    </body>
  
  </div>
</template>

<script>

import UserService from "../services/user.service.js";
import UserDevicesList from "@/components/UserDevicesList.vue";
//import { ref } from "vue";
export default {
  
  data() {
    return {
      count: 0,
      refreshTable: false,
      content: "",
    }
  },
  methods:{
    getResult(value){
      console.log(value);
      this.rezz = value;
      }
    },
    refresh(value){
      console.log(value);
      this.refreshTable = value;
    },
  
  components: {
    UserDevicesList

  },
  name: "ClientHomeView",
  mounted() {
    UserService.getClientHome().then(
      (response) => {
        this.content = response.data;
      },
      (error) => {
        this.content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      }
    );
  },
};


</script>
<style>


</style>