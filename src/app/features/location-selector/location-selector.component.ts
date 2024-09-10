import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { ProvinceService } from 'src/app/core/services/province.service';

@Component({
  selector: 'app-location-selector',
  templateUrl: './location-selector.component.html',
  styleUrls: ['./location-selector.component.scss'],
})
export class LocationSelectorComponent implements OnInit {
  @Input() provinces: any[] = [];
  @Input() districts: any[] = [];
  @Input() communes: any[] = [];

  @Output() locationChanged = new EventEmitter<{ province: string; district: string; commune: string }>();

  selectedProvince: string = '';
  selectedDistrict: string = '';
  selectedCommune: string = '';

  constructor(private provinceService: ProvinceService) {}

  ngOnInit(): void {
    this.provinceService.getProvinces().subscribe(
      (data) => {
        this.provinces = data.map((province: any) => ({
          code: String(province.code),  // Ensure code is a string
          name: province.name,
        }));
        console.log('Provinces loaded:', this.provinces);
      },
      (error) => {
        console.error('Error fetching provinces:', error);
      }
    );
  }

  onProvinceSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const provinceCode = target.value;
    console.log('Selected province code:', provinceCode);

    const selectedProvince = this.provinces.find((p) => p.code === String(provinceCode));
    console.log('Selected province:', selectedProvince);

    if (selectedProvince) {
      this.selectedProvince = selectedProvince.name;
      this.provinceService.getDistrictsByProvince(provinceCode).subscribe(
        (data) => {
          console.log('Districts data:', data);
          this.districts = data.districts.map((district: any) => ({
            code: String(district.code),
            name: district.name,
          }));
          this.communes = [];
          this.selectedDistrict = '';
          this.selectedCommune = '';
          this.locationChanged.emit({
            province: this.selectedProvince,
            district: '',
            commune: '',
          });
        },
        (error) => {
          console.error('Error fetching districts:', error);
        }
      );
    } else {
      console.error('Province not found:', provinceCode);
      // Optionally, show an error message to the user
    }
  }

  onDistrictSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const districtCode = target.value;
    const selectedDistrict = this.districts.find((d) => d.code === String(districtCode));

    if (selectedDistrict) {
      this.selectedDistrict = selectedDistrict.name;
      this.provinceService.getCommunesByDistrict(districtCode).subscribe(
        (data) => {
          this.communes = data.wards.map((commune: any) => ({
            code: String(commune.code),
            name: commune.name,
          }));
          this.selectedCommune = '';
          this.locationChanged.emit({
            province: this.selectedProvince,
            district: this.selectedDistrict,
            commune: '',
          });
        },
        (error) => {
          console.error('Error fetching communes:', error);
        }
      );
    }
  }

  onCommuneSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const communeCode = target.value;
    const selectedCommune = this.communes.find((c) => c.code === String(communeCode));

    if (selectedCommune) {
      this.selectedCommune = selectedCommune.name;
      this.locationChanged.emit({
        province: this.selectedProvince,
        district: this.selectedDistrict,
        commune: this.selectedCommune,
      });
    }
  }
}
