export class Camera {
    x: number; // Top-left corner of the camera
    y: number;
    width: number;
    height: number;
    fieldWidth: number; // Size of the field
    fieldHeight: number;
  
    constructor(viewportWidth: number, viewportHeight: number, fieldWidth: number, fieldHeight: number) {
      this.x = 0;
      this.y = 0;
      this.width = viewportWidth;
      this.height = viewportHeight;
      this.fieldWidth = fieldWidth;
      this.fieldHeight = fieldHeight;
    }
  
    update(playerX: number, playerY: number, margin: number = 64) {
      // Horizontal camera movement
      if (playerX - this.x < margin) {
        this.x = Math.max(0, playerX - margin);
      } else if (playerX - this.x > this.width - margin) {
        this.x = Math.min(this.fieldWidth - this.width, playerX - this.width + margin);
      }
  
      // Vertical camera movement
      if (playerY - this.y < margin) {
        this.y = Math.max(0, playerY - margin);
      } else if (playerY - this.y > this.height - margin) {
        this.y = Math.min(this.fieldHeight - this.height, playerY - this.height + margin);
      }
    }
  
    // Convert world coordinates to screen coordinates
    worldToScreen(worldX: number, worldY: number): { screenX: number; screenY: number } {
      return {
        screenX: worldX - this.x,
        screenY: worldY - this.y,
      };
    }
  }