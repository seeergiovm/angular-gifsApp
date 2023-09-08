import { Component, Input, OnInit } from '@angular/core';
import { Gif } from '../../interfaces/gifs.interfaces';

@Component({
  selector: 'gifs-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class GifsCardComponent implements OnInit {

  @Input() gif!: Gif;

  ngOnInit(): void {
      if(!this.gif) throw new Error('Gif property is required')
  }

  constructor() {
  }
}
