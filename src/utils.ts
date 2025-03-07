import { Grid } from "./models/Grid";

export const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

// Function to draw a rounded rectangle
export const drawRoundedRect = ({
  ctx,
  x,
  y,
  width,
  height,
  radius,
  shadowOffset,
  stroke,
}: {
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  shadowOffset: number,
  stroke: boolean,
}) => {
  ctx.save();
  //
  ctx.strokeStyle = 'rgba(0,0,255, 0.5)';
  ctx.lineWidth = 5;
  // Set shadow properties
  ctx.shadowColor = "rgba(0, 0, 0, 0.4)"; // Shadow color (black with 40% opacity)
  ctx.shadowBlur = 4 * shadowOffset; // Blur intensity
  ctx.shadowOffsetX = -shadowOffset; // Shadow offset to the right
  ctx.shadowOffsetY = shadowOffset; // Shadow offset downward
  // Draw the rounded rectangle
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arc(x + width - radius, y + radius, radius, -Math.PI / 2, 0);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2);
  ctx.lineTo(x + radius, y + height);
  ctx.arc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI);
  ctx.lineTo(x, y + radius);
  ctx.arc(x + radius, y + radius, radius, Math.PI, (Math.PI * 3) / 2);
  ctx.closePath();
  ctx.fill();
  if (stroke) {
    ctx.stroke();
  }
  ctx.restore();
};

export const drawDots = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
  for (let col = 1; col < Grid.MAX_COLS; col++) {
    for (let row = 1; row < Grid.MAX_ROWS; row++) {
      ctx.beginPath();
      ctx.arc(col * Grid.CELL_SIZE, row * Grid.CELL_SIZE, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}