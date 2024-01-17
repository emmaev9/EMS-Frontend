<template>
  <br>
  <br>
  
  <div  class="container col-14">
    <h2 class="title" style="bold">Clients</h2>
  </div>
  <div class="container col-14">
    
    <hr style="height:1px;border-width:0;color:gray;background-color:gray">
    <div v-if="message" class="alert alert-success">
      {{ message }}
    </div>
    <button @click="registerClient()" class="button-222" role="button">Add new client</button>
    <div>
      <br>
      <table class="table table-striped table-bordered shadow-lg table-sm border-top">
        <thead>
          <tr>
            <th class="bg-danger bg-gradient">ID</th>
            <th class="bg-danger bg-gradient">Name</th>
            <th class="bg-danger bg-gradient">Age</th>
            <th class="bg-danger bg-gradient">Address</th>
            <th class="bg-danger bg-gradient">Email</th>

            <th class="bg-danger bg-gradient">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in clients" :key="item.id">
            <td class="bg-notdanger "> {{ item.id }}</td>
            <td class="bg-notdanger "> {{ item.name }}</td>
            <td class="bg-notdanger "> {{ item.age }}</td>
            <td class="bg-notdanger "> {{ item.address }}</td>
            <td class="bg-notdanger "> {{ item.email }}</td>
            <td>
              <button @click="deleteSelectedClient(item.id)" class="button-222" role="button">Delete</button>
              
              <button @click="updateSelectedClient(item.id)" class="button-222" role="button">Update</button>
            
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
  name: "ClientsList",

  data() {
    return {
      successful: false,
      loading: false,
      clients: "",
      message: "",

    };
  },
  computed: {
    currentUser() {
      return JSON.parse(localStorage.getItem("user"));
    }
  },
  methods: {
    deleteSelectedClient(id){
      console.log("Delete client before service call  " + id);
      AdminService.deleteClient(id).then(
        () => {
          this.message = "Client successfully deleted!";
          this.refreshTable();
        }
      )
    },
    registerClient(){
      this.$router.push("/RegisterClient");
    },
    updateSelectedClient(id) {
      console.log("Update client before service call  " + id);
      localStorage.setItem('clientToUpdateId', JSON.stringify(id));
      this.$router.push("/UpdateClientAccount");
    },
    refreshTable() {
      AdminService.getAllClients().then(
        (response) => {
          console.log(response.data);
          this.clients = response.data;
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
  background-color:#a5e1d9 !important;
  color: white;
}
.bg-notdanger {
  background-color:white !important;
  color: black;
}
</style>