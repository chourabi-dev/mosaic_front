<template>
  <div class="step-2 participate">
    <Loader v-if="loading" />
    <div class="col-12">
      <div v-if="profile && profile.code === 401" class="alert alert-warning">
        Vous avez déja participé !
      </div>
    </div>
    <img ref="img" class="d-none" :src="capture" height="800" width="800" />
    <div
      class="d-flex justify-content-center col-12 mb-3 animate__animated animate__bounceIn"
      v-if="showImg && !cropImg && img"
    >
      <img height="250" :src="img" alt="img" />
    </div>
    <div
      class="d-flex justify-content-center col-12 mb-3 animate__animated animate__bounceIn"
      v-if="showImg && cropImg"
    >
      <cropper
        :src="img"
        @change="changeCropper"
        :stencil-props="{
          handlers: {},
          movable: false,
          scalable: false
        }"
        :stencil-size="{
          width: 400,
          height: 400
        }"
        default-boundaries="fill"
        image-restriction="stencil"
      />
    </div>
    <miniLoader v-if="loader" />
    <div
      class="col-12 animate__animated"
      :class="
        showVideo ? 'd-block animate__bounceIn' : 'd-none animate__bounceOut'
      "
    >
      <div class="videos">
        <video ref="video" id="video" autoplay></video>
        <canvas ref="canvas" id="canvas" width="800" height="800"></canvas>
      </div>
      <div class="video-btn">
        <button
          type="button"
          class="bttn-jelly bttn-md bttn-primary mt-2"
          id="snap"
          @click.prevent="addCapture"
        >
          Valider
        </button>
        <button
          type="button"
          @click.prevent="cancelVideo"
          class="bttn-jelly bttn-md bttn-primary mt-2"
        >
          Fermer
        </button>
      </div>
    </div>
    <div
      class="col-12 animate__animated"
      v-if="!showImg"
      :class="
        showVideo || img
          ? 'd-none animate__bounceOut'
          : 'd-block animate__bounceIn'
      "
    >
      <div class="photo webcam" @click="addVideo">
        <div class="content">
          <div><i class="fa-camera fa-lg"></i></div>
          <h3>Prendre une photo</h3>
        </div>
      </div>
      <div class="photo upload" @click="browsePicture">
        <input
          type="file"
          ref="file"
          id="picture"
          style="display:none;"
          class="form-control"
          @change="fileChange"
        />
        <div class="content">
          <div><i class="fa-upload fa-lg"></i></div>
          <h3>Choisir une photo</h3>
        </div>
      </div>
    </div>
    <template v-if="showImg && img">
      <div class="col-12">
        <div class="form-group">
          <label for="msg" class="sr-only">Message</label>
          <textarea
            id="msg"
            v-model="msg"
            placeholder="Votre message (facultatif)"
            class="form-control"
            rows="2"
          ></textarea>
        </div>
      </div>
      <div class="col-12">
        <button
          :disabled="disableStepTwo"
          type="submit"
          @click.prevent="createProfile"
          variant="success"
          size="sm"
          class="mt-2 bttn-pill bttn-md bttn-success bttn-block"
          :class="disableStepTwo ? 'disabled' : ''"
        >
          Valider
        </button>
        <button
          type="button"
          @click="resetImg"
          class="mt-2 bttn-pill bttn-md bttn-primary bttn-block"
        >
          Annuler
        </button>
      </div>
    </template>
  </div>
</template>
<script>
import Loader from "@/components/Loader.vue";
import miniLoader from "@/components/miniLoader.vue";
import { Cropper } from "vue-advanced-cropper";
import { mapGetters } from "vuex";
export default {
  components: {
    Cropper,
    Loader,
    miniLoader
  },
  data() {
    return {
      user: {},
      showVideo: false,
      showImg: false,
      loader: false,
      capture: "",
      file: {},
      video: {},
      canvas: {},
      msg: "",
      cropImg: false,
      img: ""
    };
  },
  computed: {
    disableStepOne() {
      return JSON.parse(localStorage.getItem("user"));
    },
    disableStepTwo() {
      return this.disableStepOne && this.showImg ? false : true;
    },
    ...mapGetters(["loading", "profile"])
  },
  methods: {
    cancelVideo() {
      const mediaStream = this.video.srcObject;
      const tracks = mediaStream.getTracks();
      tracks[0].stop();
      this.showVideo = false;
      this.showImg = false;
      this.msg = "";
    },
    addVideo() {
      this.loader = true;
      this.video = this.$refs.video;
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
          if (stream.getVideoTracks().length > 0) {
            this.showImg = false;
            this.showVideo = true;
            this.video.srcObject = stream;
            this.loader = false;
          } else {
            this.loader = false;
          }
        });
      }
    },
    addCapture() {
      this.canvas = this.$refs.canvas;
      this.canvas.getContext("2d").drawImage(this.video, 0, 0, 800, 800);
      this.capture = this.canvas.toDataURL("image/jpg");
      this.img = this.canvas.toDataURL("image/jpg");
      this.showImg = true;
      this.cancelVideo();
    },
    browsePicture() {
      const file = this.$refs.file;
      file.click();
    },
    resetImg() {
      this.showImg = false;
      this.capture = {};
      this.cropImg = false;
      this.img = "";
      this.msg = "";
    },
    fileChange(event) {
      const file = event.target.files[0];
      this.canvas = this.$refs.canvas;
      const { type } = file;
      this.cropImg = true;
      if (type.indexOf("image/") > -1) {
        this.file = file;
        this.capture = this.canvas.toDataURL("image/jpg");
        this.img = URL.createObjectURL(this.file);
        this.showImg = true;
      } else {
        this.file = {};
        this.capture = {};
      }
    },
    async createProfile() {
      this.$store.commit("setLoading", true);
      this.canvas = this.$refs.canvas;
      this.canvas.getContext("2d").drawImage(this.$refs.img, 0, 0, 800, 800);
      this.capture = this.canvas.toDataURL("image/png");
      const profile = {
        nom: this.user.name + " " + this.user.firstName,
        email: this.user.email,
        message: this.msg,
        image: this.capture
      };
      const payload = {
        profile: profile,
        router: this.$router,
        id: this.$route.params.id
      };
      await this.$store.dispatch("createProfile", payload).then(() => {
        if (this.profile && this.profile.code) {
          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });
        } else {
          const { COLUMN_POS, ROW_POS } = this.profile;
          const POSITION = JSON.stringify({ col: COLUMN_POS, row: ROW_POS });
          localStorage.setItem("userImg", POSITION);
        }
      });
    },
    changeCropper({ canvas }) {
      this.capture = canvas.toDataURL("image/jpg");
    },
    initStep() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.name && user.firstName) {
        this.user = user;
      } else {
        this.$router.push({ name: "step1" });
      }
    }
  },
  mounted() {
    this.initStep();
  }
};
</script>
<style lang="scss" scoped>
.step-2 {
  position: relative;
}
.participate {
  width: 100%;
  .disabled {
    opacity: 0.6;
  }
}
#video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  margin: auto;
}
.videos {
  height: 222px;
  width: 100%;
}
.form-control {
  background-color: none;
}
.form-group {
  margin-bottom: 2rem;
}
.form-control {
  background-color: transparent;
  color: white;
  border-color: white;
}
::placeholder {
  color: white;
}
.video-btn {
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding: 5px;
  z-index: 999;
}

#canvas {
  display: none;
}
.show {
  display: block;
  background: rgba(0, 0, 0, 0.8);
}
.photo.webcam {
  margin-top: 0;
}
.photo {
  width: 100%;
  height: 50px;
  background: #f4f7fd;
  border: 1px dashed #ccc;
  cursor: pointer;
  display: flex;
  justify-content: center;
  margin-top: 25px;
}
.preview {
  border: 1px solid #ccc;
  height: 277px;
  background: #d9dce2;
  cursor: initial;
  .preview-content {
    height: 100%;
  }
}

.upload.disabled,
.webcam.disabled {
  pointer-events: none;
  opacity: 0.5;
  background: #ccc;
}
.full-width {
  width: 100%;
}
textarea {
  resize: none;
}
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  text-align: center;
  color: #737373;
  h3 {
    font-size: 14px;
    margin-top: 5px;
    margin-left: 10px;
  }
}
</style>
