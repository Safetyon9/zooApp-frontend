import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../../core/services/shop-services';

@Component({
  selector: 'app-public-layout',
  standalone: false,
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout implements OnInit{

  constructor(private shopService: ShopService) {}
  
  ngOnInit() {
    this.shopService.loadCart();
  }

}
