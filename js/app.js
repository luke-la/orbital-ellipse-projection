// orbital ellipse projection v1.0 by luke-la
const app = Vue.createApp({
  data() {
    return {
      orbit: {
        a: 1.5,
        e: 0.5,
        i: 0,
        LoAN: 0,
        AoP: 90,
        TruA: 45,
      },
      toggles: {
        showMajor: true,
        showMinor: false,
        showIncl: true,
        refPlane: false,
        orbitalPlane: false,
        grid: true,
        line: true,
      },
    };
  },
  mounted() {
    this.draw();
  },
  methods: {
    draw() {
      //check inputs are valid
      const formValid = document.getElementById("controls").checkValidity();
      if (!formValid) return;

      //set up for drawing
      const px = 75;
      const bPos = this.scalePoint(this.bodyPos, px);
      const canvas = document.getElementById("drawable");

      let ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.lineWidth = 2;

      ctx.resetTransform();
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.translate(canvas.width / 2, canvas.height / 2);

      //optional projection elements
      let linesToDraw = [];
      let planesToDraw = [];

      if (this.toggles.grid) {
        linesToDraw.push({
          start: this.scalePoint({ x: -canvas.height / 2, y: 0 }, px),
          end: this.scalePoint({ x: canvas.height / 2, y: 0 }, px),
          color: "#EEE",
        });
        linesToDraw.push({
          start: this.scalePoint({ x: 0, y: -canvas.height / 2 }, px),
          end: this.scalePoint({ x: 0, y: canvas.height / 2 }, px),
          color: "#EEE",
        });
      }

      //optionally add major axis
      if (this.toggles.showMajor) {
        linesToDraw.push({
          start: this.scalePoint(this.getPoint(0), px),
          end: this.scalePoint(this.getPoint(180), px),
          color: "gray",
        });
      }

      //optionally add minor axis
      if (this.toggles.showMinor) {
        linesToDraw.push({
          start: this.scalePoint(this.getPoint(90), px),
          end: this.scalePoint(this.getPoint(270), px),
          color: "gray",
        });
      }

      //optionally add incline axis
      if (this.toggles.showIncl) {
        const startP = this.getPoint(90 + (90 - this.orbit.AoP), true);
        const endP = this.getPoint(270 + (90 - this.orbit.AoP), true);

        //if reference plane is enabled extend inclune axis to edges
        if (this.toggles.refPlane) {
          const box = Math.hypot(this.orbit.a + this.c, this.b) * px;
          const startRatio = Math.max(Math.abs(startP.y), Math.abs(startP.x));
          const endRatio = Math.max(Math.abs(endP.y), Math.abs(endP.x));
          linesToDraw.push({
            start: this.scalePoint(startP, box / startRatio),
            end: this.scalePoint(endP, box / endRatio),
            color: "lightgray",
          });
        }

        linesToDraw.push({
          start: this.scalePoint(startP, px),
          end: this.scalePoint(endP, px),
          color: "gray",
        });
      }

      //optionally draw connecting line
      if (this.toggles.line) {
        linesToDraw.push({
          start: { x: 0, y: 0 },
          end: bPos,
          color: "gray",
        });
      }

      //optionally add reference plane
      if (this.toggles.refPlane) {
        const box = Math.hypot(this.orbit.a + this.c, this.b) * px;
        planesToDraw.push({
          topLeft: { x: -box, y: -box },
          topRight: { x: box, y: -box },
          bottomLeft: { x: -box, y: box },
          bottomRight: { x: box, y: box },
          color: "lightgray",
        });
      }

      //optionally add orbital plane
      if (this.toggles.orbitalPlane) {
        const tl = this.transformPoint({
          x: this.b,
          y: -this.orbit.a - this.c,
        });
        const tr = this.transformPoint({
          x: -this.b,
          y: -this.orbit.a - this.c,
        });
        const bl = this.transformPoint({
          x: this.b,
          y: this.orbit.a - this.c,
        });
        const br = this.transformPoint({
          x: -this.b,
          y: this.orbit.a - this.c,
        });

        planesToDraw.push({
          topLeft: this.scalePoint(tl, px),
          topRight: this.scalePoint(tr, px),
          bottomLeft: this.scalePoint(bl, px),
          bottomRight: this.scalePoint(br, px),
          color: "lightgray",
        });

        //shade portion below reference plane if inclined
        if (this.orbit.i > 0 && this.orbit.i < 180) {
          const start = -90 + (90 - this.orbit.AoP);
          const end = 90 + (90 - this.orbit.AoP);
          ctx.fillStyle = "#F8F8F8";
          ctx.beginPath();
          for (let i = start; i <= end; i++) {
            const pos = this.scalePoint(this.getPoint(i, true), px);
            ctx.lineTo(pos.x, pos.y);
          }
          ctx.closePath();
          ctx.fill();
        }
      }

      //draw any lines
      if (linesToDraw.length > 0) {
        for (let line of linesToDraw) {
          ctx.strokeStyle = line.color;
          ctx.beginPath();
          ctx.moveTo(line.start.x, line.start.y);
          ctx.lineTo(line.end.x, line.end.y);
          ctx.stroke();
        }
      }

      //draw any planes
      if (planesToDraw.length > 0) {
        for (let p of planesToDraw) {
          ctx.strokeStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(p.topLeft.x, p.topLeft.y);
          ctx.lineTo(p.topRight.x, p.topRight.y);
          ctx.lineTo(p.bottomRight.x, p.bottomRight.y);
          ctx.lineTo(p.bottomLeft.x, p.bottomLeft.y);
          ctx.closePath();
          ctx.stroke();
        }
      }

      //ellipse
      ctx.strokeStyle = "black";
      ctx.beginPath();
      for (let i = this.orbit.AoP; i <= 360 + this.orbit.AoP; i++) {
        const pos = this.scalePoint(this.getPoint(i), px);
        ctx.lineTo(pos.x, pos.y);
      }
      ctx.stroke();

      //highlight main focus and orbiting body
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, 2 * Math.PI);
      ctx.arc(bPos.x, bPos.y, 4, 0, 2 * Math.PI);
      ctx.fill();

      //draw main focus and orbiting body
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, 2 * Math.PI);
      ctx.arc(bPos.x, bPos.y, 2, 0, 2 * Math.PI);
      ctx.fill();
    },
    //return a transformed point on the described ellipse
    getPoint(angle, trueAnomaly = false) {
      t = trueAnomaly ? this.getEcc(angle) : angle * (Math.PI / 180);
      const pos = {
        x: this.b * Math.sin(t),
        y: this.orbit.a * Math.cos(t) - this.c,
      };
      return this.transformPoint(pos);
    },
    //return the eccentric equivilent of the true angle
    getEcc(angle) {
      const v = (angle + 180) * (Math.PI / 180);
      const eSquared = Math.pow(this.orbit.e, 2);
      const beta = this.orbit.e / (1 + Math.sqrt(1 - eSquared));
      const sin = Math.sin(v);
      const cos = Math.cos(v);
      return v + 2 * Math.atan((beta * sin) / (1 - beta * cos)) + Math.PI;
    },
    //helper method to apply transformations based on orbital elements
    transformPoint(point) {
      point = this.rotate2D(point, this.orbit.AoP);
      point = this.incline(point, this.orbit.i);
      point = this.rotate2D(point, this.orbit.LoAN);
      return point;
    },
    scalePoint(point, scale) {
      return { x: point.x * scale, y: point.y * scale };
    },
    incline(point, angle) {
      const rad = angle * (Math.PI / 180);
      return {
        x: point.x * Math.cos(rad),
        y: point.y,
      };
    },
    rotate2D(point, angle) {
      const rad = angle * (Math.PI / 180);
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);

      return {
        x: point.x * cos + point.y * sin,
        y: point.x * -sin + point.y * cos,
      };
    },
    reset() {
      this.orbit.a = 1.5;
      this.orbit.e = 0.5;
      this.orbit.i = 0;
      this.orbit.LoAN = 0;
      this.orbit.AoP = 90;
      this.orbit.TruA = 45;
    },
  },
  computed: {
    bodyPos() {
      return this.getPoint(this.orbit.TruA, true);
    },
    b() {
      return this.orbit.a * Math.sqrt(1 - this.orbit.e * this.orbit.e);
    },
    c() {
      return this.orbit.a * this.orbit.e;
    },
  },
  watch: {
    orbit: {
      handler() {
        this.draw();
      },
      deep: true,
    },
    toggles: {
      handler() {
        this.draw();
      },
      deep: true,
    },
  },
});

app.mount("#app");
