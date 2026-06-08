export const businessTypeTasks = {
  'Sole Trader': [
    {
      id: 'st-1',
      name: 'Quarterly BAS Lodgement',
      description:
        'Your Business Activity Statement reports GST and PAYG instalments to the ATO. Lodging on time helps avoid penalties and keeps cash flow predictable.',
      dueDate: '2026-05-28',
      steps: [
        'Log in to ATO Online Services for Business',
        'Complete the BAS fields for GST collected and paid',
        'Submit and save your lodgement receipt',
      ],
    },
    {
      id: 'st-2',
      name: 'Superannuation Payment',
      description:
        'Super contributions for eligible workers must be paid by quarterly deadlines. Staying current protects your team and avoids super guarantee charges.',
      dueDate: '2026-06-19',
      steps: [
        'Check super amounts owing for each employee',
        'Pay via your clearing house',
        'Save payment confirmation for records',
      ],
    },
    {
      id: 'st-3',
      name: 'Business Name Renewal',
      description:
        'Renewing your ASIC business name keeps your trading identity active and compliant.',
      dueDate: '2026-07-15',
      steps: [
        'Open ASIC Connect',
        'Review renewal period and details',
        'Pay the renewal fee and keep receipt',
      ],
    },
  ],
  Retail: [
    {
      id: 'rt-1',
      name: 'PAYG Withholding Statement',
      description:
        'PAYG withholding reports tax withheld from wages. Accurate reporting helps avoid payroll compliance issues.',
      dueDate: '2026-05-10',
      steps: ['Download payroll summary', 'Complete PAYG withholding details', 'Submit to ATO and archive confirmation'],
    },
    {
      id: 'rt-2',
      name: 'Quarterly BAS Lodgement',
      description:
        'Your BAS reconciles GST and other obligations. Lodging on time supports smooth retail cash flow planning.',
      dueDate: '2026-05-18',
      steps: ['Review sales and GST totals', 'Complete BAS form', 'Lodge and save receipt'],
    },
    {
      id: 'rt-3',
      name: 'Workers Compensation Declaration',
      description:
        'Annual workers compensation declarations confirm wages and policy obligations for your team.',
      dueDate: '2026-06-12',
      steps: ['Gather annual wages figure', 'Complete insurer declaration form', 'Submit and retain confirmation'],
    },
  ],
  Hospitality: [
    {
      id: 'hs-1',
      name: 'Single Touch Payroll Finalisation',
      description:
        'STP finalisation confirms year-to-date payroll records for employees and the ATO.',
      dueDate: '2026-05-09',
      steps: ['Review payroll entries', 'Finalise STP event in payroll software', 'Notify employees records are tax ready'],
    },
    {
      id: 'hs-2',
      name: 'Quarterly Super Payment',
      description:
        'Hospitality rosters can change quickly, so super checks each quarter prevent underpayments.',
      dueDate: '2026-05-22',
      steps: ['Confirm eligible earnings', 'Process super payments', 'Save payment evidence'],
    },
    {
      id: 'hs-3',
      name: 'Food Business Registration Renewal',
      description:
        'Local council renewals keep your food service registration active.',
      dueDate: '2026-06-30',
      steps: ['Check council renewal notice', 'Update business details if needed', 'Pay and file certificate'],
    },
  ],
  Trades: [
    {
      id: 'tr-1',
      name: 'GST Instalment Review',
      description:
        'Reviewing GST instalments helps match your expected annual position and avoids end-of-year surprises.',
      dueDate: '2026-05-08',
      steps: ['Check prior BAS trends', 'Adjust instalment if required', 'Submit update to ATO'],
    },
    {
      id: 'tr-2',
      name: 'PAYG Instalment Notice',
      description:
        'PAYG instalments spread income tax payments over the year and keep obligations manageable.',
      dueDate: '2026-05-19',
      steps: ['Review income estimate', 'Confirm instalment amount', 'Pay by due date'],
    },
    {
      id: 'tr-3',
      name: 'Contractor Agreement Audit',
      description:
        'Periodic contract review supports sham contracting compliance and clear scope terms.',
      dueDate: '2026-06-15',
      steps: ['List active subcontractors', 'Review agreement terms', 'Update and archive signed copies'],
    },
  ],
  Consulting: [
    {
      id: 'cs-1',
      name: 'Quarterly BAS Lodgement',
      description:
        'Consulting income can be variable, so BAS lodgement keeps GST obligations transparent and controlled.',
      dueDate: '2026-05-11',
      steps: ['Compile invoices and expenses', 'Complete BAS in ATO portal', 'Submit and save reference number'],
    },
    {
      id: 'cs-2',
      name: 'Professional Indemnity Renewal',
      description:
        'Maintaining current indemnity cover is often required by client contracts and protects your practice.',
      dueDate: '2026-05-24',
      steps: ['Review policy coverage', 'Confirm annual turnover with insurer', 'Renew policy and file certificate'],
    },
    {
      id: 'cs-3',
      name: 'Income Tax Prepayment Check',
      description:
        'Checking prepayments early helps avoid year-end tax stress and supports smoother budgeting.',
      dueDate: '2026-06-20',
      steps: ['Estimate annual profit', 'Review PAYG paid to date', 'Set aside or adjust forecast amount'],
    },
  ],
  'Small Team': [
    {
      id: 'sm-1',
      name: 'PAYG Withholding Statement',
      description:
        'PAYG withholding keeps employee tax obligations current through regular reporting.',
      dueDate: '2026-05-07',
      steps: ['Export payroll withholding report', 'Complete ATO statement', 'Submit and record confirmation'],
    },
    {
      id: 'sm-2',
      name: 'Quarterly Super Payment',
      description:
        'Super guarantee contributions are a core employer obligation for small teams.',
      dueDate: '2026-05-21',
      steps: ['Validate employee balances', 'Pay through clearing house', 'Confirm all payments settled'],
    },
    {
      id: 'sm-3',
      name: 'Annual Leave Liability Review',
      description:
        'Reviewing leave balances helps maintain healthy payroll planning and compliance records.',
      dueDate: '2026-06-28',
      steps: ['Check leave balances in payroll', 'Review accrual accuracy', 'Document adjustments if needed'],
    },
  ],
};

export const demoUserProfile = {
  fullName: 'Jordan Miller',
  businessName: 'Miller Garden Services',
  email: 'jordan@example.com',
  state: 'NSW',
  type: 'Sole Trader',
};
