import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Family } from '../models/family.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class FamilyService {
  private apiUrl = 'https://localhost:7150/api/Family';

  constructor(private http: HttpClient) {}

  // GET /api/Family
  getAllFamilies(): Observable<ApiResponse<Family[]>> {
    return this.http.get<ApiResponse<Family[]>>(`${this.apiUrl}`);
  }

  // GET /api/Family/{id}
  getFamilyById(id: number): Observable<ApiResponse<Family>> {
    return this.http.get<ApiResponse<Family>>(`${this.apiUrl}/${id}`);
  }

  // POST /api/Family
  createFamily(family: Family): Observable<ApiResponse<Family>> {
    return this.http.post<ApiResponse<Family>>(`${this.apiUrl}`, family);
  }

  // PUT /api/Family/{id}
  updateFamily(id: number, family: Family): Observable<ApiResponse<Family>> {
    return this.http.put<ApiResponse<Family>>(`${this.apiUrl}/${id}`, family);
  }

  // DELETE /api/Family/{id}
  deleteFamily(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
