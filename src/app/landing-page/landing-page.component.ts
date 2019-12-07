import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  slideIndex = 0;
  constructor(private elRef: ElementRef) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.showSlides();
  }

  
  showSlides(){
    let i;
    //let slides = document.getElementsByClassName("mySlides");
    let slides = this.elRef.nativeElement.querySelectorAll('.mySlides');
    let dots = this.elRef.nativeElement.querySelectorAll(".dot");
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
    }
    this.slideIndex++;
    if (this.slideIndex > slides.length) {this.slideIndex = 1}    
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[this.slideIndex-1].style.display = "block";  
    dots[this.slideIndex-1].className += " active";
    setTimeout(this.showSlides.bind(this), 5000); // Change image every 2 seconds
  }


}
