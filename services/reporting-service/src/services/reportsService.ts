/**
 * Reports service - Document generation business logic
 */

import { logger, NotFoundError } from '@axxiom/shared';
import { query, transaction } from '../database';
import Handlebars from 'handlebars';
import ExcelJS from 'exceljs';
import archiver from 'archiver';

export interface ReportRecord {
  reportId: string;
  tenantId: string;
  reportType: string;
  entityId: string;
  format: string;
  fileUrl: string;
  fileSize: number;
  generatedBy: string;
  generatedAt: Date;
}

/**
 * Generate valuation report (PDF)
 */
export async function generateValuationReport(
  tenantId: string,
  userId: string,
  valuationId: string,
  options: {
    format: string;
    includeComparables: boolean;
    includePhotos: boolean;
    includeExplanations: boolean;
    templateId?: string;
  }
): Promise<{ buffer?: Buffer; html?: string; reportId: string }> {
  // Get valuation data
  const valuationSql = `
    SELECT
      v.*,
      p.street_number, p.street_name, p.city, p.state, p.zip_code,
      p.property_type, p.latitude, p.longitude,
      b.gross_building_area, b.year_built, b.stories, b.condition,
      l.land_area, l.zoning
    FROM valuations v
    JOIN properties p ON v.property_id = p.property_id
    LEFT JOIN buildings b ON p.property_id = b.property_id
    LEFT JOIN land l ON p.property_id = l.property_id
    WHERE v.valuation_id = $1 AND v.tenant_id = $2
  `;

  const valuationResult = await query(valuationSql, [valuationId, tenantId], tenantId);

  if (valuationResult.rows.length === 0) {
    throw new NotFoundError('Valuation not found');
  }

  const valuation = valuationResult.rows[0];

  // Get comparables if requested
  let comparables: any[] = [];
  if (options.includeComparables) {
    const compsSql = `
      SELECT * FROM comparable_properties
      WHERE valuation_id = $1
      ORDER BY similarity_score DESC
      LIMIT 10
    `;
    const compsResult = await query(compsSql, [valuationId], tenantId);
    comparables = compsResult.rows;
  }

  // Build report data
  const reportData = {
    valuation,
    property: {
      address: `${valuation.street_number} ${valuation.street_name}`,
      city: valuation.city,
      state: valuation.state,
      zipCode: valuation.zip_code,
      type: valuation.property_type,
      buildingArea: valuation.gross_building_area,
      landArea: valuation.land_area,
      yearBuilt: valuation.year_built,
      condition: valuation.condition,
    },
    comparables: options.includeComparables ? comparables : [],
    generatedDate: new Date().toISOString(),
    generatedBy: userId,
  };

  // Generate HTML from template
  const template = getValuationTemplate();
  const compiledTemplate = Handlebars.compile(template);
  const html = compiledTemplate(reportData);

  // Save report record
  const reportRecord = await saveReportRecord(tenantId, userId, {
    reportType: 'valuation',
    entityId: valuationId,
    format: options.format,
    fileUrl: `reports/valuations/${valuationId}.${options.format}`,
    fileSize: html.length,
  });

  if (options.format === 'pdf') {
    // In production, use Puppeteer to convert HTML to PDF
    // For now, return mock PDF buffer
    const pdfBuffer = Buffer.from(html); // Mock - would use Puppeteer in production
    return { buffer: pdfBuffer, reportId: reportRecord.reportId };
  }

  return { html, reportId: reportRecord.reportId };
}

/**
 * Generate assessment roll (Excel/CSV)
 */
export async function generateAssessmentRoll(
  tenantId: string,
  userId: string,
  runId: string,
  options: {
    format: string;
    includeNeighborhood: boolean;
    includePropertyType: boolean;
    groupBy: string;
  }
): Promise<{ buffer: Buffer; reportId: string }> {
  // Get assessment data
  const sql = `
    SELECT
      a.assessment_id,
      p.parcel_number,
      p.street_number || ' ' || p.street_name AS address,
      p.city,
      p.state,
      p.zip_code,
      p.property_type,
      p.neighborhood,
      a.land_value,
      a.improvement_value,
      a.total_assessed_value,
      a.prior_year_value,
      a.value_change
    FROM assessments a
    JOIN properties p ON a.property_id = p.property_id
    WHERE a.run_id = $1 AND a.tenant_id = $2
    ORDER BY ${options.groupBy !== 'none' ? `p.${options.groupBy}, ` : ''}p.parcel_number
  `;

  const result = await query(sql, [runId, tenantId], tenantId);
  const assessments = result.rows;

  if (options.format === 'xlsx') {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Assessment Roll');

    // Define columns
    const columns: any[] = [
      { header: 'Parcel Number', key: 'parcel_number', width: 15 },
      { header: 'Address', key: 'address', width: 30 },
      { header: 'City', key: 'city', width: 15 },
      { header: 'State', key: 'state', width: 8 },
      { header: 'ZIP', key: 'zip_code', width: 10 },
    ];

    if (options.includePropertyType) {
      columns.push({ header: 'Property Type', key: 'property_type', width: 15 });
    }

    if (options.includeNeighborhood) {
      columns.push({ header: 'Neighborhood', key: 'neighborhood', width: 15 });
    }

    columns.push(
      { header: 'Land Value', key: 'land_value', width: 15, style: { numFmt: '$#,##0.00' } },
      { header: 'Improvement Value', key: 'improvement_value', width: 15, style: { numFmt: '$#,##0.00' } },
      { header: 'Total Assessed Value', key: 'total_assessed_value', width: 20, style: { numFmt: '$#,##0.00' } },
      { header: 'Prior Year Value', key: 'prior_year_value', width: 18, style: { numFmt: '$#,##0.00' } },
      { header: 'Value Change', key: 'value_change', width: 15, style: { numFmt: '$#,##0.00' } }
    );

    worksheet.columns = columns;

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    // Add data rows
    assessments.forEach((assessment: any) => {
      worksheet.addRow(assessment);
    });

    // Add totals row
    const totalRow = worksheet.addRow({
      parcel_number: 'TOTAL',
      land_value: { formula: `SUM(G2:G${assessments.length + 1})` },
      improvement_value: { formula: `SUM(H2:H${assessments.length + 1})` },
      total_assessed_value: { formula: `SUM(I2:I${assessments.length + 1})` },
    });
    totalRow.font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();

    // Save report record
    const reportRecord = await saveReportRecord(tenantId, userId, {
      reportType: 'assessment_roll',
      entityId: runId,
      format: 'xlsx',
      fileUrl: `reports/assessments/${runId}.xlsx`,
      fileSize: buffer.length,
    });

    return { buffer: Buffer.from(buffer), reportId: reportRecord.reportId };
  } else {
    // CSV format
    const csv = convertToCSV(assessments, options);
    const buffer = Buffer.from(csv);

    const reportRecord = await saveReportRecord(tenantId, userId, {
      reportType: 'assessment_roll',
      entityId: runId,
      format: 'csv',
      fileUrl: `reports/assessments/${runId}.csv`,
      fileSize: buffer.length,
    });

    return { buffer, reportId: reportRecord.reportId };
  }
}

/**
 * Generate appeal report (PDF)
 */
export async function generateAppealReport(
  tenantId: string,
  userId: string,
  appealId: string,
  options: {
    format: string;
    includeEvidence: boolean;
    includeTimeline: boolean;
    includeComparables: boolean;
  }
): Promise<{ buffer?: Buffer; html?: string; reportId: string }> {
  // Get appeal data
  const appealSql = `
    SELECT
      ac.*,
      p.street_number || ' ' || p.street_name AS address,
      p.city, p.state, p.zip_code, p.property_type
    FROM appeal_cases ac
    JOIN properties p ON ac.property_id = p.property_id
    WHERE ac.appeal_id = $1 AND ac.tenant_id = $2
  `;

  const appealResult = await query(appealSql, [appealId, tenantId], tenantId);

  if (appealResult.rows.length === 0) {
    throw new NotFoundError('Appeal not found');
  }

  const appeal = appealResult.rows[0];

  // Get evidence if requested
  let evidence: any[] = [];
  if (options.includeEvidence) {
    const evidenceResult = await query(
      `SELECT * FROM appeal_evidence WHERE appeal_id = $1 ORDER BY uploaded_at`,
      [appealId],
      tenantId
    );
    evidence = evidenceResult.rows;
  }

  // Get timeline if requested
  let timeline: any[] = [];
  if (options.includeTimeline) {
    const timelineResult = await query(
      `SELECT * FROM appeal_timeline WHERE appeal_id = $1 ORDER BY event_date`,
      [appealId],
      tenantId
    );
    timeline = timelineResult.rows;
  }

  const reportData = {
    appeal,
    evidence: options.includeEvidence ? evidence : [],
    timeline: options.includeTimeline ? timeline : [],
    generatedDate: new Date().toISOString(),
  };

  const template = getAppealTemplate();
  const compiledTemplate = Handlebars.compile(template);
  const html = compiledTemplate(reportData);

  // Save report record
  const reportRecord = await saveReportRecord(tenantId, userId, {
    reportType: 'appeal',
    entityId: appealId,
    format: options.format,
    fileUrl: `reports/appeals/${appealId}.${options.format}`,
    fileSize: html.length,
  });

  if (options.format === 'pdf') {
    const pdfBuffer = Buffer.from(html); // Mock - would use Puppeteer in production
    return { buffer: pdfBuffer, reportId: reportRecord.reportId };
  }

  return { html, reportId: reportRecord.reportId };
}

/**
 * Batch generate valuation reports
 */
export async function batchGenerateValuations(
  tenantId: string,
  userId: string,
  valuationIds: string[],
  options: any
): Promise<{ buffer?: Buffer; reportIds: string[] }> {
  const reportIds: string[] = [];
  const archive = archiver('zip', { zlib: { level: 9 } });
  const chunks: Buffer[] = [];

  archive.on('data', (chunk) => chunks.push(chunk));

  for (const valuationId of valuationIds) {
    const result = await generateValuationReport(tenantId, userId, valuationId, {
      ...options,
      format: 'pdf',
    });
    reportIds.push(result.reportId);
    if (result.buffer) {
      archive.append(result.buffer, { name: `valuation-${valuationId}.pdf` });
    }
  }

  await archive.finalize();
  const buffer = Buffer.concat(chunks);

  return { buffer, reportIds };
}

/**
 * Batch generate assessment notices
 */
export async function batchGenerateAssessments(
  tenantId: string,
  userId: string,
  runId: string,
  propertyIds?: string[]
): Promise<{ buffer: Buffer }> {
  // Mock implementation - would generate individual PDFs for each property
  const archive = archiver('zip', { zlib: { level: 9 } });
  const chunks: Buffer[] = [];

  archive.on('data', (chunk) => chunks.push(chunk));

  // Add mock notices
  for (let i = 0; i < 10; i++) {
    const notice = Buffer.from(`Mock assessment notice ${i + 1}`);
    archive.append(notice, { name: `notice-${i + 1}.pdf` });
  }

  await archive.finalize();
  const buffer = Buffer.concat(chunks);

  return { buffer };
}

/**
 * Get report history
 */
export async function getReportHistory(
  tenantId: string,
  filters: {
    reportType?: string;
    limit: number;
    offset: number;
  }
): Promise<ReportRecord[]> {
  const whereClauses: string[] = [];
  const params: any[] = [tenantId];
  let paramIndex = 2;

  if (filters.reportType) {
    whereClauses.push(`report_type = $${paramIndex++}`);
    params.push(filters.reportType);
  }

  const whereClause = whereClauses.length > 0 ? `AND ${whereClauses.join(' AND ')}` : '';

  const sql = `
    SELECT * FROM reports
    WHERE tenant_id = $1 ${whereClause}
    ORDER BY generated_at DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  params.push(filters.limit, filters.offset);

  const result = await query<ReportRecord>(sql, params, tenantId);
  return result.rows;
}

/**
 * Download report
 */
export async function downloadReport(
  tenantId: string,
  reportId: string
): Promise<{ buffer: Buffer; contentType: string; filename: string }> {
  const result = await query<ReportRecord>(
    `SELECT * FROM reports WHERE report_id = $1 AND tenant_id = $2`,
    [reportId, tenantId],
    tenantId
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('Report not found');
  }

  const report = result.rows[0];

  // In production, fetch from blob storage
  // For now, return mock buffer
  const buffer = Buffer.from(`Mock report content for ${reportId}`);

  const contentType = report.format === 'pdf' ? 'application/pdf' : 'application/octet-stream';
  const filename = `${report.reportType}-${report.entityId}.${report.format}`;

  return { buffer, contentType, filename };
}

/**
 * List templates
 */
export async function listTemplates(tenantId: string): Promise<any[]> {
  return [
    { templateId: 'valuation-standard', name: 'Standard Valuation Report', type: 'valuation' },
    { templateId: 'valuation-detailed', name: 'Detailed Valuation Report', type: 'valuation' },
    { templateId: 'appeal-package', name: 'Appeal Package', type: 'appeal' },
    { templateId: 'assessment-notice', name: 'Assessment Notice', type: 'assessment' },
  ];
}

/**
 * Helper: Save report record
 */
async function saveReportRecord(
  tenantId: string,
  userId: string,
  report: {
    reportType: string;
    entityId: string;
    format: string;
    fileUrl: string;
    fileSize: number;
  }
): Promise<ReportRecord> {
  const result = await query<ReportRecord>(
    `INSERT INTO reports (tenant_id, report_type, entity_id, format, file_url, file_size, generated_by, generated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
     RETURNING *`,
    [tenantId, report.reportType, report.entityId, report.format, report.fileUrl, report.fileSize, userId],
    tenantId
  );

  return result.rows[0];
}

/**
 * Helper: Convert to CSV
 */
function convertToCSV(data: any[], options: any): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((header) => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    }).join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Helper: Get valuation template
 */
function getValuationTemplate(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Valuation Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #333; }
    .section { margin: 20px 0; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <h1>Valuation Report</h1>
  <div class="section">
    <h2>Property Information</h2>
    <p><strong>Address:</strong> {{property.address}}, {{property.city}}, {{property.state}} {{property.zipCode}}</p>
    <p><strong>Property Type:</strong> {{property.type}}</p>
    <p><strong>Building Area:</strong> {{property.buildingArea}} sq ft</p>
    <p><strong>Year Built:</strong> {{property.yearBuilt}}</p>
  </div>
  <div class="section">
    <h2>Valuation</h2>
    <p><strong>Approach:</strong> {{valuation.approach}}</p>
    <p><strong>Value:</strong> ${{valuation.value_amount}}</p>
    <p><strong>Confidence Score:</strong> {{valuation.confidence_score}}</p>
    <p><strong>Date:</strong> {{valuation.valuation_date}}</p>
  </div>
  {{#if comparables.length}}
  <div class="section">
    <h2>Comparable Properties</h2>
    <table>
      <tr>
        <th>Address</th>
        <th>Sale Price</th>
        <th>Distance</th>
        <th>Similarity</th>
      </tr>
      {{#each comparables}}
      <tr>
        <td>{{this.address}}</td>
        <td>\${{this.sale_price}}</td>
        <td>{{this.distance_miles}} mi</td>
        <td>{{this.similarity_score}}</td>
      </tr>
      {{/each}}
    </table>
  </div>
  {{/if}}
  <p><em>Generated on {{generatedDate}}</em></p>
</body>
</html>
  `.trim();
}

/**
 * Helper: Get appeal template
 */
function getAppealTemplate(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Appeal Package</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #333; }
    .section { margin: 20px 0; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <h1>Property Tax Appeal Package</h1>
  <div class="section">
    <h2>Appeal Information</h2>
    <p><strong>Appeal ID:</strong> {{appeal.appeal_id}}</p>
    <p><strong>Property:</strong> {{appeal.address}}, {{appeal.city}}, {{appeal.state}}</p>
    <p><strong>Tax Year:</strong> {{appeal.tax_year}}</p>
    <p><strong>Status:</strong> {{appeal.status}}</p>
    <p><strong>Filed Date:</strong> {{appeal.filed_date}}</p>
  </div>
  <div class="section">
    <h2>Values</h2>
    <p><strong>Current Assessed Value:</strong> ${{appeal.current_assessed_value}}</p>
    <p><strong>Claimed Value:</strong> ${{appeal.claimed_value}}</p>
  </div>
  {{#if evidence.length}}
  <div class="section">
    <h2>Evidence</h2>
    <table>
      <tr>
        <th>Type</th>
        <th>Title</th>
        <th>Uploaded</th>
      </tr>
      {{#each evidence}}
      <tr>
        <td>{{this.evidence_type}}</td>
        <td>{{this.title}}</td>
        <td>{{this.uploaded_at}}</td>
      </tr>
      {{/each}}
    </table>
  </div>
  {{/if}}
  <p><em>Generated on {{generatedDate}}</em></p>
</body>
</html>
  `.trim();
}
