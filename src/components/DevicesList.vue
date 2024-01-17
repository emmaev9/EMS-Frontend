<template>
  
  
    <div class="container col-14">
      <h2 class="title">Devices</h2>
    </div>

    <div class="container col-14">
      <hr style="height: 1px; border-width: 0; color: gray; background-color: gray" />
      <div v-if="message" class="alert alert-success">
        {{ message }}
      </div>
      <button @click="registerDevice()" class="button-222" role="button">Add new device</button>
      <hr>
      <div>
        <table class="table table-striped table-bordered shadow-lg table-sm border-top">
          <thead>
            <tr>
              <th class="bg-danger bg-gradient">ID</th>
              <th class="bg-danger bg-gradient">Description</th>
              <th class="bg-danger bg-gradient">Address</th>
              <th class="bg-danger bg-gradient">Max Energy Consumption</th>
              <th class="bg-danger bg-gradient">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in devices" :key="item.id">
              <td class="bg-notdanger">{{ item.id }}</td>
              <td class="bg-notdanger">{{ item.description }}</td>
              <td class="bg-notdanger">{{ item.address }}</td>
              <td class="bg-notdanger">{{ item.maxEnergyConsumption }}</td>
              <td>
                <button @click="deleteSelectedDevice(item.id)" class="button-222" role="button">Delete</button>
                <button @click="updateSelectedDevice(item.id)" class="button-222" role="button">Update</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <br>
    <br>
  

  <div>
   
    <div class="container col-14">
      <h2 class="title">Client-Device mappings</h2>
    </div>

    <div class="container col-14">
      <hr style="height: 1px; border-width: 0; color: gray; background-color: gray" />
      <div v-if="message2" class="alert alert-success">
        {{ message2 }}
      </div>
      <div>
        <table class="table table-striped table-bordered shadow-lg table-sm border-top">
          <thead>
            <tr>
              <th class="bg-danger bg-gradient">Client id</th>
              <th class="bg-danger bg-gradient">Device id</th>
              <th class="bg-danger bg-gradient">Client email</th>
              <th class="bg-danger bg-gradient">Client address</th>
              <th class="bg-danger bg-gradient">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in mappings" :key="item.id">
              <td class="bg-notdanger">{{ item.user_id }}</td>
              <td class="bg-notdanger" v-if="item.editMode">
                <input v-model="item.updatedDeviceId" />
              </td>
              <td class="bg-notdanger" v-else>{{ item.device_id }}</td>
              <td class="bg-notdanger">{{ item.email }}</td>
              <td class="bg-notdanger">{{ item.address }}</td>
              <td>
                <button @click="deleteSelectedMapping(item.user_id)" class="button-222" role="button">Delete</button>
                <button @click="toggleEditMode(item)" class="button-222" role="button">{{ item.editMode ? "Save" : "Edit" }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <br>
    <br>
  </div>

  
</template>

<script>
import AdminService from "../services/admin.service";

export default {
  name: "DevicesList",

  data() {
    return {
      successful: false,
      loading: false,
      devices: "",
      mappings: "",
      message: "",
      message2: "",
    };
  },
  methods: {
    deleteSelectedDevice(id) {
      console.log("Delete device before service call " + id);
      AdminService.deleteDevice(id).then(() => {
        this.message = "Device successfully deleted!";
        this.refreshTable();
        this.refreshTable1();
      });
    },
    registerDevice() {
      this.$router.push("/RegisterDevice");
      this.refreshTable();
    },
    updateSelectedDevice(id) {
      console.log("Update device before service call " + id);
      localStorage.setItem('deviceToUpdateId', JSON.stringify(id));
      this.$router.push("/UpdateDevice");
    },
    refreshTable() {
      AdminService.getAllDevices().then(
        (response) => {
          this.devices = response.data;
        },
        (error) => {
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
    deleteSelectedMapping(id) {
      console.log("Delete mapping before service call " + id);
      AdminService.deleteMapping(id).then(() => {
        this.message2 = "Mapping successfully deleted!";
        this.refreshTable1();
      });
    },
    updateSelectedMapping(id) {
      console.log("Update device before service call " + id);
      localStorage.setItem('deviceToUpdateId', JSON.stringify(id));
      // this.$router.push("/UpdateMapping");
    },
    refreshTable1() {
      AdminService.getAllMappings().then(
        (response) => {
          this.mappings = response.data;
        },
        (error) => {
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
    toggleEditMode(item) {
      if (item.editMode) {
        // Save the updated device_id and exit edit mode
        console.log("Update mapping before service call " + item.id + " " + item.device_id + " " + item.updatedDeviceId);
        AdminService.updateSelectedMapping(item.id, item.updatedDeviceId).then(
          () => {
            this.message2 = "Mapping successfully updated!";
            this.refreshTable1();
          },
          (error) => {
            console.log("Error in updateSelectedMapping: " + error);
          this.message2 =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
        );
        // Make an API call to save the changes to the server if needed
        item.editMode = false;
      } else {
        // Enter edit mode
        item.updatedDeviceId = item.device_id; // Initialize the updatedDeviceId with the current device_id
        item.editMode = true;
      }
    },
  },
  mounted() {
    this.refreshTable();
    this.refreshTable1();
  },
};
</script>

<style>
@import url(../assets/styles/delete_button.css);
@import url(../assets/styles/cancel_button.css);
@import url(../assets/styles/update_button.css);

.title {
  font-family: "Roboto Slab", serif;
  font-style: bold;
  font-stretch: condensed;
  font-size: 30px;
  color: #006554 !important;
  text-align: left;
  margin-left: 20px;
  margin-top: 25px;
}

.bg-danger {
  background-color: #a5e1d9 !important;
  color: white;
}

.bg-notdanger {
  background-color: white !important;
  color: black;
}
</style>
