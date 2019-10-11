//import { environment } from './../../environments/environment';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';


@Injectable()
export class AppService {

  constructor(
    public http: HttpClient
  ) { }

  fetchRecipes(query= "pasta"): Observable<any>{
       const url = `${environment.proxy}http://food2fork.com/api/search?key=${environment.key}&q=${query}`;
        return this.http.get(url);
  }
}
