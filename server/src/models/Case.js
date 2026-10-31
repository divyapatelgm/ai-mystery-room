import mongoose from 'mongoose';

const SuspectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  occupation: { type: String, required: true, trim: true },
  relationship: { type: String, required: true, trim: true },
  biography: { type: String, required: true },
  alibi: { type: String, required: true },
  portraitDescription: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'neutral'], default: 'neutral' },
  avatarIndex: { type: Number, default: 0 },
}, { _id: false });

const ClueSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true }, // initial teaser
  details: { type: String, required: true },     // revealed upon discovery
  category: {
    type: String,
    required: true,
    enum: ['physical', 'testimony', 'document', 'forensic'],
  },
  relevance: { type: String, required: true },
  discovered: { type: Boolean, default: false },
  discoveredAt: { type: Date, default: null },
  boardPosition: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    rotation: { type: Number, default: 0 },
  }
}, { _id: false });

const HintSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  used: { type: Boolean, default: false },
  usedAt: { type: Date, default: null },
}, { _id: false });

const CaseSchema = new mongoose.Schema({
  caseNumber: {
    type: String,
    required: true,
    unique: true,
    index: true,
    uppercase: true,
  },
  ownerId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  story: {
    type: String,
    required: true,
  },
  premise: {
    type: String,
    trim: true,
    default: 'A high-stakes crime of cunning and deception.',
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard'],
    index: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'completed'],
    default: 'active',
    index: true,
  },
  suspects: [SuspectSchema],
  clues: [ClueSchema],
  hints: [HintSchema],
  // PRIVATE - Never exposed while active
  solution: {
    culpritId: { type: String, required: true },
    explanation: { type: String, required: true },
    supportingClueIds: [{ type: String }],
  },
  playerProgress: {
    discoveredClueIds: [{ type: String }],
    usedHintIds: [{ type: String }],
    currentScore: { type: Number, default: 0 },
  },
  accusation: {
    suspectId: { type: String, default: null },
    submittedAt: { type: Date, default: null },
    isCorrect: { type: Boolean, default: null },
  },
  result: {
    completed: { type: Boolean, default: false },
    basePoints: { type: Number, default: 0 },
    cluePoints: { type: Number, default: 0 },
    hintPenalty: { type: Number, default: 0 },
    finalScore: { type: Number, default: 0 },
  }
}, {
  timestamps: true,
});

// Indexes for query performance
CaseSchema.index({ ownerId: 1, createdAt: -1 });

export const Case = mongoose.model('Case', CaseSchema);
