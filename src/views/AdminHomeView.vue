<template>
  <div class="container">
    <header class="jumbotron">
      <ClientList />
      <DeviceList />
  
      <AddMapping />
    </header>
  </div>
</template>

<script>
import UserService from "../services/user.service";
import ClientList from "../components/ClientsList.vue";
import DeviceList from "../components/DevicesList.vue";
import AddMapping from "../components/AddMapping.vue";
//import DeviceClientMapping from "@/components/DeviceClientMapping.vue";
export default {
  name: "AdminHomeView",
  components: {
    ClientList,
    DeviceList,
    AddMapping,
   // DeviceClientMapping
},
  data() {
    return {
      content: "",
    };
  },
  mounted() {
    UserService.getAdminHome().then(
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
