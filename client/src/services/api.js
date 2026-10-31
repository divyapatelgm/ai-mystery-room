import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const caseService = {
  // Generate a new mystery
  async createMystery({ premise, difficulty = 'medium' }) {
    const response = await api.post('/cases', { premise, difficulty });
    return response.data;
  },

  // Get active or completed case
  async getCase(id) {
    const response = await api.get(`/cases/${id}`);
    return response.data;
  },

  // Discover a clue
  async discoverClue(id, clueId) {
    const response = await api.post(`/cases/${id}/clues/${clueId}/discover`);
    return response.data;
  },

  // Request next hint
  async requestHint(id) {
    const response = await api.post(`/cases/${id}/hints`);
    return response.data;
  },

  // Submit final accusation
  async submitAccusation(id, suspectId) {
    const response = await api.post(`/cases/${id}/accuse`, { suspectId });
    return response.data;
  },

  // Get finalized result debrief
  async getCaseResult(id) {
    const response = await api.get(`/cases/${id}/result`);
    return response.data;
  },

  // Get past case history for current guest
  async getCaseHistory() {
    const response = await api.get('/cases/history');
    return response.data;
  },

  // Health check
  async getHealth() {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;

