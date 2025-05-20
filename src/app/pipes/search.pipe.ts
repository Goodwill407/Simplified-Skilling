import { LowerCasePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'customFilter'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }
    return value.filter((val: any | LowerCasePipe) => {
      let rVal = (val.className?.toLocaleLowerCase().includes(args.toLocaleLowerCase())) || (val.name?.toLocaleLowerCase().includes(args.toLocaleLowerCase())) || (val.chapterName?.toLocaleLowerCase().includes(args.toLocaleLowerCase()));
      return rVal;
    })
  }

}