<template>
  <div class="mosaic-container">
    <div class="mosaic-content">
      <div
        v-if="tiles && tiles.TITLE"
        class="head mt-1 d-flex justify-content-between"
      >
        <div class="logo-1">
          <img src="@/assets/images/150.png" width="img-fluid" />
        </div>
        <div class="title-mosaic-lg">
          <h1 class="">{{ tiles.TITLE }}</h1>
          <div class="button-flex">
            <button
              class="bttn-fill bttn-md bttn-particip"
              @click.prevent="createImage"
            >
              Participez !
            </button>
          </div>
        </div>
        <div class="logo-1">
          <img src="@/assets/images/150.png" width="img-fluid" />
        </div>
      </div>
      <div v-if="tiles && tiles.TITLE" class="title-mosaic-sm">
        <h1 class="">{{ tiles.TITLE }}</h1>
        <div class="button-flex">
          <button
            class="bttn-fill bttn-md bttn-particip"
            @click.prevent="createImage"
          >
            Participez !
          </button>
        </div>
      </div>
      <div   class="d-flex justify-content-between">
        <div id="toolbarDiv" class="toolbar">
          <div class="toolbar-items">
            <div class="d-flex">
              <button
                class="btn btn-ic  d-flex align-center"
                type="button"
                id="zoom-in"
              >
                <i class="fa-zoom-in "></i>
              </button>
              <button type="button" id="zoom-out" class="btn btn-ic  d-flex">
                <i class="fa-zoom-out "></i>
              </button>
              <button id="home" class="btn btn-ic d-flex">
                <i class="fa-home "></i>
              </button>
              <button id="full-page" class="btn btn-ic d-flex">
                <i class="fa-full "></i>
              </button>
            </div>
            <div></div>
          </div>
        </div>
        <div class="form-inline">
          <input
            placeholder="Recherche par nom et prénom"
            type="text"
            v-model="search"
            class="form-control"
          />
          <button
            type="button"
            @click.prevent="searchName"
            class="btn btn-primary btn-sm btn-search"
          >
            <i class="fa-search"></i>
          </button>
        </div>
      </div>
      <div id="mpocontener" class="mpocontener">
        <div id="mpocanvas" class="mpocanvas"></div>
      </div>
      <div id="central">
        <div
          class="casefocus"
          :class="showCase && user && user.email ? 'show' : ''"
          id="casefocus"
        >
          <img
            height="100%"
            width="100%"
            :src="require('@/assets/images/fondzoom.png')"
            alt="fond-zoom"
          />
          <div id="ctzoom">
            <button class="btn btn-outlined" @click="showModal">
              <i class="fa-zoom-in fa-lg"></i>
            </button>
          </div>
        </div>
        <User
          @closeOverlay="closeOverlay"
          class="casetext"
          id="casetext"
          :class="showCase && user && user.email ? 'show' : ''"
        />
      </div>
      <Social />
    </div>
    <div class="clearfix"></div>
    <UserModal @closeModal="closeModal" v-if="modal" />
    <div v-if="userSearchedExist" class="alert alert-warning fix-alert">
      Le participant que vous cherchez n'existe pas !
      <button
        type="button"
        class="close"
        @click="userSearchedExist = false"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import User from "@/components/User.vue";
import UserModal from "@/components/UserModal.vue";
import Social from "@/components/Social.vue";
import OpenSeadragon from "openseadragon/build/openseadragon/openseadragon";
export default {
  components: {
    User,
    UserModal,
    Social
  },
  data() {
    return {
      myDragon: null,
      spinner: false,
      search: "",
      showCase: false,
      showCreateModal: false,
      userSearchedExist: false,
      options: {
        id: "mpocanvas",
        debugMode: false,
        showNavigator: false,
        maxZoomPixelRatio: 1,
        wrapHorizontal: false,
        constrainDuringPan: true,
        autoResize: true,
        useCanvas: true,
        visibilityRatio: 1,
        defaultZoomLevel: 1,
        minZoomLevel: 1,
        zoomPerClick: 2.5,
        toolbar: "toolbarDiv",
        zoomInButton: "zoom-in",
        zoomOutButton: "zoom-out",
        homeButton: "home",
        fullPageButton: "full-page",
        nextButton: "next",
        previousButton: "previous",
        animationTime: 1.5,
        gestureSettingsTouch: {
          scrollToZoom: false,
          clickToZoom: true,
          dblClickToZoom: false,
          pinchToZoom: true,
          flickEnabled: true,
          flickMinSpeed: 120,
          flickMomentum: 0.25,
          pinchRotate: false,
          dragToPan: true
        },
        navigationControlAnchor: OpenSeadragon.ControlAnchor.TOP_LEFT
      },
      currentC: 1,
      currentL: 1,
      endDrag: false,
      is0: false,
      maxcol: 0,
      modal: false,
      data: {}
    };
  },
  computed: {
    ...mapGetters(["tiles", "user", "searchedUser"]),
    getFirstImg() {
      const { BASE64_BANNER } = this.tiles;
      return (
        "<image type='legacy-image-pyramid'><level url='" +
        BASE64_BANNER +
        "' height='1000' width='2000'/></image>"
      );
    }
  },
  methods: {
    canvasClick(caseWidth) {
      const self = this;
      const md = this.myDragon;
      this.myDragon.addHandler("canvas-click", function(event) {
        var zoom = md.viewport.getZoom();
        if (
          !self.endDrag &&
          md.world.getItemAt(0).viewportToImageZoom(zoom) >= 0.7
        ) {
          var viewportPoint = md.viewport.pointFromPixel(event.position);
          var imagePoint = md.world
            .getItemAt(1)
            .viewportToImageCoordinates(viewportPoint.x, viewportPoint.y);
          var col = Math.floor(parseInt(imagePoint.x) / caseWidth) + 1;
          var ligne = Math.floor(parseInt(imagePoint.y) / caseWidth + 1);
          self.displayOver(col, ligne);
          self.getTextOver(col, ligne);
          self.goPhoto(self.currentC, self.currentL);
          self.isO = true;
          self.showCase = true;
        }
        self.endDrag = false;
      });
    },
    canvasDragEnd() {
      const self = this;
      this.myDragon.addHandler("canvas-drag-end", function() {
        self.endDrag = true;
      });
    },
    zoom() {
      const md = this.myDragon;
      const self = this;
      md.addHandler("zoom", function() {
        var zoom = md.viewport.getZoom();
        if (md.world.getItemAt(1)) {
          if (md.world.getItemAt(1).viewportToImageZoom(zoom) < 0.9) {
            self.showCase = false;
          }
          if (zoom < 1.19) {
            md.world.getItemAt(1).setOpacity(0.3);
            md.world.getItemAt(0).setOpacity(1.0);
          } else {
            md.world.getItemAt(1).setOpacity(1);
            md.world.getItemAt(0).setOpacity(0);
          }
        }
      });
    },
    home() {
      const self = this;
      this.myDragon.addHandler("home", function() {
        self.isO = false;
        self.showCase = false;
      });
    },
    params() {
      OpenSeadragon.setString("Tooltips.FullPage", "Plein écran");
      OpenSeadragon.setString("Tooltips.Home", "Revenir vue large");
      OpenSeadragon.setString("Tooltips.ZoomIn", "Zoomer ");
      OpenSeadragon.setString("Tooltips.ZoomOut", "Dezoomer");
    },
    myDragonTracker(caseWidth) {
      const self = this;
      new OpenSeadragon.MouseTracker({
        element: "mpocanvas",
        moveHandler: function(event) {
          var viewportPoint = self.myDragon.viewport.pointFromPixel(
            event.position
          );
          var imagePoint = self.myDragon.world
            .getItemAt(1)
            .viewportToImageCoordinates(viewportPoint.x, viewportPoint.y);
          var col = Math.floor(parseInt(imagePoint.x) / caseWidth) + 1;
          var ligne = Math.floor(parseInt(imagePoint.y) / caseWidth + 1);
          if (col != self.currentC || ligne != self.currentL) {
            var overlay = self.myDragon.getOverlayById("caseborder");
            var area = self.myDragon.world
              .getItemAt(1)
              .imageToViewportRectangle(
                (col - 1) * caseWidth,
                (ligne - 1) * caseWidth,
                caseWidth,
                caseWidth
              );
            overlay.update(area, OpenSeadragon.Placement.CENTER);
            self.myDragon.forceRedraw();
            self.currentC = col;
            self.currentL = ligne;
          }
        }
      });
    },
    initMyDragon(caseWidth) {
      this.params();
      this.addTileSource();
      this.myDragon = OpenSeadragon(this.options);
      this.myDragonTracker(caseWidth);
      this.canvasClick(caseWidth);
      this.canvasDragEnd();
      this.zoom();
      this.home();
      const { col, row } = this.$route.query;
      if (col && row) {
        setTimeout(() => {
          const self = this;
          self.showPerson(col, row, self);
        }, 2000);
      }
    },
    showPerson(col, row, self) {
      if (self) {
        self.goPhotoUser(col, row);
        self.showCase = true;
        self.isO = true;
      } else {
        this.goPhotoUser(col, row);
        this.showCase = true;
        this.isO = true;
      }
    },
    displayOver(col, ligne) {
      const md = this.myDragon;
      this.currentC = col;
      this.currentL = ligne;
      var overlay = md.getOverlayById("casefocus");
      var area = md.world
        .getItemAt(1)
        .imageToViewportRectangle(
          (this.currentC - 1) * this.tiles.THUMBNAIL_SIZE,
          (this.currentL - 1) * this.tiles.THUMBNAIL_SIZE,
          this.tiles.THUMBNAIL_SIZE,
          this.tiles.THUMBNAIL_SIZE
        );
      overlay.update(area, OpenSeadragon.Placement.CENTER);
      var overlay2 = md.getOverlayById("casetext");
      if (this.currentC > this.maxcol - 3) {
        var area2 = md.world
          .getItemAt(1)
          .imageToViewportCoordinates(
            (this.currentC - 1) * this.tiles.THUMBNAIL_SIZE - 5,
            (this.currentL - 1) * this.tiles.THUMBNAIL_SIZE
          );
        overlay2.update(area2, OpenSeadragon.Placement.RIGHT);
      } else {
        let area2 = md.world
          .getItemAt(1)
          .imageToViewportCoordinates(
            this.currentC * this.tiles.THUMBNAIL_SIZE,
            (this.currentL - 1) * this.tiles.THUMBNAIL_SIZE
          );
        overlay2.update(area2, OpenSeadragon.Placement.LEFT);
      }
      md.forceRedraw();
    },
    goPhoto(col, ligne) {
      this.currentC = col;
      this.currentL = ligne;
      var zoomArea = this.myDragon.world
        .getItemAt(1)
        .imageToViewportRectangle(
          (col - 1) * this.tiles.THUMBNAIL_SIZE,
          (ligne - 1) * this.tiles.THUMBNAIL_SIZE,
          this.tiles.THUMBNAIL_SIZE,
          this.tiles.THUMBNAIL_SIZE
        );
      this.myDragon.viewport.fitBoundsWithConstraints(zoomArea);
    },
    goPhotoUser(col, ligne) {
      this.currentC = col;
      this.currentL = ligne;
      this.goPhoto(col, ligne);
      this.getTextOver(col, ligne);
      this.displayOver(col, ligne);
    },
    getTextOver(col, ligne) {
      this.data = {
        col: col,
        row: ligne,
        id: this.$route.params.id
      };
      this.$store.dispatch("getUser", this.data);
    },
    closeOverlay(close) {
      this.data = {};
      this.$store.dispatch("getUser", {});
      this.showCase = close;
      this.is0 = false;
      this.myDragon.forceRedraw();
    },
    closeModal(close) {
      this.modal = close;
      this.showCase = close;
    },
    showModal() {
      this.modal = true;
      const payload = {
        col: this.currentC,
        row: this.currentL,
        id: this.$route.params.id
      };
      this.$store.dispatch("getUser", payload);
    },
    addTileSource() {
      if (this.tiles) {
        const id = this.$route.params.id;
        const { COLUMNS, ROWS, THUMBNAIL_SIZE } = this.tiles;
        this.maxcol = COLUMNS;
        const tileSources = [
          {
            x: 0,
            y: 0,
            opacity: 0,
            tileSource: this.getFirstImg,
            buildPyramid: false
          },
          {
            x: 0,
            y: 0,
            width: COLUMNS * THUMBNAIL_SIZE,
            height: ROWS * THUMBNAIL_SIZE,
            tileSize: THUMBNAIL_SIZE,
            minLevel: 17,
            maxLevel: 20,
            buildPyramid: false,
            getTileUrl(level, x, y) {
              const img = `${process.env.VUE_APP_ENV}/${id}/L${level}/C${x +
                1}L${y + 1}.png`;
              return img;
            }
          }
        ];
        const overlays = [
          {
            id: "caseborder",
            x: 0,
            y: 0,
            width: 1 / this.maxcol,
            height: 1 / this.maxcol,
            className: "caseborder"
          },
          {
            id: "casetext",
            x: 0,
            y: 0,
            className: "casetext",
            checkResize: false
          },
          {
            id: "casefocus",
            x: 0,
            y: 0,
            width: 1 / this.maxcol,
            height: 1 / this.maxcol,
            className: "casefocus"
          }
        ];
        this.options.tileSources = tileSources;
        this.options.overlays = overlays;
      }
    },
    createImage() {
      this.$router.push({ name: "Home" });
    },
    hideCreateModal(hide) {
      this.showCreateModal = hide;
    },
    async getTiles() {
      this.$store.commit("setLoading", true);
      const id = this.$route.params.id;
      await this.$store.dispatch("getTiles", id).then(() => {

        console.log(this.tiles);
        this.$store.commit("setLoading", false);

        this.initMyDragon(this.tiles.THUMBNAIL_SIZE);
        
      });
    },
    async searchName() {
      this.spinner = true;
      if (this.search !== "") {
        const id = this.$route.params.id;
        const payload = { id: id, search: this.search };
        await this.$store.dispatch("filterByName", payload).then(() => {
          this.spinner = false;
          if (this.searchedUser && this.searchedUser.nom) {
            this.userSearchedExist = false;
            const { ROW_POS, COLUMN_POS } = this.searchedUser;
            this.showPerson(COLUMN_POS, ROW_POS, this);
          } else {
            this.userSearchedExist = true;
          }
        });
      }
    }
  },
  mounted() {
    this.getTiles();
  }
};
</script>
<style lang="scss" scoped>
.head,
.title-mosaic-sm {
  h1 {
    font-family: "Shadows Into Light", cursive;
    font-size: 2.5rem;
    color: white;
  }
  .logo-1 {
    width: 120px;
    img {
      max-width: 100%;
    }
  }
  .bttn-particip,
  .bttn-particip:hover,
  .bttn-particip:focus {
    &::before {
      content: none;
    }
    color: white;
    background: rgb(47, 42, 124);
    background: linear-gradient(
      252deg,
      rgba(47, 42, 124, 1) 0%,
      rgba(224, 48, 131, 1) 31%,
      rgba(226, 12, 24, 1) 86%
    );
    border-radius: 21px;
    font-size: 17px;
    font-weight: 500;
  }
  .button-flex {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 25px;
  }
}
.btn-search {
  position: absolute;
  right: 7px;
}
.form-inline {
  position: relative;
  padding-right: 3px;
  .form-control {
    padding-right: 40px;
    background-color: transparent;
    color: white;
    border-color: white;
  }
}
::placeholder {
  color: white;
  font-size: 14px;
}
.fix-alert {
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 999;
  width: 430px;
}
@media (min-width: 100px) {
  .title-mosaic-sm {
    padding: 10px 0;
    display: block;
    h1 {
      text-align: center;
    }
  }
  .title-mosaic-lg {
    display: none;
  }
}

@media (min-width: 600px) {
  .title-mosaic-sm {
    display: none;
  }
  .title-mosaic-lg {
    display: block;
  }
}
</style>
