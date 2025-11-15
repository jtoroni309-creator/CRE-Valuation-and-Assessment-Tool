/**
 * Appeals service - Business logic for property tax appeals
 */

import { logger, NotFoundError } from '@axxiom/shared';
import { query, transaction } from '../database';

export interface Appeal {
  appealId: string;
  tenantId: string;
  propertyId: string;
  assessmentId?: string;
  appealType: string;
  taxYear: number;
  claimedValue?: number;
  currentAssessedValue?: number;
  grounds: string[];
  description: string;
  status: string;
  filedDate: Date;
  deadline?: Date;
  hearingDate?: Date;
  hearingLocation?: string;
  hearingType?: string;
  decision?: string;
  adjustedValue?: number;
  decisionDate?: Date;
  decisionReasoning?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Evidence {
  evidenceId: string;
  appealId: string;
  evidenceType: string;
  title: string;
  description?: string;
  documentUrl?: string;
  metadata?: Record<string, any>;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface TimelineEvent {
  eventId: string;
  appealId: string;
  eventType: string;
  eventDate: Date;
  description: string;
  performedBy?: string;
  metadata?: Record<string, any>;
}

export interface AppealStatistics {
  totalAppeals: number;
  byStatus: Record<string, number>;
  byDecision: Record<string, number>;
  averageProcessingDays: number;
  successRate: number;
  averageReduction: number;
  totalValueAdjustment: number;
}

/**
 * List appeals
 */
export async function listAppeals(
  tenantId: string,
  filters: {
    propertyId?: string;
    status?: string;
    taxYear?: number;
    limit: number;
    offset: number;
  }
): Promise<Appeal[]> {
  const whereClauses: string[] = [];
  const params: any[] = [tenantId];
  let paramIndex = 2;

  if (filters.propertyId) {
    whereClauses.push(`property_id = $${paramIndex++}`);
    params.push(filters.propertyId);
  }

  if (filters.status) {
    whereClauses.push(`status = $${paramIndex++}`);
    params.push(filters.status);
  }

  if (filters.taxYear) {
    whereClauses.push(`tax_year = $${paramIndex++}`);
    params.push(filters.taxYear);
  }

  const whereClause = whereClauses.length > 0 ? `AND ${whereClauses.join(' AND ')}` : '';

  const sql = `
    SELECT
      appeal_id,
      tenant_id,
      property_id,
      assessment_id,
      appeal_type,
      tax_year,
      claimed_value,
      current_assessed_value,
      grounds,
      description,
      status,
      filed_date,
      deadline,
      hearing_date,
      hearing_location,
      hearing_type,
      decision,
      adjusted_value,
      decision_date,
      decision_reasoning,
      created_by,
      created_at,
      updated_at
    FROM appeal_cases
    WHERE tenant_id = $1 ${whereClause}
    ORDER BY filed_date DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  params.push(filters.limit, filters.offset);

  const result = await query<Appeal>(sql, params, tenantId);
  return result.rows;
}

/**
 * Create new appeal
 */
export async function createAppeal(
  tenantId: string,
  userId: string,
  input: {
    propertyId: string;
    assessmentId?: string;
    appealType: string;
    taxYear: number;
    claimedValue?: number;
    grounds: string[];
    description: string;
    deadline?: string;
  }
): Promise<Appeal> {
  return transaction(async (client) => {
    // Get current assessed value if assessment provided
    let currentAssessedValue: number | undefined;
    if (input.assessmentId) {
      const assessmentResult = await client.query(
        `SELECT total_assessed_value FROM assessments WHERE assessment_id = $1 AND tenant_id = $2`,
        [input.assessmentId, tenantId]
      );
      if (assessmentResult.rows.length > 0) {
        currentAssessedValue = assessmentResult.rows[0].total_assessed_value;
      }
    }

    const result = await client.query<Appeal>(
      `INSERT INTO appeal_cases (
        tenant_id, property_id, assessment_id, appeal_type, tax_year,
        claimed_value, current_assessed_value, grounds, description,
        status, filed_date, deadline, created_by, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), $11, $12, NOW(), NOW())
      RETURNING *`,
      [
        tenantId,
        input.propertyId,
        input.assessmentId,
        input.appealType,
        input.taxYear,
        input.claimedValue,
        currentAssessedValue,
        JSON.stringify(input.grounds),
        input.description,
        'draft',
        input.deadline,
        userId,
      ]
    );

    const appeal = result.rows[0];

    // Create timeline event
    await client.query(
      `INSERT INTO appeal_timeline (
        appeal_id, event_type, event_date, description, performed_by
      ) VALUES ($1, $2, NOW(), $3, $4)`,
      [appeal.appealId, 'created', 'Appeal case created', userId]
    );

    logger.info({ tenantId, appealId: appeal.appealId }, 'Appeal created');

    return appeal;
  }, tenantId);
}

/**
 * Get appeal details
 */
export async function getAppeal(tenantId: string, appealId: string): Promise<Appeal> {
  const result = await query<Appeal>(
    `SELECT * FROM appeal_cases WHERE appeal_id = $1 AND tenant_id = $2`,
    [appealId, tenantId],
    tenantId
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('Appeal not found');
  }

  return result.rows[0];
}

/**
 * Update appeal
 */
export async function updateAppeal(
  tenantId: string,
  appealId: string,
  updates: {
    status?: string;
    claimedValue?: number;
    description?: string;
  }
): Promise<Appeal> {
  const setClauses: string[] = ['updated_at = NOW()'];
  const params: any[] = [];
  let paramIndex = 1;

  if (updates.status) {
    setClauses.push(`status = $${paramIndex++}`);
    params.push(updates.status);
  }

  if (updates.claimedValue !== undefined) {
    setClauses.push(`claimed_value = $${paramIndex++}`);
    params.push(updates.claimedValue);
  }

  if (updates.description) {
    setClauses.push(`description = $${paramIndex++}`);
    params.push(updates.description);
  }

  params.push(appealId, tenantId);

  const sql = `
    UPDATE appeal_cases
    SET ${setClauses.join(', ')}
    WHERE appeal_id = $${paramIndex++} AND tenant_id = $${paramIndex++}
    RETURNING *
  `;

  const result = await query<Appeal>(sql, params, tenantId);

  if (result.rows.length === 0) {
    throw new NotFoundError('Appeal not found');
  }

  return result.rows[0];
}

/**
 * Add evidence to appeal
 */
export async function addEvidence(
  tenantId: string,
  userId: string,
  appealId: string,
  evidence: {
    evidenceType: string;
    title: string;
    description?: string;
    documentUrl?: string;
    metadata?: Record<string, any>;
  }
): Promise<Evidence> {
  return transaction(async (client) => {
    // Verify appeal exists
    const appealResult = await client.query(
      `SELECT appeal_id FROM appeal_cases WHERE appeal_id = $1 AND tenant_id = $2`,
      [appealId, tenantId]
    );

    if (appealResult.rows.length === 0) {
      throw new NotFoundError('Appeal not found');
    }

    const result = await client.query<Evidence>(
      `INSERT INTO appeal_evidence (
        appeal_id, evidence_type, title, description, document_url,
        metadata, uploaded_by, uploaded_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *`,
      [
        appealId,
        evidence.evidenceType,
        evidence.title,
        evidence.description,
        evidence.documentUrl,
        JSON.stringify(evidence.metadata || {}),
        userId,
      ]
    );

    // Create timeline event
    await client.query(
      `INSERT INTO appeal_timeline (
        appeal_id, event_type, event_date, description, performed_by
      ) VALUES ($1, $2, NOW(), $3, $4)`,
      [appealId, 'evidence_added', `Evidence added: ${evidence.title}`, userId]
    );

    return result.rows[0];
  }, tenantId);
}

/**
 * List evidence for appeal
 */
export async function listEvidence(tenantId: string, appealId: string): Promise<Evidence[]> {
  const result = await query<Evidence>(
    `SELECT * FROM appeal_evidence WHERE appeal_id = $1 ORDER BY uploaded_at DESC`,
    [appealId],
    tenantId
  );

  return result.rows;
}

/**
 * AI-generate appeal argument
 */
export async function generateArgument(
  tenantId: string,
  appealId: string,
  options: {
    focusAreas?: string[];
    includeComparables: boolean;
    includeMarketAnalysis: boolean;
    tone: string;
  }
): Promise<{ argument: string; supportingData: any }> {
  // Get appeal details
  const appeal = await getAppeal(tenantId, appealId);

  // In production, this would call Azure OpenAI with RAG
  // For now, generate a template argument
  const argument = `
PROPERTY TAX APPEAL ARGUMENT

Appeal Case: ${appealId}
Tax Year: ${appeal.taxYear}
Property ID: ${appeal.propertyId}

GROUNDS FOR APPEAL:
${appeal.grounds.map((g, i) => `${i + 1}. ${g}`).join('\n')}

CLAIMED VALUE: $${appeal.claimedValue?.toLocaleString() || 'TBD'}
CURRENT ASSESSED VALUE: $${appeal.currentAssessedValue?.toLocaleString() || 'N/A'}

ARGUMENT:
${appeal.description}

${options.includeComparables ? `
COMPARABLE PROPERTIES ANALYSIS:
Based on recent sales of similar properties in the area, the current assessment
appears to be overstated. Comparable properties show lower values per square foot.
` : ''}

${options.includeMarketAnalysis ? `
MARKET CONDITIONS:
Current market conditions indicate a softening in commercial real estate values
in this submarket. Cap rates have increased and rental rates have declined.
` : ''}

CONCLUSION:
Based on the evidence presented, we respectfully request that the Board reduce
the assessed value to $${appeal.claimedValue?.toLocaleString() || 'a fair market value'}.
  `.trim();

  logger.info({ tenantId, appealId, tone: options.tone }, 'Generated appeal argument');

  return {
    argument,
    supportingData: {
      generatedAt: new Date().toISOString(),
      tone: options.tone,
      includesComparables: options.includeComparables,
      includesMarketAnalysis: options.includeMarketAnalysis,
    },
  };
}

/**
 * Schedule hearing
 */
export async function scheduleHearing(
  tenantId: string,
  userId: string,
  appealId: string,
  hearing: {
    hearingDate: string;
    location: string;
    hearingType: string;
    notes?: string;
  }
): Promise<Appeal> {
  return transaction(async (client) => {
    const result = await client.query<Appeal>(
      `UPDATE appeal_cases
       SET hearing_date = $1, hearing_location = $2, hearing_type = $3,
           status = 'hearing_scheduled', updated_at = NOW()
       WHERE appeal_id = $4 AND tenant_id = $5
       RETURNING *`,
      [hearing.hearingDate, hearing.location, hearing.hearingType, appealId, tenantId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Appeal not found');
    }

    // Create timeline event
    await client.query(
      `INSERT INTO appeal_timeline (
        appeal_id, event_type, event_date, description, performed_by, metadata
      ) VALUES ($1, $2, NOW(), $3, $4, $5)`,
      [
        appealId,
        'hearing_scheduled',
        `Hearing scheduled for ${hearing.hearingDate}`,
        userId,
        JSON.stringify({ location: hearing.location, type: hearing.hearingType, notes: hearing.notes }),
      ]
    );

    logger.info({ tenantId, appealId, hearingDate: hearing.hearingDate }, 'Hearing scheduled');

    return result.rows[0];
  }, tenantId);
}

/**
 * Submit appeal to board
 */
export async function submitAppeal(
  tenantId: string,
  userId: string,
  appealId: string
): Promise<Appeal> {
  return transaction(async (client) => {
    const result = await client.query<Appeal>(
      `UPDATE appeal_cases
       SET status = 'submitted', filed_date = NOW(), updated_at = NOW()
       WHERE appeal_id = $1 AND tenant_id = $2 AND status = 'draft'
       RETURNING *`,
      [appealId, tenantId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Appeal not found or already submitted');
    }

    // Create timeline event
    await client.query(
      `INSERT INTO appeal_timeline (
        appeal_id, event_type, event_date, description, performed_by
      ) VALUES ($1, $2, NOW(), $3, $4)`,
      [appealId, 'submitted', 'Appeal submitted to board', userId]
    );

    logger.info({ tenantId, appealId }, 'Appeal submitted');

    return result.rows[0];
  }, tenantId);
}

/**
 * Record appeal decision
 */
export async function recordDecision(
  tenantId: string,
  userId: string,
  appealId: string,
  decision: {
    decision: string;
    adjustedValue?: number;
    reasoning: string;
    effectiveDate: string;
  }
): Promise<Appeal> {
  return transaction(async (client) => {
    const result = await client.query<Appeal>(
      `UPDATE appeal_cases
       SET decision = $1, adjusted_value = $2, decision_reasoning = $3,
           decision_date = $4, status = 'decided', updated_at = NOW()
       WHERE appeal_id = $5 AND tenant_id = $6
       RETURNING *`,
      [decision.decision, decision.adjustedValue, decision.reasoning, decision.effectiveDate, appealId, tenantId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Appeal not found');
    }

    // Create timeline event
    await client.query(
      `INSERT INTO appeal_timeline (
        appeal_id, event_type, event_date, description, performed_by, metadata
      ) VALUES ($1, $2, NOW(), $3, $4, $5)`,
      [
        appealId,
        'decision_recorded',
        `Decision: ${decision.decision}`,
        userId,
        JSON.stringify({ decision: decision.decision, adjustedValue: decision.adjustedValue }),
      ]
    );

    logger.info({ tenantId, appealId, decision: decision.decision }, 'Decision recorded');

    return result.rows[0];
  }, tenantId);
}

/**
 * Get appeal timeline
 */
export async function getTimeline(tenantId: string, appealId: string): Promise<TimelineEvent[]> {
  const result = await query<TimelineEvent>(
    `SELECT * FROM appeal_timeline WHERE appeal_id = $1 ORDER BY event_date DESC`,
    [appealId],
    tenantId
  );

  return result.rows;
}

/**
 * Get appeal statistics
 */
export async function getStatistics(
  tenantId: string,
  taxYear?: number
): Promise<AppealStatistics> {
  const yearFilter = taxYear ? `AND tax_year = $2` : '';
  const params = taxYear ? [tenantId, taxYear] : [tenantId];

  // Overall stats
  const overallSql = `
    SELECT
      COUNT(*) as total_appeals,
      AVG(EXTRACT(EPOCH FROM (decision_date - filed_date)) / 86400) as avg_processing_days,
      COUNT(*) FILTER (WHERE decision IN ('granted', 'partially_granted')) as successful_appeals,
      AVG(CASE WHEN decision IN ('granted', 'partially_granted') AND current_assessed_value > 0
        THEN ((current_assessed_value - adjusted_value) / current_assessed_value * 100)
        ELSE 0 END) as avg_reduction_percent,
      SUM(CASE WHEN adjusted_value IS NOT NULL
        THEN (current_assessed_value - adjusted_value)
        ELSE 0 END) as total_value_adjustment
    FROM appeal_cases
    WHERE tenant_id = $1 ${yearFilter}
  `;

  const overallResult = await query(overallSql, params, tenantId);
  const overall = overallResult.rows[0];

  // By status
  const statusSql = `
    SELECT status, COUNT(*) as count
    FROM appeal_cases
    WHERE tenant_id = $1 ${yearFilter}
    GROUP BY status
  `;

  const statusResult = await query(statusSql, params, tenantId);
  const byStatus: Record<string, number> = {};
  statusResult.rows.forEach((row: any) => {
    byStatus[row.status] = parseInt(row.count);
  });

  // By decision
  const decisionSql = `
    SELECT decision, COUNT(*) as count
    FROM appeal_cases
    WHERE tenant_id = $1 AND decision IS NOT NULL ${yearFilter}
    GROUP BY decision
  `;

  const decisionResult = await query(decisionSql, params, tenantId);
  const byDecision: Record<string, number> = {};
  decisionResult.rows.forEach((row: any) => {
    byDecision[row.decision] = parseInt(row.count);
  });

  const totalAppeals = parseInt(overall.total_appeals);
  const successfulAppeals = parseInt(overall.successful_appeals || '0');

  return {
    totalAppeals,
    byStatus,
    byDecision,
    averageProcessingDays: parseFloat(overall.avg_processing_days || '0'),
    successRate: totalAppeals > 0 ? (successfulAppeals / totalAppeals) * 100 : 0,
    averageReduction: parseFloat(overall.avg_reduction_percent || '0'),
    totalValueAdjustment: parseFloat(overall.total_value_adjustment || '0'),
  };
}
