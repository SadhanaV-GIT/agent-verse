const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const genId = () => `id-${Math.random().toString(36).substring(2, 9)}`;

// Agent 1 — Static Analysis
export const staticAPI = {
  analyze: async (prId, prTitle, files) => {
    await delay(1500);
    return {
      success: true,
      prId,
      issues: [
        { findingId: genId(), type: 'lint', severity: 'medium', filePath: files[0]?.path || 'src/app.js', message: 'Unused variable detected.', line: 2 },
        { findingId: genId(), type: 'style', severity: 'low', filePath: files[0]?.path || 'src/app.js', message: 'Avoid using var, use let or const.', line: 5 }
      ],
      summary: { medium: 1, low: 1 },
      status: 'completed'
    };
  },
  getResult: async (prId) => ({ 
    success: true, 
    data: { 
      status: 'completed', 
      issues: [
        { findingId: genId(), type: 'lint', severity: 'medium', filePath: 'src/app.js', message: 'Unused variable detected.', line: 2 },
        { findingId: genId(), type: 'style', severity: 'low', filePath: 'src/app.js', message: 'Avoid using var, use let or const.', line: 5 }
      ] 
    } 
  }),
  health: async () => ({ status: 'healthy', agent: 'Agent 1' }),
}

// Agent 2 — Architecture Review
export const architectureAPI = {
  review: async (prId, files) => {
    await delay(2000);
    return {
      success: true,
      issues: [
        { findingId: genId(), type: 'security', severity: 'critical', filePath: files[0]?.path || 'src/app.js', message: 'Potential SQL Injection.', rationale: 'Direct concatenation of userId into SQL query.', line: 11, rule: 'SOLID - Single Responsibility' },
        { findingId: genId(), type: 'design', severity: 'high', filePath: files[0]?.path || 'src/app.js', message: 'God class detected.', rationale: 'UserManager handles users, orders, payments, etc.', line: 20 }
      ]
    };
  },
  getResult: async (prId) => ({ 
    success: true, 
    data: { 
      issues: [
        { findingId: genId(), type: 'security', severity: 'critical', filePath: 'src/app.js', message: 'Potential SQL Injection.', rationale: 'Direct concatenation of userId into SQL query.', line: 11, rule: 'SOLID - Single Responsibility' },
        { findingId: genId(), type: 'design', severity: 'high', filePath: 'src/app.js', message: 'God class detected.', rationale: 'UserManager handles users, orders, payments, etc.', line: 20 }
      ]
    } 
  }),
  health: async () => ({ status: 'healthy', agent: 'Agent 2' }),
}

// Agent 3 — Explainer
export const explainerAPI = {
  explain: async (prId, issues) => {
    await delay(1500);
    return { success: true };
  },
  getResult: async (prId) => {
    await delay(300);
    return { success: true, data: { explanations: [
      { 
        findingId: 'security-issue', 
        severity: 'critical',
        originalMessage: 'Potential SQL Injection due to direct variable concatenation.',
        explanation: 'When you stitch variables directly into a SQL command string, you give attackers an opening. They can pass a malicious string instead of an ID, altering the command to read or drop entire tables.', 
        teachingNote: 'Always use parameterized queries (i.e. `?` or named parameters). The database driver will handle escaping unsafe characters automatically.',
        encouragement: 'Great job identifying where user input reaches the database! A small tweak here secures the whole app.'
      },
      { 
        findingId: 'architecture-issue', 
        severity: 'high',
        originalMessage: 'God class detected. UserManager handles multiple unrelated domains.',
        explanation: 'The `UserManager` class is doing too much. It is handling orders, products, and reports. When a class has many responsibilities, changing one part (like how we generate reports) might accidentally break another part (like user login).', 
        teachingNote: 'Think about the Single Responsibility Principle (SRP). A class should have one, and only one, reason to change.',
        encouragement: 'You’ve laid down a solid foundation. Refactoring this into separate managers early is the hallmark of a great developer!'
      }
    ] } };
  },
  health: async () => ({ status: 'healthy' }),
}

// Agent 4 — Refactor
export const refactorAPI = {
  suggest: async (prId, findings) => {
    await delay(2500);
    return { success: true };
  },
  getResult: async (prId) => {
    await delay(300);
    return { 
      success: true, 
      data: { 
        suggestions: [
          {
            findingId: genId(),
            status: 'valid',
            riskLevel: 'high',
            requiresTests: true,
            filePath: 'src/app.js',
            rationale: 'Replaced insecure string concatenation with a parameterized SQL query to prevent injection attacks.',
            diff: "- var data = db.query('SELECT * FROM users WHERE id = ' + userId);\n+ const data = db.query('SELECT * FROM users WHERE id = ?', [userId]);",
            originalCode: "var data = db.query('SELECT * FROM users WHERE id = ' + userId);",
            refactoredCode: "const data = db.query('SELECT * FROM users WHERE id = ?', [userId]);"
          },
          {
            findingId: genId(),
            status: 'valid',
            riskLevel: 'low',
            requiresTests: false,
            filePath: 'src/app.js',
            rationale: 'Swapped basic var with const to enforce immutability strictly.',
            diff: "- var result = [];\n+ const result = [];",
            originalCode: "var result = [];",
            refactoredCode: "const result = [];"
          },
          {
            findingId: genId(),
            status: 'skipped',
            riskLevel: 'high',
            requiresTests: true,
            filePath: 'src/app.js',
            rationale: 'UserManager god class requires substantial architectural redesign which exceeds safe automated refactoring constraints.',
            diff: "",
            originalCode: "class UserManager { ... }",
            refactoredCode: ""
          }
        ] 
      } 
    };
  },
  getByFinding: async (findingId) => {
    await delay(500);
    return { success: true, data: { 
      diff: "- var data = db.query('SELECT * FROM users WHERE id = ' + userId);\n+ const data = db.query('SELECT * FROM users WHERE id = ?', [userId]);",
      reasoning: "Parameterized queries prevent SQL injection.",
      status: 'validated'
    }};
  },
  health: async () => ({ status: 'healthy' }),
}

// Agent 5 — Progress
export const progressAPI = {
  update: async (developerId, developerName, prId, reviewDate, issues) => {
    await delay(1000);
    return { success: true };
  },
  getDeveloper: async (developerId) => {
    return { success: true, data: { radarData: [] } };
  },
  getDashboard: async (developerId) => {
    return { 
      success: true, 
      data: {
        developer: {
          developerName: "Demo User",
          totalPRsReviewed: 5,
          totalIssuesFound: 12
        },
        trendData: [
          { issueCount: 6, reviewDate: "2026-07-23" },
          { issueCount: 4, reviewDate: "2026-07-25" },
          { issueCount: 3, reviewDate: "2026-07-27" },
          { issueCount: 2, reviewDate: "2026-07-29" }
        ],
        severityBreakdown: { critical: 1, high: 3, medium: 5, low: 3 },
        topMistakes: [
          { type: 'No parameterized SQL', count: 4 },
          { type: 'God Class detected', count: 3 },
          { type: 'Unused variable', count: 2 },
          { type: 'Use const', count: 2 }
        ],
        growthScore: 88
      } 
    };
  },
  health: async () => ({ status: 'healthy' }),
}

// Agent 6 — Report
export const reportAPI = {
  generate: async (prId, prTitle, developerName) => {
    await delay(2000);
    return { success: true };
  },
  getReport: async (prId) => {
    await delay(500);
    return { success: true, data: { 
      prTitle: 'Feature: Refactor order processing service',
      summary: 'This PR introduces critical security vulnerabilities and architectural violations that should be addressed before merging.',
      developerTrendNote: 'You are improving in Clean Code, but please focus more on Security.',
      markdownReport: '# Code Review Report\\n\\n## Summary\\nMultiple critical issues found.\\n\\n## Top Issue\\nSQL Injection at line 11.',
      topIssues: [
        { severity: 'critical', message: 'Potential SQL Injection.', explanation: 'Direct string concatenation in query.', hasRefactor: true },
        { severity: 'high', message: 'God class detected.', explanation: 'UserManager handles 5 distinct domains.', hasRefactor: false }
      ],
      refactorHighlights: [
        { filePath: 'src/app.js', rationale: 'Replaced string concatenation with parameterized SQL query.', riskLevel: 'high' }
      ],
      agentOutputs: { agent1IssueCount: 2, agent2IssueCount: 2, agent3ExplanationCount: 2, agent4SuggestionCount: 1, developerPRCount: 1 }
    }};
  },
  health: async () => ({ status: 'healthy' }),
}
