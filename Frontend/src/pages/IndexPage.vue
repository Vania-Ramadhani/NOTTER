<template>
  <q-page style="background-color: #FAF9F6;">
    <q-header
      elevated
      style="
        background: #03431b;
        backdrop-filter: blur(100px);
        -webkit-backdrop-filter: blur(100px);
        border-bottom: 1px solid rgba(80, 155, 57, 0.6);
        height: 70px;"
      class="shadow-5 rounded-borders"
    >
      <q-toolbar>
        <q-btn-dropdown
          flat
          round
          dense
          icon="menu"
          color="primary"
          class="q-mr-sm"
        >
          <q-list>
            <q-item clickable v-close-popup @click="onItemClick">
              <q-item-section>
                <q-item-label>about</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="onItemClick">
              <q-item-section>
                <q-item-label>setting</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <div class="header-text">
          <div class="title">NOTTER</div>
          <div class="caption">by ROMANTSA</div>
        </div>

        <q-space />

        <q-avatar>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9NiJj6rLahnvZLw4T-CAvII5SLkuBrcfG4A&s">
        </q-avatar>

        <div class="header-text2">
          <div class="mandu">MAN 2</div>
          <div class="mandu2">KOTA MALANG</div>
        </div>
      </q-toolbar>
    </q-header>

    <div class="container">
      <div class="column">
        <!-- Temperature Gauge -->
        <div class="suhu">
          <span class="label">Suhu</span>
          <q-knob
            v-model="temperature"
            show-value
            size="100px"
            :min="0"
            :max="100"
            color="primary"
            track-color="grey-3"
            class="q-ma-md"
            :disabled="isLoading"
          >
            <span class="gauge-value">{{ isLoading ? 'Loading...' : temperature + '°C' }}</span>
          </q-knob>
          <span class="cornertl">🌡️</span>
        </div>

        <!-- Humidity Gauge -->
        <div class="kelembapan">
          <span class="label">Kelembapan</span>
          <q-knob
            v-model="humidity"
            show-value
            size="100px"
            :min="0"
            :max="100"
            color="blue"
            track-color="grey-3"
            class="q-ma-md"
            :disabled="isLoading"
          >
            <span class="gauge-value">{{ isLoading ? 'Loading...' : humidity + '%' }}</span>
          </q-knob>
          <span class="cornertr">💧</span>
        </div>

        <!-- Waste Weight Text -->
        <div class="beratsampah">
          <span class="label">Berat Sampah</span>
          <span class="text-value">{{ isLoading ? 'Loading...' : wasteWeight !== null ? wasteWeight + ' kg' : 'N/A' }}</span>
          <span class="cornertm">🦾</span>
        </div>
      </div>

      <div class="column">
        <div class="status">STATUS: COOLING</div>
      </div>
    </div>

    <div class="slogan">WITH NOTTER, NOTHINGS WASTED, MAKES COMPOSTER EASIER</div>

    <!-- Error Notification -->
    <q-dialog v-model="showError">
      <q-card>
        <q-card-section>
          <div class="text-h6">Error</div>
        </q-card-section>
        <q-card-section>
          {{ errorMessage }}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { io } from 'socket.io-client';
import axios from 'axios';

// Reactive variables for sensor data
const temperature = ref(0);
const humidity = ref(0);
const wasteWeight = ref(null); // Initialize as null for no data
const isLoading = ref(true); // Loading state
const showError = ref(false); // Error dialog visibility
const errorMessage = ref(''); // Error message

// Backend API base URL
const API_BASE_URL = 'http://10.234.188.229:3000'; // Update if backend runs elsewhere

// Initialize Socket.io
const socket = io(API_BASE_URL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Fetch initial sensor data
const fetchInitialData = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(`${API_BASE_URL}/api/sensors/latest`);
    console.log('Initial data response:', response.data); // Debug log
    response.data.forEach((item) => {
      if (item.type === 'temperature') {
        temperature.value = item.value;
        console.log('Set temperature:', item.value);
      } else if (item.type === 'humidity') {
        humidity.value = item.value;
        console.log('Set humidity:', item.value);
      } else if (item.type === 'waste_weight') {
        wasteWeight.value = item.value;
        console.log('Set waste weight:', item.value);
      }
    });
  } catch (error) {
    errorMessage.value = 'Failed to fetch initial sensor data. Please check the backend connection.';
    showError.value = true;
    console.error('Error fetching initial sensor data:', error);
  } finally {
    isLoading.value = false;
  }
};

// Listen for real-time updates
socket.on('connect', () => {
  console.log('Connected to Socket.io server');
});

socket.on('sensorUpdate', (data) => {
  console.log('Received sensorUpdate:', data); // Debug log
  if (data.type === 'temperature') {
    temperature.value = data.value;
    console.log('Updated temperature:', data.value);
  } else if (data.type === 'humidity') {
    humidity.value = data.value;
    console.log('Updated humidity:', data.value);
  } else if (data.type === 'waste_weight') {
    wasteWeight.value = data.value;
    console.log('Updated waste weight:', data.value);
  }
});

socket.on('connect_error', (error) => {
  errorMessage.value = 'Failed to connect to real-time updates. Retrying...';
  showError.value = true;
  console.error('Socket.io connection error:', error);
});

socket.on('disconnect', () => {
  console.log('Disconnected from Socket.io server');
});

// Fetch data when component mounts
onMounted(async () => {
  await fetchInitialData();
});

// Clean up Socket.io on component unmount
onUnmounted(() => {
  socket.disconnect();
});

function onItemClick() {
  console.log('menu item clicked');
}
</script>

<style scoped>
.header-text {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  margin-top: 0px;
  margin-right: 50px;
}

.header-text2 {
  display: flex;
  flex-direction: column;
  margin-right: 12px;
  margin-top: 0px;
  margin-left: 5px;
}

.title {
  font-size: 19px;
  font-weight: 700;
  margin-top: 7px;
  margin-bottom: 0px;
  margin-left: 10px;
  margin-right: 50px;
}

.caption {
  font-size: 10px;
  font-weight: 400;
  margin-top: -7px;
  margin-bottom: 7px;
  margin-left: 10px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-style: italic;
  margin-right: 50px;
}

.mandu {
  font-size: 19px;
  font-weight: 700;
  margin-top: 7px;
  margin-bottom: 0px;
  margin-left: 10px;
}

.mandu2 {
  font-size: 10px;
  font-weight: 400;
  margin-top: -7px;
  margin-bottom: 7px;
  margin-left: 10px;
}

.container {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 29px;
  justify-content: flex-start;
  border-color: #03431b;
}

.column {
  display: flex;
  gap: 20px;
  flex-direction: column;
  flex: 1;
  border-color: #03431b;
}

.suhu,
.kelembapan,
.beratsampah {
  position: relative;
  font-size: 16px;
  border: 2px solid;
  border-color: #749b40 !important;
  padding: 8px;
  border-radius: 0px;
  background-color: #ffffff;
  width: 40vw;
  margin-left: 35px;
  margin-top: 30px;
  margin-right: 35px;
  box-shadow: 5px 4px rgba(10, 10, 10, 0.1);
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.kelembapan,
.beratsampah {
  margin-top: 10px;
}

.cornertl,
.cornertr,
.cornertm {
  position: absolute;
  font-size: 30px;
  z-index: 99999;
  top: -20px;
  right: -15px;
}

.label {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.gauge-value {
  font-size: 16px;
  font-weight: 500;
}

.text-value {
  font-size: 20px;
  font-weight: 600;
  color: #03431b;
}

.status {
  text-align: center;
  line-height: 160px;
  font-weight: 400;
  vertical-align: middle;
  font-size: 25px;
  border: 2px solid;
  padding: 8px;
  border-radius: 0px;
  background-color: #ffffff;
  border-color: #749b40 !important;
  width: 40vw;
  height: 20.4vw;
  margin-left: 35px;
  margin-right: 35px;
  margin-top: 30px;
  box-shadow: 8px 10px rgba(10, 10, 10, 0.1);
  flex: 1;
}

.slogan {
  margin-top: 150px;
  text-align: center;
  font-size: larger;
  font-weight: 500;
  font-style: oblique;
}
</style>