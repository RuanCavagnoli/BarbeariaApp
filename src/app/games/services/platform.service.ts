import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Platform } from "../models/platform.type";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PlatformService {

  constructor(private http: HttpClient) {}

  getPlatforms(): Observable<Platform[]> {
    return this.http.get<Platform[]>('http://localhost:3000/platforms/');
  }
}
