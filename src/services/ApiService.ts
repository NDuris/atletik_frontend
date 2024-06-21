// src/services/ApiService.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api'; // Erstat med din backend URL

const ApiService = {
  // Deltagere
  fetchDeltagere: async () => {
    return axios.get(`${BASE_URL}/deltagere`);
  },
  createDeltager: async (data: any) => {
    return axios.post(`${BASE_URL}/deltagere`, data);
  },
  getDeltager: async (id: number) => {
    return axios.get(`${BASE_URL}/deltagere/${id}`);
  },
  addDeltager: async (data: any) => {
    return axios.post(`${BASE_URL}/deltagere`, data);
  },
  updateDeltager: async (id: number, data: any) => {
    return axios.put(`${BASE_URL}/deltagere/${id}`, data);
  },
  deleteDeltager: async (id: number) => {
    return axios.delete(`${BASE_URL}/deltagere/${id}`);
  },

  // Discipliner
  fetchDiscipliner: async () => {
    return axios.get(`${BASE_URL}/discipliner`);
  },
  fetchDisciplinDeltagere: async (id: number) => {
    return axios.get(`${BASE_URL}/disciplinDeltagere/${id}`);
  },
  fetchDisciplinResultater: async (id: number) => {
    return axios.get(`${BASE_URL}/disciplinResultater/${id}`);
  },
  createDisciplin: async (data: any) => {
    return axios.post(`${BASE_URL}/discipliner`, data);
  },
  getDisciplin: async (id: number) => {
    return axios.get(`${BASE_URL}/discipliner/${id}`);
  },
  updateDisciplin: async (id: number, data: any) => {
    return axios.put(`${BASE_URL}/discipliner/${id}`, data);
  },
  deleteDisciplin: async (id: number) => {
    return axios.delete(`${BASE_URL}/discipliner/${id}`);
  },
  searchDisciplin: async (query: string) => {
    return axios.get(`${BASE_URL}/discipliner?search=${query}`);
  },

  // Resultater
  fetchResultater: async () => {
    return axios.get(`${BASE_URL}/resultater`);
  },
  createResultat: async (data: any) => {
    return axios.post(`${BASE_URL}/resultater`, data);
  },
  getResultat: async (id: number) => {
    return axios.get(`${BASE_URL}/resultater/${id}`);
  },
  updateResultat: async (id: number, data: any) => {
    return axios.put(`${BASE_URL}/resultater/${id}`, data);
  },
  addResultat: async (data: any) => {
    return axios.post(`${BASE_URL}/resultater`, data);
  },
  deleteResultat: async (id: number) => {
    return axios.delete(`${BASE_URL}/resultater/${id}`);
  },

  // Ny tilføjelse for disciplin detaljer
  fetchDeltagereForDisciplin: async (disciplinId: number) => {
    try {
      const response = await axios.get(`${BASE_URL}/discipliner/${disciplinId}/deltagere`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  fetchResultaterForDisciplin: async (disciplinId: number) => {
    try {
      const response = await axios.get(`${BASE_URL}/discipliner/${disciplinId}/resultater`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  fetchResultaterForDeltager: async (deltagerId: number) => { 
    try {
      const response = await axios.get(`${BASE_URL}/resultater/deltagere/${deltagerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

};

export default ApiService;
