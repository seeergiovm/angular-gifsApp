import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

const GIPHY_API_KEY = 'uoRFAXjTwEACEbtmcbeNAO1cjLhYs1Sk';

@Injectable({providedIn: 'root'})
export class GifsService {

    public gifList: Gif[] = [];

    private _tagsHistory: string[] = [];
    private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

    constructor(private http: HttpClient) {
        this.loadLocalStorage();
     }
    
    get tagsHistory() {
        return [...this._tagsHistory];
    }

    private organizeHistory(tag: string) {
        tag = tag.toLowerCase();

        if( this._tagsHistory.includes(tag) ) {
            this._tagsHistory = this._tagsHistory.filter( (oldTag => oldTag !== tag))
        }

        this._tagsHistory.unshift(tag);
        this._tagsHistory = this._tagsHistory.splice(0,10);
        this.saveLocalStorage();
    }

    //En el storage solo se puede guardar strings, no arrays. Por lo que pasamos el objeto como un string para guardarlo
    //Guarda el historial de busquedas en el localStorage
    private saveLocalStorage():void {
        localStorage.setItem('history', JSON.stringify(this.tagsHistory));
    }

    private loadLocalStorage():void {
        if(!localStorage.getItem('history')) return;
        
        this._tagsHistory = JSON.parse(localStorage.getItem('history')! );

        if(this._tagsHistory.length === 0) return;
            
        this.searchTag(this._tagsHistory[0])
    }

    searchTag( tag: string ): void {

        if(tag.length === 0) return;
        this.organizeHistory(tag);

        // https::/api.giphy.com/v1/gifs/search?api_key=uoRFAXjTwEACEbtmcbeNAO1cjLhYs1Sk&q=Valorant&limit=10

        //Se definen los parametros de la llamada
        const params = new HttpParams()
            .set('api_key', GIPHY_API_KEY)
            .set('limit', '10')
            .set('q', tag)

        this.http.get<SearchResponse>(`${ this.serviceUrl }/search`, { params: params})
            .subscribe( (resp) => {
                this.gifList = resp.data;
            })
    }
}