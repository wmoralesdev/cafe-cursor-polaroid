// Print paper dimensions (mm)
export const PRINT_PAPER_WIDTH_MM = 100;  // 4 inches
export const PRINT_PAPER_HEIGHT_MM = 148; // 6 inches

// Polaroids per row (rotated 90° side by side)
export const POLAROIDS_PER_ROW = 2;

// Derived: each rotated polaroid space on paper
const PRINT_POLAROID_WIDTH_MM = PRINT_PAPER_HEIGHT_MM / POLAROIDS_PER_ROW; // 74mm
const PRINT_POLAROID_HEIGHT_MM = PRINT_PAPER_WIDTH_MM; // 100mm

// Aspect ratio for original polaroid (H/W = print_width/print_height when rotated)
export const POLAROID_ASPECT_RATIO = PRINT_POLAROID_WIDTH_MM / PRINT_POLAROID_HEIGHT_MM; // 74/100 = 0.74

// Pixel dimensions
export const POLAROID_WIDTH_PX = 340;
export const POLAROID_HEIGHT_PX = Math.round(POLAROID_WIDTH_PX / POLAROID_ASPECT_RATIO); // ~459px












