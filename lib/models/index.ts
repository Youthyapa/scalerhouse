// lib/models/index.ts
// All Mongoose models for ScalerHouse

import mongoose, { Schema, model, models, Document } from 'mongoose';

// ─── Employee ───────────────────────────────────────────────────────────────
const TaskSchema = new Schema({
    title: String,
    description: String,
    status: { type: String, enum: ['Pending', 'In Progress', 'Done'], default: 'Pending' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    dueDate: String,
    createdAt: { type: String, default: () => new Date().toISOString() },
});

const EmployeeSchema = new Schema({
    _id: String,
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    passwordHash: String,  // bcrypt hash
    role: {
        type: String,
        enum: ['Sales Executive', 'Digital Marketing Executive', 'SEO Specialist', 'Ads Manager', 'HR Manager', 'Accounts Manager', 'Admin'],
        default: 'Sales Executive',
    },
    department: String,
    assignedLeads: [String],
    assignedClients: [String],
    tasks: [TaskSchema],
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    joinedAt: String,
    performanceScore: { type: Number, default: 0 },
}, { _id: false, timestamps: false });

// ─── Lead ───────────────────────────────────────────────────────────────────
const LeadSchema = new Schema({
    _id: String,
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    company: String,
    service: String,
    budget: String,
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'],
        default: 'New',
    },
    source: String,
    score: { type: Number, default: 50 },
    notes: String,
    assignedTo: String,
    proposalUrl: String,
    followUpDate: String,
    affiliateId: String,
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
}, { _id: false });

// ─── Client ─────────────────────────────────────────────────────────────────
const InvoiceSchema = new Schema({
    id: String,
    amount: Number,
    status: { type: String, enum: ['Pending', 'Paid', 'Overdue'], default: 'Pending' },
    dueDate: String,
    paidDate: String,
    description: String,
}, { _id: false });

const TimelineSchema = new Schema({
    id: String,
    title: String,
    description: String,
    status: { type: String, enum: ['Done', 'In Progress', 'Pending'], default: 'Pending' },
    date: String,
}, { _id: false });

const ReportSchema = new Schema({
    id: String,
    title: String,
    url: String,
    uploadedAt: String,
}, { _id: false });

const ClientSchema = new Schema({
    _id: String,
    name: String,
    email: { type: String, required: true },
    phone: String,
    company: String,
    service: String,
    projectName: String,
    budget: String,
    specialRequirements: String,
    status: { type: String, enum: ['Active', 'On Hold', 'Completed'], default: 'Active' },
    passwordHash: String,
    startDate: String,
    endDate: String,
    invoices: [InvoiceSchema],
    timeline: [TimelineSchema],
    reports: [ReportSchema],
    assignedEmployees: [String],
    createdAt: { type: String, default: () => new Date().toISOString() },
}, { _id: false });

// ─── Affiliate ──────────────────────────────────────────────────────────────
const PayoutSchema = new Schema({
    id: String,
    amount: Number,
    status: { type: String, enum: ['Requested', 'Processing', 'Paid'], default: 'Requested' },
    requestedAt: String,
    paidAt: String,
}, { _id: false });

const AffiliateSchema = new Schema({
    _id: String,
    name: String,
    email: { type: String, required: true, unique: true },
    phone: String,
    pan: String,
    bank: String,
    city: String,
    commissionRate: String,
    notes: String,
    extraFields: [{ label: String, value: String }],
    passwordHash: String,
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    walletBalance: { type: Number, default: 0 },
    leads: [String],
    payouts: [PayoutSchema],
    createdAt: { type: String, default: () => new Date().toISOString() },
}, { _id: false });

// ─── Proposal ───────────────────────────────────────────────────────────────
const ProposalSchema = new Schema({
    _id: String,
    leadId: String,
    clientName: String,
    service: String,
    budget: Number,
    discount: Number,
    timeline: String,
    features: [String],
    status: { type: String, enum: ['Draft', 'Sent', 'Accepted', 'Rejected'], default: 'Draft' },
    createdAt: { type: String, default: () => new Date().toISOString() },
}, { _id: false });

// ─── Offer ──────────────────────────────────────────────────────────────────
const OfferSchema = new Schema({
    _id: String,
    title: String,
    description: String,
    couponCode: String,
    discount: Number,
    discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    startDate: String,
    endDate: String,
    pages: [String],
    isActive: { type: Boolean, default: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
}, { _id: false });

// ─── Blog ───────────────────────────────────────────────────────────────────
const BlogPostSchema = new Schema({
    _id: String,
    title: String,
    slug: { type: String, unique: true },
    excerpt: String,
    content: String,
    category: String,
    author: String,
    coverImage: String,
    publishedAt: String,
    status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
}, { _id: false });

// ─── Ticket ─────────────────────────────────────────────────────────────────
const TicketMessageSchema = new Schema({
    id: String,
    from: String,
    message: String,
    timestamp: String,
}, { _id: false });

const TicketSchema = new Schema({
    _id: String,
    subject: String,
    description: String,
    status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    raisedBy: String,
    raisedByRole: String,
    assignedTo: String,
    messages: [TicketMessageSchema],
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
}, { _id: false });

// ─── Career ─────────────────────────────────────────────────────────────────
const CareerSchema = new Schema({
    _id: String,
    title: String,
    department: String,
    location: String,
    type: { type: String, enum: ['Full-time', 'Part-time', 'Remote', 'Internship'], default: 'Full-time' },
    description: String,
    requirements: [String],
    isActive: { type: Boolean, default: true },
    postedAt: String,
}, { _id: false });

// ─── Application ─────────────────────────────────────────────────────────────
const ApplicationSchema = new Schema({
    careerId: { type: String, required: true },
    jobTitle: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    linkedIn: String,
    portfolio: String,
    expectedCTC: String,
    coverLetter: String,
    resumeUrl: String,
    resumeFileName: String,
    resumePublicId: String,
    status: {
        type: String,
        enum: ['New', 'Shortlisted', 'On Hold', 'Interview Scheduled', 'Selected', 'Rejected'],
        default: 'New',
    },
    notes: { type: String, default: '' },
    docsSubmitted: { type: Boolean, default: false },
    appliedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// ─── Onboarding ───────────────────────────────────────────────────────────────
const OnboardingSchema = new Schema({
    employeeId: { type: String, required: false, default: '' },
    applicationId: { type: String, index: true },  // set before hire; replaced by employeeId after
    email: { type: String, required: true },
    // Step 1: Personal
    dob: String,
    gender: String,
    permanentAddress: String,
    currentAddress: String,
    // Step 2: Bank & Tax
    bankAccountNumber: String,
    ifscCode: String,
    bankName: String,
    panNumber: String,
    // Step 3: Emergency Contact
    emergencyContactName: String,
    emergencyContactRelation: String,
    emergencyContactPhone: String,
    // Step 4: Documents
    aadhaarUrl: String,
    panCardUrl: String,
    degreeUrl: String,
    experienceLetterUrl: String,
    passportPhotoUrl: String,
    // Step 5: Declaration
    declarationAccepted: { type: Boolean, default: false },
    completedSteps: { type: [Number], default: [] },
    isComplete: { type: Boolean, default: false },
    submittedAt: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// ─── OnboardingToken ──────────────────────────────────────────────────────────
// One-time secure token sent to selected candidates to submit docs without login
const OnboardingTokenSchema = new Schema({
    token: { type: String, required: true, unique: true },
    applicationId: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    jobTitle: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

// ─── ContentItem (Dynamic Homepage/Global Content) ──────────────────────────
const ContentItemSchema = new Schema({
    _id: String,
    type: { type: String, required: true, enum: ['client_logo', 'achievement', 'news_link', 'faq'] },
    title: { type: String, required: true },
    imageUrl: String,
    linkUrl: String,
    description: String,
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    createdAt: { type: String, default: () => new Date().toISOString() },
}, { _id: false });

// ─── Service ────────────────────────────────────────────────────────────────
const ServiceSchema = new Schema({
    _id: String,
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    iconEmoji: { type: String, default: '⚙️' },
    description: String,
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    createdAt: { type: String, default: () => new Date().toISOString() },
}, { _id: false });

// ─── ServicePackage ─────────────────────────────────────────────────────────
const ServicePackageSchema = new Schema({
    _id: String,
    serviceSlug: String,
    name: String,
    price: String,
    priceNote: String,
    deliverables: [String],
    isPopular: { type: Boolean, default: false },
    ctaLabel: String,
}, { _id: false });

// ─── Activity Log ───────────────────────────────────────────────────────────
const ActivityLogSchema = new Schema({
    _id: String,
    message: String,
    actor: String,
    timestamp: { type: String, default: () => new Date().toISOString() },
}, { _id: false });

// ─── Contact Form Submission ─────────────────────────────────────────────────
const ContactSubmissionSchema = new Schema({
    name: String,
    email: String,
    phone: String,
    company: String,
    service: String,
    message: String,
    submittedAt: { type: Date, default: Date.now },
});

// ─── Export models (with cache to avoid recompile in dev) ───────────────────
export const EmployeeModel = models.Employee || model('Employee', EmployeeSchema);
export const LeadModel = models.Lead || model('Lead', LeadSchema);
export const ClientModel = models.Client || model('Client', ClientSchema);
export const AffiliateModel = models.Affiliate || model('Affiliate', AffiliateSchema);
export const ProposalModel = models.Proposal || model('Proposal', ProposalSchema);
export const OfferModel = models.Offer || model('Offer', OfferSchema);
export const BlogPostModel = models.BlogPost || model('BlogPost', BlogPostSchema);
export const TicketModel = models.Ticket || model('Ticket', TicketSchema);
export const CareerModel = models.Career || model('Career', CareerSchema);
export const ServiceModel = models.Service || model('Service', ServiceSchema);
export const ServicePackageModel = models.ServicePackage || model('ServicePackage', ServicePackageSchema);
export const ContentItemModel = models.ContentItem || model('ContentItem', ContentItemSchema);
export const ActivityLogModel = models.ActivityLog || model('ActivityLog', ActivityLogSchema);
export const ContactModel = models.Contact || model('Contact', ContactSubmissionSchema);
export const ApplicationModel = models.Application || model('Application', ApplicationSchema);
export const OnboardingModel = models.Onboarding || model('Onboarding', OnboardingSchema);
export const OnboardingTokenModel = models.OnboardingToken || model('OnboardingToken', OnboardingTokenSchema);
