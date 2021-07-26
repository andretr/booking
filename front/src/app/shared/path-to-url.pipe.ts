import {Pipe, PipeTransform} from '@angular/core';
import {BookingService} from '../Service/booking.service';

@Pipe({
  name: 'pathToUrl'
})
export class PathToUrlPipe implements PipeTransform {
  constructor(private bookingService: BookingService) {
  }

  transform(value: string): string {
    return this.bookingService.baseUrl + 'image-by-name/' + value;
  }

}
