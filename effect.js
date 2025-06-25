// Rain Effect - Native Canvas Implementation (based on CodePen)
// https://codepen.io/natewiley/pen/eBYXvK

let rainCanvas;
let rainCtx;
let rainAnimationId;
let objs = [];
let hue = 200;

function startWarpEffect() {
    const container = document.getElementById('warp-container');
    if (!container || rainCanvas) return;
    
    // Show container
    container.style.display = 'block';
    // DON'T hide cursor so menu stays accessible
    // document.body.style.cursor = "none";
    
    // Create canvas element
    rainCanvas = document.createElement('canvas');
    rainCanvas.width = window.innerWidth;
    rainCanvas.height = window.innerHeight;
    rainCanvas.style.position = 'absolute';
    rainCanvas.style.top = '0';
    rainCanvas.style.left = '0';
    rainCanvas.style.width = '100%';
    rainCanvas.style.height = '100%';
    rainCanvas.style.pointerEvents = 'none'; // Allow clicks to pass through to menu
    
    container.appendChild(rainCanvas);
    rainCtx = rainCanvas.getContext('2d');
    
    // Reset variables
    objs = [];
    hue = 200; // Keep blue range starting point
    
    // Mouse tracking
    let mouse = {
        x: rainCanvas.width / 2,
        y: rainCanvas.height / 2
    };
    
    // Update mouse position
    window.addEventListener('mousemove', function(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    // Rain drop class - ONLY PURE BLUE
    class O {
        constructor() {
            this.init();
        }
        
        init() {
            this.x = Math.random() * rainCanvas.width;
            this.y = 0;
            this.size = Math.random() * 5 + 3; // 3-8 range
            this.a = 0.3;
            this.vx = (Math.random() - 0.5) * 6 * 0.6; // 40% slower horizontal movement
            this.vy = this.size * 0.6; // 40% slower vertical movement
            // FIXED: No hue variation at all - pure blue only
            this.hue = 220; // Fixed blue hue
            return this;
        }
        
        draw() {
            // ONLY BLUE - no white, no variation, pure blue
            rainCtx.fillStyle = `hsla(220, 100%, 50%, ${this.a})`;
            rainCtx.fillRect(this.x, this.y, this.size, this.size);
            this.update();
        }
        
        update() {
            // Check distance to mouse
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= 200) {
                this.x += (this.vx * Math.random() * 0.2);
                this.y += (this.vy * Math.random() * 0.4);
                this.a = 1;
                // REMOVED: Don't change composite operation to prevent color mixing
                rainCtx.globalCompositeOperation = "source-over";
            } else {
                this.y += this.vy;
                rainCtx.globalCompositeOperation = "source-over";
            }
            
            if (this.y > rainCanvas.height) {
                this.init();
            }
        }
    }
    
    // Animation loop
    function animate() {
        // Semi-transparent black background for trail effect
        rainCtx.fillStyle = "rgba(0, 0, 0, 0.15)";
        rainCtx.fillRect(0, 0, rainCanvas.width, rainCanvas.height);
        
        // Draw all objects
        objs.forEach((o) => {
            o.draw();
        });
        
        rainCtx.globalCompositeOperation = "source-over";
        // Remove hue increment to prevent color shifting
        // hue += 0.1;
        
        rainAnimationId = requestAnimationFrame(animate);
    }
    
    // Create 1000 objects with staggered timing - exact from CodePen
    for (let i = 0; i < 1000; i++) {
        setTimeout(() => {
            if (objs) {
                objs.push(new O());
            }
        }, i * 5);
    }
    
    // Start animation
    animate();
    console.log('Rain effect started with native canvas');
}

function stopWarpEffect() {
    const container = document.getElementById('warp-container');
    
    if (rainAnimationId) {
        cancelAnimationFrame(rainAnimationId);
        rainAnimationId = null;
    }
    
    if (container && rainCanvas) {
        container.removeChild(rainCanvas);
        rainCanvas = null;
        rainCtx = null;
        container.style.display = 'none';
        document.body.style.cursor = "auto";
        objs = [];
    }
    
    console.log('Rain effect stopped');
}

// Helper function for random numbers
function random(min, max) {
    if (arguments.length === 0) {
        return Math.random();
    } else if (arguments.length === 1) {
        return Math.random() * min;
    } else {
        return Math.random() * (max - min) + min;
    }
}
