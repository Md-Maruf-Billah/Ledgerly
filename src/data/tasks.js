export const businessTypeTasks = {

  // ─── Sole Trader ────────────────────────────────────────────────────────────
  'Sole Trader': [
    {
      id: 'st-1',
      name: 'BAS Lodgement: Q3 FY2026',
      description:
        'Your Q3 Business Activity Statement (Jan–Mar) reports GST collected and PAYG instalments to the ATO. An overdue lodgement can attract penalties and interest charges.',
      dueDate: '2026-04-28',
      steps: [
        'Log in to ATO Online Services for Business or your tax agent portal',
        'Reconcile GST collected and GST credits for the quarter',
        'Enter PAYG instalment amount and any fuel tax credits',
        'Submit the BAS and save the confirmation reference number',
      ],
    },
    {
      id: 'st-2',
      name: 'PAYG Instalment: June Quarter',
      description:
        'Your PAYG instalment for the June quarter spreads income tax obligations across the year, preventing a large bill at tax time.',
      dueDate: '2026-06-21',
      steps: [
        'Check your ATO instalment notice for the amount due',
        'Review if your income has changed and adjust if needed',
        'Pay via ATO Online, BPAY, or your bank',
        'Save your payment receipt and note the reference number',
      ],
    },
    {
      id: 'st-3',
      name: 'BAS Lodgement: Q4 FY2026',
      description:
        'Your Q4 Business Activity Statement (Apr–Jun) closes out the financial year. Accurate reporting now avoids amendments later.',
      dueDate: '2026-07-28',
      steps: [
        'Export income and expense data from your bookkeeping software',
        'Reconcile GST collected and input tax credits for Apr–Jun',
        'Complete and lodge the BAS via ATO Business Portal',
        'Save the lodgement receipt and update your records',
      ],
    },
    {
      id: 'st-4',
      name: 'Superannuation Contribution: Q4',
      description:
        'If you pay yourself a wage or have employees, super contributions for the April–June quarter are due 28 July. Missing this triggers the super guarantee charge.',
      dueDate: '2026-07-28',
      steps: [
        'Calculate 12% of ordinary time earnings for the quarter',
        'Log in to your super clearing house or fund portal',
        'Submit the payment and download the payment confirmation',
        'Record the payment in your payroll or accounting software',
      ],
    },
    {
      id: 'st-5',
      name: 'Business Name Renewal (ASIC)',
      description:
        'Your ASIC business name registration must be renewed to keep your trading name active and legally protected.',
      dueDate: '2026-09-01',
      steps: [
        'Log in to ASIC Connect at connect.asic.gov.au',
        'Check the renewal period (1 year or 3 year) and confirm trading details',
        'Pay the renewal fee and download the renewal certificate',
        'Update your ABN registration if any business details have changed',
      ],
    },
    {
      id: 'st-6',
      name: 'Annual Tax Return: FY2026',
      description:
        'Your individual tax return for FY2026 (July 2025–June 2026) must be lodged by 31 October. Claiming all eligible deductions now keeps your tax bill as low as possible.',
      dueDate: '2026-10-31',
      steps: [
        'Gather all income summaries, invoices, and bank statements for FY2026',
        'List deductible expenses: home office, vehicle, tools, subscriptions',
        'Log in to myTax or brief your tax agent with all documents',
        'Review the return, check for errors, then lodge and save confirmation',
      ],
    },
  ],

  // ─── Retail ─────────────────────────────────────────────────────────────────
  Retail: [
    {
      id: 'rt-1',
      name: 'PAYG Withholding: May Statement',
      description:
        'Monthly PAYG withholding statements ensure tax withheld from employee wages is reported and paid to the ATO on time.',
      dueDate: '2026-05-21',
      steps: [
        'Run your payroll summary report for the month of May',
        'Confirm total gross wages and tax withheld figures',
        'Lodge the activity statement via ATO Business Portal',
        'Pay the withholding amount and archive the confirmation',
      ],
    },
    {
      id: 'rt-2',
      name: 'Workers Compensation Declaration',
      description:
        'Annual wages declaration to your workers compensation insurer confirms your payroll exposure and sets next year\'s premium.',
      dueDate: '2026-06-12',
      steps: [
        'Pull total wages and contractor payments for the policy period',
        'Log in to your insurer\'s online portal',
        'Complete the annual declaration form and submit',
        'Save the insurer confirmation and update your HR records',
      ],
    },
    {
      id: 'rt-3',
      name: 'STP Year-End Finalisation',
      description:
        'Single Touch Payroll finalisation confirms all employee payment summaries are correct so your staff can lodge their own tax returns.',
      dueDate: '2026-07-14',
      steps: [
        'Review all employee payroll records for FY2026 in your payroll software',
        'Correct any errors in wages, PAYG, or super figures',
        'Submit the finalisation event through STP-enabled software',
        'Notify employees that their income statement is tax-ready in myGov',
      ],
    },
    {
      id: 'rt-4',
      name: 'BAS Lodgement: Q4 FY2026',
      description:
        'Your quarterly BAS for April–June covers GST on retail sales and input credits on stock purchases. Getting it right now avoids a corrective amendment.',
      dueDate: '2026-07-28',
      steps: [
        'Reconcile POS sales data with your accounting software for Apr–Jun',
        'Check that all supplier invoices with GST credits are captured',
        'Lodge the BAS via ATO Business Portal or your bookkeeper',
        'Pay any GST owing and save the lodgement receipt',
      ],
    },
    {
      id: 'rt-5',
      name: 'Superannuation Payment: Q4',
      description:
        'Super guarantee payments for all eligible retail staff for the April–June quarter must clear your clearing house by 28 July.',
      dueDate: '2026-07-28',
      steps: [
        'Calculate 12% of each employee\'s ordinary time earnings for Q4',
        'Log in to your super clearing house and enter contribution amounts',
        'Submit and allow 3–5 business days for processing to funds',
        'Download payment confirmation and file against each employee record',
      ],
    },
    {
      id: 'rt-6',
      name: 'Annual Tax Return: FY2026',
      description:
        'Your business and/or individual tax return for FY2026 captures all retail income, cost of goods sold, and operating expenses.',
      dueDate: '2026-10-31',
      steps: [
        'Reconcile all income, COGS, and expense accounts in your accounting software',
        'Prepare a depreciation schedule for fixtures, fittings, and equipment',
        'Provide your accountant or tax agent with all FY2026 financial reports',
        'Review the draft return, approve, and lodge before the deadline',
      ],
    },
  ],

  // ─── Hospitality ────────────────────────────────────────────────────────────
  Hospitality: [
    {
      id: 'hs-1',
      name: 'STP Finalisation: FY2026',
      description:
        'Finalising your Single Touch Payroll data lets employees access their income statements via myGov so they can lodge their tax returns.',
      dueDate: '2026-07-14',
      steps: [
        'Check all staff payroll records in your STP-enabled software',
        'Review and correct any discrepancies in wages, allowances, or PAYG',
        'Submit the year-end finalisation event to the ATO',
        'Inform staff their income statements are available in myGov',
      ],
    },
    {
      id: 'hs-2',
      name: 'Quarterly Super Payment: Q4',
      description:
        'Casual and part-time hospitality rosters make super underpayments easy to miss. Confirming all eligible hours prevents super guarantee charges.',
      dueDate: '2026-07-28',
      steps: [
        'Export all timesheets and confirm ordinary time earnings per employee',
        'Calculate 12% super on eligible earnings including casual loadings',
        'Submit contributions through your clearing house before the deadline',
        'Save payment receipts against each employee\'s payroll record',
      ],
    },
    {
      id: 'hs-3',
      name: 'Food Business Licence Renewal',
      description:
        'Your local council food business registration must be renewed annually to legally operate and pass health inspections.',
      dueDate: '2026-07-01',
      steps: [
        'Check your renewal notice from the local council for fees and forms',
        'Confirm business name, premises address, and food handling category are current',
        'Pay the renewal fee online or in person at the council office',
        'Display the renewed certificate prominently at your premises',
      ],
    },
    {
      id: 'hs-4',
      name: 'BAS Lodgement: Q4 FY2026',
      description:
        'Your Q4 BAS captures GST on food, beverage, and function sales for April–June and closes out your FY2026 GST position.',
      dueDate: '2026-07-28',
      steps: [
        'Pull POS and event sales reports for April, May, and June',
        'Separate GST-free food sales from GST-taxable alcohol and processed items',
        'Enter figures into ATO Business Portal and review for accuracy',
        'Lodge, pay any GST balance, and save the confirmation receipt',
      ],
    },
    {
      id: 'hs-5',
      name: 'Liquor Licence Renewal',
      description:
        'Your state liquor authority licence must be renewed to legally sell or serve alcohol on premises. Late renewal can lead to immediate trading restrictions.',
      dueDate: '2026-08-31',
      steps: [
        'Locate your current licence and confirm the renewal date with your state authority',
        'Complete the online renewal application with updated responsible service details',
        'Pay the annual licence fee and upload any required RSA certificates',
        'Display the renewed licence as required by your state liquor laws',
      ],
    },
    {
      id: 'hs-6',
      name: 'Annual Tax Return: FY2026',
      description:
        'Your hospitality business tax return for FY2026 must capture all revenue streams, food cost, wages, and occupancy expenses.',
      dueDate: '2026-10-31',
      steps: [
        'Export P&L and balance sheet reports from your accounting software',
        'Prepare a list of capital purchases (equipment, fitout) for depreciation',
        'Forward all financials and receipts to your accountant or tax agent',
        'Approve the final return and ensure lodgement by 31 October',
      ],
    },
  ],

  // ─── Trades ─────────────────────────────────────────────────────────────────
  Trades: [
    {
      id: 'tr-1',
      name: 'GST Instalment: Q3 Review',
      description:
        'If your annual GST turnover is between $10M and $20M you lodge quarterly instalments. Reviewing the amount now avoids a large true-up at year end.',
      dueDate: '2026-04-28',
      steps: [
        'Log in to ATO Online Services and check the instalment amount',
        'Compare actual GST liabilities with the instalment to see if a variation is needed',
        'Vary the instalment if your income has dropped significantly',
        'Pay the instalment and save the reference number',
      ],
    },
    {
      id: 'tr-2',
      name: 'Contractor Licence Renewal',
      description:
        'Your contractor or builder\'s licence issued by your state authority must be renewed to legally quote and carry out licensed trade work.',
      dueDate: '2026-06-14',
      steps: [
        'Check your licence expiry date at your state authority\'s portal',
        'Complete the renewal application and attach any required CPD evidence',
        'Pay the renewal fee and save the new licence number',
        'Update your licence number on all quotes, contracts, and signage',
      ],
    },
    {
      id: 'tr-3',
      name: 'Workers Compensation Renewal',
      description:
        'Annual workers compensation policy renewal ensures your employees and subcontractors are covered for workplace injuries.',
      dueDate: '2026-07-15',
      steps: [
        'Gather actual wages paid to employees and contractors for the year',
        'Contact your insurer or complete online renewal with wages declaration',
        'Review coverage limits and include any new employees or trade categories',
        'Pay the premium and file the renewal certificate',
      ],
    },
    {
      id: 'tr-4',
      name: 'BAS Lodgement: Q4 FY2026',
      description:
        'Your Q4 BAS captures GST on jobs invoiced during April–June and input tax credits on materials and equipment purchased.',
      dueDate: '2026-07-28',
      steps: [
        'Export all tax invoices raised and supplier bills received for Apr–Jun',
        'Reconcile GST collected against GST credits for materials and subcontractors',
        'Lodge via ATO Business Portal and note the lodgement reference',
        'Pay any net GST owing and file the confirmation',
      ],
    },
    {
      id: 'tr-5',
      name: 'Subcontractor TPAR Preparation',
      description:
        'The Taxable Payments Annual Report (TPAR) must be lodged by 28 August for all building and construction businesses that pay subcontractors.',
      dueDate: '2026-08-28',
      steps: [
        'List all subcontractors paid during FY2026 with their ABN and amounts',
        'Verify each subcontractor\'s ABN at abr.business.gov.au',
        'Enter payment data into your accounting software or ATO\'s TPAR tool',
        'Lodge the TPAR by 28 August and save the ATO confirmation',
      ],
    },
    {
      id: 'tr-6',
      name: 'Annual Tax Return: FY2026',
      description:
        'Your trades business tax return for FY2026 must capture all job revenue, materials, tools, vehicle costs, and home-office deductions.',
      dueDate: '2026-10-31',
      steps: [
        'Compile a full list of income from jobs completed in FY2026',
        'List all deductible expenses: tools, vehicle (logbook method), protective gear',
        'Calculate depreciation on plant and equipment purchased during the year',
        'Lodge via myTax or through your tax agent before 31 October',
      ],
    },
  ],

  // ─── Consulting ─────────────────────────────────────────────────────────────
  Consulting: [
    {
      id: 'cs-1',
      name: 'BAS Lodgement: Q3 FY2026',
      description:
        'Your Q3 BAS (Jan–Mar) reports GST on consulting fees and input credits on business expenses. Variable consulting income makes accurate reporting especially important.',
      dueDate: '2026-04-28',
      steps: [
        'Export all invoices issued and expenses paid for Jan–Mar from your accounting tool',
        'Confirm GST collected on all taxable consulting invoices',
        'Claim input tax credits on eligible business expenses',
        'Lodge the BAS and save the confirmation number',
      ],
    },
    {
      id: 'cs-2',
      name: 'Professional Indemnity Renewal',
      description:
        'PI insurance covers claims arising from advice or services you\'ve provided. Many client contracts require you to maintain current cover at specified limits.',
      dueDate: '2026-06-20',
      steps: [
        'Review your current policy schedule for coverage limits and exclusions',
        'Estimate your projected annual fee income for the renewal period',
        'Compare quotes or renew with your current insurer before the expiry date',
        'Save the certificate of currency and send a copy to any clients who require it',
      ],
    },
    {
      id: 'cs-3',
      name: 'PAYG Instalment: June Quarter',
      description:
        'Consulting income can spike, making June quarter PAYG instalments critical for avoiding a large year-end tax bill.',
      dueDate: '2026-06-28',
      steps: [
        'Log in to ATO Business Portal and check the Q4 instalment notice',
        'Compare instalment amount to your actual income for the quarter',
        'Vary the instalment down if income has dropped significantly',
        'Pay the amount due and note the transaction reference',
      ],
    },
    {
      id: 'cs-4',
      name: 'BAS Lodgement: Q4 FY2026',
      description:
        'Your Q4 BAS closes out FY2026 GST reporting for April–June. Accurate lodgement now avoids a corrective amendment after tax return time.',
      dueDate: '2026-07-28',
      steps: [
        'Reconcile all consulting invoices raised and expenses incurred for Apr–Jun',
        'Check for any unpaid invoices that fall outside the cash or accruals basis',
        'Lodge the BAS via the ATO portal or your bookkeeper',
        'Pay any net GST and file the receipt',
      ],
    },
    {
      id: 'cs-5',
      name: 'Continuing Professional Development Log',
      description:
        'Most professional bodies require a set number of CPD hours per year. Completing your log now avoids a rush before your membership renewal.',
      dueDate: '2026-09-30',
      steps: [
        'Log in to your professional body\'s CPD portal and check hours accumulated',
        'List any completed training, webinars, conferences, or self-directed study',
        'Upload supporting evidence where required (certificates, attendance records)',
        'Submit your CPD declaration and save the completion receipt',
      ],
    },
    {
      id: 'cs-6',
      name: 'Annual Tax Return: FY2026',
      description:
        'Your consulting business and individual tax return for FY2026 captures all fee income, home office costs, subscriptions, and professional development expenses.',
      dueDate: '2026-10-31',
      steps: [
        'Prepare a summary of all consulting income invoiced in FY2026',
        'List deductible expenses: home office, software subscriptions, professional fees, CPD',
        'Gather private health insurance details and any other personal deductions',
        'Lodge via myTax or provide all documents to your tax agent by the deadline',
      ],
    },
  ],

  // ─── Small Team ─────────────────────────────────────────────────────────────
  'Small Team': [
    {
      id: 'sm-1',
      name: 'PAYG Withholding: May Payment',
      description:
        'Monthly PAYG withholding ensures tax deducted from your team\'s wages is remitted to the ATO on time, keeping payroll compliant.',
      dueDate: '2026-05-21',
      steps: [
        'Run your May payroll summary and confirm total tax withheld',
        'Log in to ATO Business Portal and create an activity statement',
        'Enter the PAYG withholding amount and lodge the statement',
        'Transfer the payment to the ATO and archive the receipt',
      ],
    },
    {
      id: 'sm-2',
      name: 'STP Year-End Finalisation',
      description:
        'Finalising STP confirms your team\'s income statements so they can access their payment summaries in myGov and lodge their tax returns.',
      dueDate: '2026-07-14',
      steps: [
        'Review all employee records in your payroll software for the full FY2026',
        'Correct any discrepancies in gross wages, PAYG withheld, or super reported',
        'Submit the STP finalisation event through your payroll software',
        'Notify all employees their income statement is ready in myGov',
      ],
    },
    {
      id: 'sm-3',
      name: 'Superannuation Payment: Q4',
      description:
        'Super contributions for all eligible employees for the April–June quarter must clear your clearing house by 28 July to avoid the super guarantee charge.',
      dueDate: '2026-07-28',
      steps: [
        'Calculate 12% of each employee\'s ordinary time earnings for Q4',
        'Log in to your super clearing house portal (e.g. ATO Small Business Super)',
        'Enter each employee\'s fund details and contribution amount',
        'Submit and save the payment confirmation for each employee',
      ],
    },
    {
      id: 'sm-4',
      name: 'BAS Lodgement: Q4 FY2026',
      description:
        'Your Q4 BAS for April–June closes out FY2026 GST reporting and should be lodged promptly to give you a clear picture before year-end accounts.',
      dueDate: '2026-07-28',
      steps: [
        'Reconcile all sales and purchases in your accounting software for Q4',
        'Confirm GST collected and input tax credits claimed are accurate',
        'Lodge the BAS via ATO Business Portal or through your bookkeeper',
        'Pay any net GST and file the lodgement confirmation',
      ],
    },
    {
      id: 'sm-5',
      name: 'Annual Leave Liability Review',
      description:
        'Reviewing accumulated annual leave balances helps you manage payroll liabilities, plan staffing during slow periods, and stay compliant with the Fair Work Act.',
      dueDate: '2026-08-15',
      steps: [
        'Export a leave balance report for all employees from your payroll software',
        'Identify staff with excessive balances (typically more than 8 weeks)',
        'Consult Fair Work guidelines and consider sending excess leave notices',
        'Update payroll records and document any leave agreements made',
      ],
    },
    {
      id: 'sm-6',
      name: 'Annual Tax Return: FY2026',
      description:
        'Your business tax return for FY2026 must capture all income, wages, super, and operating expenses. Completing it accurately now avoids costly amendments.',
      dueDate: '2026-10-31',
      steps: [
        'Prepare your FY2026 profit and loss statement and balance sheet',
        'Reconcile wages, super paid, and PAYG withholding reported via STP',
        'Gather all receipts for deductible business expenses',
        'Lodge via your tax agent or myTax and save the ATO confirmation',
      ],
    },
  ],

};

const ANNUAL_PLANNING_TASKS = [
  {
    key: 'eofy-records',
    name: 'EOFY Records Checkpoint',
    description:
      'A planning checkpoint to make sure the records behind your year-end figures are complete before the final June rush.',
    dueDate: '2026-06-18',
    priority: 'high',
    steps: [
      'Reconcile bank and card transactions through the end of May',
      'Match uncategorised transactions to receipts or invoices',
      'List missing records and assign an owner for each one',
      'Book a final June reconciliation session',
    ],
  },
  {
    key: 'asset-deductions',
    name: 'Asset and Deductions Review',
    description:
      'Review larger purchases and common deductions before year end so your accountant receives a clean, useful record.',
    dueDate: '2026-06-25',
    priority: 'high',
    steps: [
      'List equipment and assets purchased during the financial year',
      'Gather invoices for subscriptions, insurance, vehicle, and home office costs',
      'Flag mixed personal and business expenses for review',
      'Save the summary with your year-end records',
    ],
  },
  {
    key: 'year-end-reconcile',
    name: 'Year-End Accounts Reconciliation',
    description:
      'A practical July checkpoint to close the books, investigate differences, and prepare reliable opening balances.',
    dueDate: '2026-07-07',
    priority: 'high',
    steps: [
      'Reconcile bank, credit card, and payment platform balances to 30 June',
      'Review outstanding invoices and bills for accuracy',
      'Check owner drawings, loans, and transfers are correctly classified',
      'Export a draft profit and loss and balance sheet',
    ],
  },
  {
    key: 'tax-records-pack',
    name: 'Tax Records Pack',
    description:
      'Collect the documents your tax professional or future self will need, then store them as one organised year-end pack.',
    dueDate: '2026-07-21',
    priority: 'medium',
    steps: [
      'Collect financial reports, receipts, and major purchase invoices',
      'Add payroll, super, and contractor summaries where relevant',
      'Write down unresolved questions for your tax professional',
      'Store the pack in a secure folder with a clear financial-year label',
    ],
  },
  {
    key: 'q1-cashflow',
    name: 'Quarter One Cash-Flow Review',
    description:
      'Check the first weeks of the new financial year and adjust tax set-asides before small gaps become expensive surprises.',
    dueDate: '2026-08-18',
    priority: 'medium',
    steps: [
      'Compare actual July income and expenses with your forecast',
      'Review the amount reserved for tax and GST',
      'Identify invoices that need follow-up',
      'Adjust the next eight weeks of planned spending',
    ],
  },
  {
    key: 'sep-quarter',
    name: 'September Quarter Records Check',
    description:
      'A planning checkpoint to have the September quarter records ready before lodgement work begins.',
    dueDate: '2026-10-15',
    priority: 'medium',
    steps: [
      'Reconcile July to September transactions',
      'Review sales, purchases, payroll, and contractor records',
      'Resolve uncategorised items and duplicate entries',
      'Prepare a short quarter summary for lodgement',
    ],
  },
  {
    key: 'dec-quarter',
    name: 'December Quarter Records Check',
    description:
      'Start the new calendar year with the December quarter reconciled and the next obligations clearly planned.',
    dueDate: '2027-01-15',
    priority: 'medium',
    steps: [
      'Reconcile October to December transactions',
      'Review payroll and super records where relevant',
      'Check outstanding customer and supplier balances',
      'Schedule the quarter lodgement work',
    ],
  },
  {
    key: 'mar-quarter',
    name: 'March Quarter Records Check',
    description:
      'Prepare the March quarter records early and note any issues that need professional advice before year end.',
    dueDate: '2027-04-15',
    priority: 'medium',
    steps: [
      'Reconcile January to March transactions',
      'Check revenue and expense coding for unusual movements',
      'Review payroll, super, and contractor records where relevant',
      'List unresolved questions before lodgement',
    ],
  },
  {
    key: 'next-eofy',
    name: 'Next EOFY Readiness Review',
    description:
      'A calm early start for the next year end, focused on missing records, major purchases, and work that should not wait until June.',
    dueDate: '2027-05-28',
    priority: 'medium',
    steps: [
      'Review record completeness for the financial year to date',
      'Check asset purchases and disposal records',
      'Confirm payroll and contractor information is current',
      'Create a short June close plan',
    ],
  },
];

const EMPLOYER_TRANSITION_TASKS = [
  {
    key: 'payday-super-readiness',
    name: 'Payday Super Readiness Check',
    description:
      'Payday Super begins on 1 July 2026. Use this checkpoint to confirm your payroll and payment process is ready for the change.',
    dueDate: '2026-06-24',
    priority: 'high',
    steps: [
      'Confirm your payroll software is ready for Payday Super',
      'Review employee fund details and resolve rejected information',
      'Confirm the payment process and internal owner',
      'Run a test checklist before the first July payday',
    ],
  },
  {
    key: 'payroll-close',
    name: 'Payroll Year-End Reconciliation',
    description:
      'Reconcile payroll categories, withholding, leave, and reported totals before completing year-end declarations.',
    dueDate: '2026-07-09',
    priority: 'high',
    steps: [
      'Compare payroll reports with the general ledger',
      'Review allowances, deductions, termination payments, and leave',
      'Correct employee details and year-to-date differences',
      'Save a reconciliation report for the finalisation record',
    ],
  },
];

const EMPLOYER_TYPES = new Set(['Retail', 'Hospitality', 'Small Team']);

Object.entries(businessTypeTasks).forEach(([type, tasks]) => {
  const prefix = type.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const planningTasks = [
    ...ANNUAL_PLANNING_TASKS,
    ...(EMPLOYER_TYPES.has(type) ? EMPLOYER_TRANSITION_TASKS : []),
  ].map((task) => ({
    ...task,
    id: `${prefix}-plan-${task.key}`,
    isPlanning: true,
  }));

  businessTypeTasks[type] = [...tasks, ...planningTasks]
    .sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)));
});

export const demoUserProfile = {
  fullName: 'Jordan Miller',
  businessName: 'Miller Garden Services',
  email: 'jordan@example.com',
  state: 'NSW',
  type: 'Sole Trader',
};
