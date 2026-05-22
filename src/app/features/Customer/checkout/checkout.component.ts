import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CheckoutInterface } from './checkout.model';
// import { CheckoutService } from './checkout.service';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './checkout.component.html',
})

export class CheckoutComponent implements OnInit {
    checkoutForm!: FormGroup; // Form group for checkout form

    provinces: any[] = [];
    wards: any[] = [];

    constructor(
        private fb: FormBuilder,
        //private checkoutService: CheckoutService
    ) {}

    ngOnInit(): void {
        this.initForm();
    }

    initForm(): void {
        this.checkoutForm = this.fb.group({
            tenNguoiMua: ['', Validators.required],
            sdtNguoiMua: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
            tinh: ['', Validators.required],
            phuong: ['', Validators.required],
            diaChi: ['', Validators.required],
            phuongThucThanhToan: ['', Validators.required]
        });
    }

    selectPayment(method: string): void {
        this.checkoutForm.get('phuongThucThanhToan')?.setValue(method);
    }

    onSubmit(): void {
        if (this.checkoutForm.valid) {
            const formValues = this.checkoutForm.value;
            
        }
    }
}