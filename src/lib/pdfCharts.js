// PDF Chart Drawing Utilities using jsPDF primitives

const CHART_COLORS = [
  [59, 130, 246],   // blue
  [34, 197, 94],    // green
  [245, 158, 11],   // amber
  [239, 68, 68],    // red
  [139, 92, 246],   // purple
  [20, 184, 166],   // teal
  [236, 72, 153],   // pink
  [99, 102, 241],   // indigo
];

/**
 * Draw a Radar Chart (spider/web chart)
 */
export function drawRadarChart(
  doc,
  cx, cy, radius,
  labels, values, // values 0-100
  options
) {
  const n = labels.length;
  if (n < 3) return;
  const maxVal = options?.maxVal || 100;
  const fill = options?.fillColor || [59, 130, 246];
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  // Title
  if (options?.title) {
    doc.setFontSize(9); doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text(options.title, cx, cy - radius - 8, { align: "center" });
    doc.setFont("helvetica", "normal");
  }

  // Draw grid rings (5 levels)
  for (let ring = 1; ring <= 5; ring++) {
    const r = (radius * ring) / 5;
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    const pts = [];
    for (let i = 0; i < n; i++) {
      const angle = startAngle + i * angleStep;
      pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
    }
    for (let i = 0; i < n; i++) {
      doc.line(pts[i][0], pts[i][1], pts[(i + 1) % n][0], pts[(i + 1) % n][1]);
    }
  }

  // Draw axis lines
  doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.3);
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    doc.line(cx, cy, cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
  }

  // Draw data polygon (filled)
  const dataPoints = [];
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    const r = (Math.min(values[i], maxVal) / maxVal) * radius;
    dataPoints.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }

  // Fill polygon manually using triangles from center
  doc.setFillColor(fill[0], fill[1], fill[2]);
  const lightFill = [
    Math.round(fill[0] * 0.25 + 255 * 0.75),
    Math.round(fill[1] * 0.25 + 255 * 0.75),
    Math.round(fill[2] * 0.25 + 255 * 0.75),
  ];
  doc.setFillColor(lightFill[0], lightFill[1], lightFill[2]);
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    doc.triangle(
      cx, cy,
      dataPoints[i][0], dataPoints[i][1],
      dataPoints[j][0], dataPoints[j][1],
      "F"
    );
  }

  // Stroke polygon
  doc.setDrawColor(fill[0], fill[1], fill[2]); doc.setLineWidth(0.8);
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    doc.line(dataPoints[i][0], dataPoints[i][1], dataPoints[j][0], dataPoints[j][1]);
  }

  // Data points (dots)
  doc.setFillColor(fill[0], fill[1], fill[2]);
  dataPoints.forEach(([x, y]) => doc.circle(x, y, 1.2, "F"));

  // Labels
  doc.setFontSize(7); doc.setTextColor(50, 50, 50);
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    const lx = cx + (radius + 7) * Math.cos(angle);
    const ly = cy + (radius + 7) * Math.sin(angle);
    const align = Math.abs(Math.cos(angle)) < 0.1 ? "center" : Math.cos(angle) > 0 ? "left" : "right";
    doc.text(`${labels[i]} (${values[i]}%)`, lx, ly + 1, { align });
  }
  doc.setTextColor(0, 0, 0);
}

/**
 * Draw a Pie Chart
 */
export function drawPieChart(
  doc,
  cx, cy, radius,
  labels, values,
  options
) {
  const total = values.reduce((a, b) => a + b, 0);
  if (total === 0) return;
  const colors = options?.colors || CHART_COLORS;

  if (options?.title) {
    doc.setFontSize(9); doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text(options.title, cx, cy - radius - 6, { align: "center" });
    doc.setFont("helvetica", "normal");
  }

  let currentAngle = -Math.PI / 2;
  const slices = [];

  values.forEach((val, i) => {
    const pct = (val / total) * 100;
    const sliceAngle = (val / total) * 2 * Math.PI;
    const endAngle = currentAngle + sliceAngle;
    const midAngle = currentAngle + sliceAngle / 2;
    const color = colors[i % colors.length];
    slices.push({ startAngle: currentAngle, endAngle, midAngle, pct, label: labels[i], color });

    // Draw slice using many small triangles
    doc.setFillColor(color[0], color[1], color[2]);
    const steps = Math.max(8, Math.ceil(sliceAngle / 0.05));
    for (let s = 0; s < steps; s++) {
      const a1 = currentAngle + (sliceAngle * s) / steps;
      const a2 = currentAngle + (sliceAngle * (s + 1)) / steps;
      doc.triangle(
        cx, cy,
        cx + radius * Math.cos(a1), cy + radius * Math.sin(a1),
        cx + radius * Math.cos(a2), cy + radius * Math.sin(a2),
        "F"
      );
    }

    currentAngle = endAngle;
  });

  // White center for donut effect
  doc.setFillColor(255, 255, 255);
  doc.circle(cx, cy, radius * 0.45, "F");

  // Legend below
  let ly = cy + radius + 8;
  doc.setFontSize(7);
  const legendX = cx - 35;
  slices.forEach((s, i) => {
    const col = i % 2 === 0 ? legendX : legendX + 40;
    const row = ly + Math.floor(i / 2) * 6;
    doc.setFillColor(s.color[0], s.color[1], s.color[2]);
    doc.rect(col, row - 2.5, 3, 3, "F");
    doc.setTextColor(50, 50, 50);
    doc.text(`${s.label}: ${s.pct.toFixed(0)}%`, col + 5, row, { maxWidth: 33 });
  });
  doc.setTextColor(0, 0, 0);
}

/**
 * Draw a Horizontal Bar Chart
 */
export function drawHBarChart(
  doc,
  x, y, width,
  labels, values,
  options
) {
  const barH = options?.barHeight || 6;
  const gap = 3;
  const maxVal = options?.maxVal || Math.max(...values, 100);
  const colors = options?.colors || CHART_COLORS;
  const labelW = 45;

  if (options?.title) {
    doc.setFontSize(9); doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text(options.title, x, y);
    doc.setFont("helvetica", "normal");
    y += 6;
  }

  labels.forEach((label, i) => {
    const color = colors[i % colors.length];
    const barW = ((values[i] / maxVal) * (width - labelW));

    // Label
    doc.setFontSize(7); doc.setTextColor(60, 60, 60);
    doc.text(label, x, y + barH / 2 + 1, { maxWidth: labelW - 3 });

    // Background bar
    doc.setFillColor(235, 235, 235);
    doc.roundedRect(x + labelW, y, width - labelW, barH, 1.5, 1.5, "F");

    // Value bar
    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(x + labelW, y, Math.max(2, barW), barH, 1.5, 1.5, "F");

    // Value text
    doc.setTextColor(80, 80, 80); doc.setFontSize(7);
    doc.text(`${values[i]}%`, x + labelW + Math.max(2, barW) + 2, y + barH / 2 + 1);

    y += barH + gap;
  });

  doc.setTextColor(0, 0, 0);
  return y;
}

/**
 * Draw a grouped comparison bar chart (e.g. for MBTI pairs)
 */
export function drawComparisonBars(
  doc,
  x, y, width,
  pairs,
  options
) {
  const barH = 5;
  const gap = 8;
  const midX = x + width / 2;

  if (options?.title) {
    doc.setFontSize(9); doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text(options.title, x + width / 2, y, { align: "center" });
    doc.setFont("helvetica", "normal");
    y += 7;
  }

  // Center line
  doc.setDrawColor(180, 180, 180); doc.setLineWidth(0.3);
  doc.line(midX, y, midX, y + pairs.length * (barH + gap));

  pairs.forEach((p, i) => {
    const py = y + i * (barH + gap);
    const maxBar = (width / 2) - 20;
    const totalPair = p.valA + p.valB || 1;

    // Left bar (A)
    const wA = (p.valA / totalPair) * maxBar;
    doc.setFillColor(59, 130, 246);
    doc.roundedRect(midX - wA, py, wA, barH, 1, 1, "F");
    doc.setFontSize(7); doc.setTextColor(59, 130, 246);
    doc.text(`${p.labelA}: ${p.valA}`, midX - wA - 2, py + barH / 2 + 1, { align: "right" });

    // Right bar (B)
    const wB = (p.valB / totalPair) * maxBar;
    doc.setFillColor(139, 92, 246);
    doc.roundedRect(midX, py, wB, barH, 1, 1, "F");
    doc.setTextColor(139, 92, 246);
    doc.text(`${p.labelB}: ${p.valB}`, midX + wB + 2, py + barH / 2 + 1);
  });

  doc.setTextColor(0, 0, 0);
  return y + pairs.length * (barH + gap) + 4;
}

/**
 * Draw a small gauge/meter
 */
export function drawGauge(
  doc,
  cx, cy, radius,
  value, label,
  color = [59, 130, 246]
) {
  // Background arc (semicircle)
  const steps = 40;
  doc.setFillColor(230, 230, 230);
  for (let s = 0; s < steps; s++) {
    const a1 = Math.PI + (Math.PI * s) / steps;
    const a2 = Math.PI + (Math.PI * (s + 1)) / steps;
    doc.triangle(cx, cy, cx + radius * Math.cos(a1), cy + radius * Math.sin(a1), cx + radius * Math.cos(a2), cy + radius * Math.sin(a2), "F");
  }

  // Value arc
  const valSteps = Math.ceil((value / 100) * steps);
  doc.setFillColor(color[0], color[1], color[2]);
  for (let s = 0; s < valSteps; s++) {
    const a1 = Math.PI + (Math.PI * s) / steps;
    const a2 = Math.PI + (Math.PI * (s + 1)) / steps;
    doc.triangle(cx, cy, cx + radius * Math.cos(a1), cy + radius * Math.sin(a1), cx + radius * Math.cos(a2), cy + radius * Math.sin(a2), "F");
  }

  // White inner circle
  doc.setFillColor(255, 255, 255);
  doc.circle(cx, cy, radius * 0.6, "F");

  // Value text
  doc.setFontSize(11); doc.setFont("helvetica", "bold");
  doc.setTextColor(color[0], color[1], color[2]);
  doc.text(`${value}%`, cx, cy - 1, { align: "center" });

  // Label
  doc.setFontSize(7); doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text(label, cx, cy + 5, { align: "center" });
  doc.setTextColor(0, 0, 0);
}
