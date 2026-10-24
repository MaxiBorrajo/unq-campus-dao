import {
  getStudentProfile,
  submitStudentRegistration,
  getAdminRequests,
  approveStudentRequest,
  rejectStudentRequest,
} from './students';

import {
  getProposalsMetadata,
  saveProposalMetadata,
} from './proposals';

export const api = {
  getStudent: getStudentProfile,
  submitStudentRequest: submitStudentRegistration,
  getAdminRequests,
  approveRequest: approveStudentRequest,
  rejectRequest: rejectStudentRequest,
  getProposalsMetadata,
  saveProposalMetadata,
};
