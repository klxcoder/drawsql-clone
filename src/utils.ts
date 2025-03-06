export const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

// Function to draw a rounded rectangle
export const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
  ctx.save();
  // Set shadow properties
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)"; // Shadow color (black with 50% opacity)
  ctx.shadowBlur = 10; // Blur intensity
  ctx.shadowOffsetX = 5; // Shadow offset to the right
  ctx.shadowOffsetY = 5; // Shadow offset downward
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
  ctx.restore();
};