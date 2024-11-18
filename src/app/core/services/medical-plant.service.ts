import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicinalPlant } from '../models/medical-plant.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class MedicinalPlantService {
  private apiUrl = 'https://localhost:7150/api/MedicinalPlant';

  constructor(private http: HttpClient) {}

  // GET /api/MedicinalPlant
  getAllMedicinalPlants(): Observable<ApiResponse<MedicinalPlant[]>> {
    return this.http.get<ApiResponse<MedicinalPlant[]>>(`${this.apiUrl}`);
  }

  // GET /api/MedicinalPlant/{id}
  getMedicinalPlantById(id: number): Observable<ApiResponse<MedicinalPlant>> {
    return this.http.get<ApiResponse<MedicinalPlant>>(`${this.apiUrl}/${id}`);
  }

  // GET /api/MedicinalPlant/search
  searchMedicinalPlants(query: string): Observable<ApiResponse<MedicinalPlant[]>> {
    return this.http.get<ApiResponse<MedicinalPlant[]>>(`${this.apiUrl}/search`, {
      params: { name: query }
    });
  }
  

  // POST /api/MedicinalPlant/vectorsearch
  vectorSearchMedicinalPlants(data: any): Observable<ApiResponse<MedicinalPlant[]>> {
    return this.http.post<ApiResponse<MedicinalPlant[]>>(`${this.apiUrl}/vectorsearch`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
