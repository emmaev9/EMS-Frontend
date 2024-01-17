<template>
  <br>
  <br>
  <div v-if="message" class="alert alert-success">
    {{ message }}
  </div>
  <div  class="container col-14">
    <h2 class="title">Client-Device mappings</h2>
  </div>

  <div class="container col-14">
    <hr style="height:1px;border-width:2;color:gray;background-color:gray"/>
    
    <div>
      <table class="table table-striped table-bordered shadow-lg table-sm border-top">
        <thead>
          <tr>
           
            <th class="bg-danger bg-gradient">Client id</th>
            <th class="bg-danger bg-gradient">Device id</th>
            <th class="bg-danger bg-gradient">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in mappings" :key="item.id">
           
            <td class="bg-notdanger "> {{ item.user_id }}</td>
            <td class="bg-notdanger "> {{ item.device_id }}</td>
            <td>
              <button @click="deleteSelectedMapping(item.id)" class="button-222" role="button">Delete</button>
              
              <button @click="updateSelectedMapping(item.id)" class="button-222" role="button">Update</button>
            
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
<!--  <router-link to="/RegisterClient" class="nav-link">
   <button class="button-333" role="button">Add new client</button>
  </router-link>  -->
  <br>
  <br>
</template>

<script>
import AdminService from "../services/admin.service";

export default {
  name: "DeviceClientMapping",

  data() {
    return {
      successful: false,
      loading: false,
      mappings: "",
      message: "",

    };
  },
  computed: {
   /* currentUser() {
      return JSON.parse(localStorage.getItem("user"));
    }*/
  },
  methods: {
    deleteSelectedMapping(id){
      console.log("Delete mapping before service call  " + id);
      AdminService.deleteMapping(id).then(
        () => {
          this.message = "Mapping successfully deleted!";
          this.refreshTable();
        }
      )
    },
    
    updateSelectedMapping(id) {
      console.log("Update device before service call  " + id);
      localStorage.setItem('deviceToUpdateId', JSON.stringify(id));
      //this.$router.push("/UpdateMapping");
    },
    refreshTable() {
      AdminService.getAllMappings().then(
        (response) => {
          console.log(response.data);
          this.mappings = response.data;
        },
        (error) => {
          this.content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      )
    }
  },
  mounted() {
    this.refreshTable();
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
  margin-left: 20px;
  margin-top: 25px;
}
.bg-danger {
  background-color:#a5e1ba !important;
  color: white;
}
.bg-notdanger {
  background-color:white !important;
  color: black;
}
</style>