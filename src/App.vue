<template>
  <div>

  </div>
 <div id="app">
    <nav class="navbar navbar-expand shadow fixed-top" style="background-color:white;">     

      <div v-if="this.currentUser" class="navbar-nav ml-auto">
        <div v-if="this.isAdmin" class="nav-item">
          <router-link to="/AdminHome" class="nav-link">
             Home 
          </router-link>
        </div>
        <div v-if="this.isClient" class="nav-item">
          <router-link to="/ClientHome" class="nav-link">
             Home
          </router-link>
       </div>

        <div class="nav-item">
          <router-link to="/ChatHome" class="nav-link">
             Chat
          </router-link>
        </div>

        <div class="navbar-nav ml-auto">
            <router-link @click="logOut()" to="/login" class="nav-link">
              Logout
            </router-link>
        </div>
      </div>

      <div v-if="!this.currentUser" class="nav-item">
        
          <router-link to="/login" class="nav-link">
             Login
          </router-link>
       
      </div>
       
      
    </nav>

    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>


export default {
  head: {
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0',
    },
  ],
},
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
      
    },
    isAdmin() {
      if (this.currentUser && this.currentUser['role']) {
        console.log(this.currentUser['role']);
        return this.currentUser['role'] == 'ADMIN';
      }
      return false;
    },
    isClient() {
      if (this.currentUser && this.currentUser['role']) {
        console.log(this.currentUser['role']);
        return this.currentUser['role'] == 'USER';
      }
      return false;
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  }
};
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffff;
}

.material-symbols-outlined {
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24
}


.bg-img{
  width: 100vh;
  height: 100vw;
  object-fit: contain;
  filter: brightness(0.6);
  top:0;
  left:0;
  z-index:-1;
  position: absolute
}
.navbar{
  height: 40px;
  font-size: 15px;
  font-weight: bold;
  background-color:#a5e1d9 !important;
  
  color:rgb(255, 254, 254);
  text-align: left;
  padding-left: 20px;
  padding-right: 20px;
  opacity: 0.9;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  /*
  .button {
    background-color: #007BFF;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    text-transform: uppercase;
  }
  .button:hover {
    background-color: #0069D9;
  }
  .button:active {
    background-color: #0069D9;
    transform: translateY(2px);
  }
  .button:focus {
    outline: none;
  }
  .button:disabled {
    background-color: #0069D9;
    opacity: 0.5;
    cursor: not-allowed;
  }
  .button:not(:disabled):active {
    transform: translateY(2px);
  }  
*/
}
</style>