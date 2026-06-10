import { jsPDF } from 'jspdf';
import { formatDate } from './dates.js';

const COLOURS = {
  paper: [244, 241, 234],
  surface: [255, 253, 249],
  ink: [33, 30, 26],
  inkSoft: [117, 110, 99],
  line: [221, 213, 199],
  clay: [199, 95, 52],
  clayDark: [140, 61, 31],
  completed: [60, 87, 52],
  completedBg: [232, 240, 230],
  overdue: [138, 54, 33],
  overdueBg: [248, 231, 224],
  dueSoon: [122, 84, 16],
  dueSoonBg: [251, 239, 216],
  upcoming: [108, 101, 90],
  upcomingBg: [237, 232, 223],
};

const STATUS_STYLE = {
  completed: { label: 'Completed', ink: COLOURS.completed, bg: COLOURS.completedBg },
  overdue: { label: 'Overdue', ink: COLOURS.overdue, bg: COLOURS.overdueBg },
  'due-soon': { label: 'Due soon', ink: COLOURS.dueSoon, bg: COLOURS.dueSoonBg },
  upcoming: { label: 'Upcoming', ink: COLOURS.upcoming, bg: COLOURS.upcomingBg },
};

const PAGE = {
  width: 210,
  height: 297,
  margin: 18,
};

function setFill(doc, colour) {
  doc.setFillColor(...colour);
}

function setText(doc, colour) {
  doc.setTextColor(...colour);
}

function setDraw(doc, colour) {
  doc.setDrawColor(...colour);
}

function drawBrandMark(doc, x, y, size = 12) {
  const scale = size / 96;
  const point = (value) => value * scale;

  setFill(doc, COLOURS.clay);
  doc.roundedRect(x, y, size, size, point(24), point(24), 'F');

  doc.setLineCap('round');
  doc.setLineJoin('round');
  doc.setLineWidth(point(3));
  doc.setDrawColor(255, 250, 245);
  doc.setGState(new doc.GState({ opacity: 0.22 }));
  doc.line(x + point(24), y + point(40), x + point(72), y + point(40));
  doc.line(x + point(24), y + point(56), x + point(72), y + point(56));

  doc.setGState(new doc.GState({ opacity: 1 }));
  doc.setLineWidth(point(8));
  doc.lines(
    [
      [point(11), point(10.5)],
      [point(26), point(-30)],
    ],
    x + point(33),
    y + point(55.5)
  );
}

function drawPageBase(doc, pageNumber, generatedLabel) {
  setFill(doc, COLOURS.paper);
  doc.rect(0, 0, PAGE.width, PAGE.height, 'F');

  setDraw(doc, COLOURS.line);
  doc.setLineWidth(0.25);
  doc.line(PAGE.margin, 280, PAGE.width - PAGE.margin, 280);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  setText(doc, COLOURS.inkSoft);
  doc.text('Ledgerly compliance plan', PAGE.margin, 286);
  doc.text(generatedLabel, PAGE.width / 2, 286, { align: 'center' });
  doc.text(String(pageNumber).padStart(2, '0'), PAGE.width - PAGE.margin, 286, { align: 'right' });
}

function drawMetric(doc, x, y, width, label, value, style) {
  setFill(doc, style.bg);
  doc.roundedRect(x, y, width, 24, 3.5, 3.5, 'F');
  doc.setFont('courier', 'bold');
  doc.setFontSize(16);
  setText(doc, style.ink);
  doc.text(String(value), x + 5, y + 10);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text(label.toUpperCase(), x + 5, y + 18);
}

function drawStatusPill(doc, x, y, status) {
  const style = STATUS_STYLE[status] || STATUS_STYLE.upcoming;
  const labelWidth = doc.getTextWidth(style.label) + 9;
  setFill(doc, style.bg);
  doc.roundedRect(x, y, labelWidth, 6.5, 3.25, 3.25, 'F');
  setFill(doc, style.ink);
  doc.circle(x + 3.2, y + 3.25, 0.8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  setText(doc, style.ink);
  doc.text(style.label, x + 5.4, y + 4.35);
  return labelWidth;
}

function getPriorityTasks(tasks) {
  const priority = { overdue: 0, 'due-soon': 1, upcoming: 2, completed: 3 };
  return [...tasks]
    .filter((task) => task.status !== 'completed')
    .sort((a, b) => {
      const statusDifference = priority[a.status] - priority[b.status];
      if (statusDifference !== 0) return statusDifference;
      return String(a.dueDate).localeCompare(String(b.dueDate));
    });
}

function drawTaskRow(doc, task, index, y) {
  const x = PAGE.margin;
  const width = PAGE.width - PAGE.margin * 2;
  const rowHeight = 17;

  setFill(doc, index % 2 === 0 ? COLOURS.surface : [250, 247, 241]);
  doc.roundedRect(x, y, width, rowHeight, 2.4, 2.4, 'F');

  doc.setFont('courier', 'bold');
  doc.setFontSize(8);
  setText(doc, COLOURS.clayDark);
  doc.text(String(index + 1).padStart(2, '0'), x + 4, y + 6.2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.4);
  setText(doc, COLOURS.ink);
  const titleLines = doc.splitTextToSize(task.name, 92);
  doc.text(titleLines[0], x + 14, y + 6.1);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  setText(doc, COLOURS.inkSoft);
  doc.text(`Due ${formatDate(task.dueDate)}`, x + 14, y + 11.7);

  drawStatusPill(doc, x + width - 34, y + 5.1, task.status);
}

function drawInsight(doc, x, y, width, completionRate, overdueCount) {
  setFill(doc, COLOURS.surface);
  doc.roundedRect(x, y, width, 26, 3.5, 3.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  setText(doc, COLOURS.ink);
  doc.text('A calm read on the plan', x + 6, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.4);
  setText(doc, COLOURS.inkSoft);
  const insight = overdueCount > 0
    ? `${overdueCount} obligation${overdueCount === 1 ? '' : 's'} need attention. Start with the first item below and work through one checklist at a time.`
    : completionRate === 100
      ? 'Everything in this plan is complete. Keep the report with your records and check the calendar for the next cycle.'
      : 'Nothing is overdue. Keep the next due item visible and use the calendar to protect time before the deadline.';
  const lines = doc.splitTextToSize(insight, width - 12);
  doc.text(lines, x + 6, y + 13, { lineHeightFactor: 1.35 });
}

export async function createCompliancePdf({
  tasks = [],
  completedTasks = [],
  completedCount = 0,
  profile = {},
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const generatedAt = new Date();
  const generatedLabel = generatedAt.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const monthLabel = generatedAt.toLocaleDateString('en-AU', {
    month: 'long',
    year: 'numeric',
  });
  const overdue = tasks.filter((task) => task.status === 'overdue');
  const dueSoon = tasks.filter((task) => task.status === 'due-soon');
  const upcoming = tasks.filter((task) => task.status === 'upcoming');
  const total = completedCount + tasks.length;
  const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const priorityTasks = getPriorityTasks(tasks);
  const businessName = profile.businessName || 'Your business';
  const businessMeta = [profile.type, profile.state].filter(Boolean).join('  /  ');
  drawPageBase(doc, 1, `Generated ${generatedLabel}`);

  drawBrandMark(doc, PAGE.margin, 18);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  setText(doc, COLOURS.ink);
  doc.text('Ledgerly', PAGE.margin + 16, 25.8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  setText(doc, COLOURS.inkSoft);
  doc.text('COMPLIANCE, CALMLY HANDLED', PAGE.width - PAGE.margin, 25.4, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  setText(doc, COLOURS.ink);
  doc.text('Compliance plan', PAGE.margin, 48);
  setText(doc, COLOURS.clay);
  doc.text('summary', PAGE.margin, 58);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  setText(doc, COLOURS.inkSoft);
  doc.text(`${businessName}  /  ${monthLabel}`, PAGE.margin, 68);
  if (businessMeta) {
    doc.setFontSize(7.2);
    doc.text(businessMeta, PAGE.margin, 74);
  }

  const metricWidth = 41.5;
  const metricGap = 2.7;
  const metricY = 84;
  drawMetric(doc, PAGE.margin, metricY, metricWidth, 'Completed', completedCount, STATUS_STYLE.completed);
  drawMetric(doc, PAGE.margin + (metricWidth + metricGap), metricY, metricWidth, 'Overdue', overdue.length, STATUS_STYLE.overdue);
  drawMetric(doc, PAGE.margin + (metricWidth + metricGap) * 2, metricY, metricWidth, 'Due soon', dueSoon.length, STATUS_STYLE['due-soon']);
  drawMetric(doc, PAGE.margin + (metricWidth + metricGap) * 3, metricY, metricWidth, 'Upcoming', upcoming.length, STATUS_STYLE.upcoming);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  setText(doc, COLOURS.ink);
  doc.text('Completion rate', PAGE.margin, 119);
  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  setText(doc, COLOURS.completed);
  doc.text(`${completionRate}%`, PAGE.width - PAGE.margin, 119, { align: 'right' });
  setFill(doc, COLOURS.line);
  doc.roundedRect(PAGE.margin, 123, PAGE.width - PAGE.margin * 2, 3, 1.5, 1.5, 'F');
  if (completionRate > 0) {
    setFill(doc, COLOURS.completed);
    doc.roundedRect(
      PAGE.margin,
      123,
      (PAGE.width - PAGE.margin * 2) * (completionRate / 100),
      3,
      1.5,
      1.5,
      'F'
    );
  }

  drawInsight(
    doc,
    PAGE.margin,
    135,
    PAGE.width - PAGE.margin * 2,
    completionRate,
    overdue.length
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  setText(doc, COLOURS.ink);
  doc.text('Next actions', PAGE.margin, 175);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  setText(doc, COLOURS.inkSoft);
  doc.text('Ordered by urgency and due date', PAGE.width - PAGE.margin, 175, { align: 'right' });

  if (priorityTasks.length === 0) {
    setFill(doc, COLOURS.completedBg);
    doc.roundedRect(PAGE.margin, 181, PAGE.width - PAGE.margin * 2, 24, 3.5, 3.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    setText(doc, COLOURS.completed);
    doc.text('All clear', PAGE.margin + 6, 191);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text('There are no open obligations in this plan.', PAGE.margin + 6, 198);
  } else {
    priorityTasks.slice(0, 5).forEach((task, index) => {
      drawTaskRow(doc, task, index, 181 + index * 18.5);
    });
  }

  if (priorityTasks.length > 5 || completedTasks.length > 0) {
    doc.addPage();
    drawPageBase(doc, 2, `Generated ${generatedLabel}`);

    drawBrandMark(doc, PAGE.margin, 18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    setText(doc, COLOURS.ink);
    doc.text('Plan detail', PAGE.margin + 16, 25.8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    setText(doc, COLOURS.inkSoft);
    doc.text(businessName, PAGE.width - PAGE.margin, 25.4, { align: 'right' });

    let y = 43;
    const remainingTasks = priorityTasks.slice(5, 15);
    if (remainingTasks.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      setText(doc, COLOURS.ink);
      doc.text('Scheduled ahead', PAGE.margin, y);
      y += 7;
      remainingTasks.forEach((task, index) => {
        drawTaskRow(doc, task, index + 5, y);
        y += 18.5;
      });
    }

    if (completedTasks.length > 0 && y < 205) {
      y += 5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      setText(doc, COLOURS.ink);
      doc.text('Recently completed', PAGE.margin, y);
      y += 7;

      completedTasks.slice(0, 5).forEach((task) => {
        setFill(doc, COLOURS.completedBg);
        doc.roundedRect(PAGE.margin, y, PAGE.width - PAGE.margin * 2, 12, 2.5, 2.5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.8);
        setText(doc, COLOURS.completed);
        doc.text(task.name, PAGE.margin + 5, y + 5.2);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.8);
        doc.text(`Completed ${task.completedAt || 'recently'}`, PAGE.margin + 5, y + 9.2);
        y += 13.5;
      });
    }
  }

  doc.setProperties({
    title: `Ledgerly compliance plan for ${businessName}`,
    subject: `Compliance plan summary for ${monthLabel}`,
    author: 'Ledgerly',
    creator: 'Ledgerly',
  });

  const safeBusinessName = businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'business';
  const fileMonth = monthLabel.toLowerCase().replace(/\s+/g, '-');
  return {
    doc,
    fileName: `ledgerly-${safeBusinessName}-${fileMonth}.pdf`,
  };
}

export async function generateCompliancePdf(options) {
  const { doc, fileName } = await createCompliancePdf(options);
  doc.save(fileName);
}
