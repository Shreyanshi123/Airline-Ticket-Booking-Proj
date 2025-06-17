import { Component, inject } from "@angular/core"
import { AuthService } from "../../../services/auth.service"
import {  Router, RouterLink } from "@angular/router"
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { CommonModule } from "@angular/common"
import {RecaptchaModule} from 'ng-recaptcha'
import Swal from "sweetalert2"



interface FormErrors {
  [key: string]: string
}
declare const grecaptcha:any;

@Component({
  selector: "app-login",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule,RecaptchaModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  authService = inject(AuthService)

  // UI State Management
  focusedField: string | null = null
  touchedFields: Set<string> = new Set()
  showPassword = false
  isLoading = false
  errors: FormErrors = {}

  constructor(private router: Router) {}

  // Form Definition (keeping your original structure)
  formData: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(6)]),
    captchaToken : new FormControl('')
  })

  // Field validation methods
  validateField(fieldName: string, value: string): string {
    switch (fieldName) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return !emailRegex.test(value) ? "Please enter a valid email" : ""
      case "password":
        return value.length < 6 ? "Password must be at least 6 characters" : ""
      default:
        return ""
    }
  }

  // UI Event Handlers
  onFieldFocus(fieldName: string): void {
    this.focusedField = fieldName
  }

  onFieldBlur(fieldName: string): void {
    this.focusedField = null
    this.touchedFields.add(fieldName)

    const control = this.formData.get(fieldName)
    if (control) {
      const error = this.validateField(fieldName, control.value || "")
      if (error) {
        this.errors[fieldName] = error
      } else {
        delete this.errors[fieldName]
      }
    }
  }

  onFieldInput(fieldName: string, event: any): void {
    const value = event.target.value

    // Real-time validation for touched fields
    if (this.touchedFields.has(fieldName)) {
      const error = this.validateField(fieldName, value)
      if (error) {
        this.errors[fieldName] = error
      } else {
        delete this.errors[fieldName]
      }
    }
  }

  // Utility methods for template
  getFieldError(fieldName: string): string {
    return this.touchedFields.has(fieldName) ? this.errors[fieldName] || "" : ""
  }

  isFieldValid(fieldName: string): boolean {
    const control = this.formData.get(fieldName)
    return this.touchedFields.has(fieldName) && control?.valid === true && control?.value?.trim() !== ""
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword
  }

  // Enhanced login control (keeping your original logic)
  

  loginControl(): void {
  grecaptcha.ready(() => {
    grecaptcha.execute('6LdEhFUrAAAAANWiiA6ZGhKe88YcQp5-1cd_Lz4k', { action: 'login' }).then((token: string) => {
      this.formData.patchValue({ captchaToken: token }); // ✅ Add CAPTCHA token

      if (!this.formData.value.captchaToken) {
        alert("❌ CAPTCHA verification failed! Please try again.");
        return;
      }

      // Mark all fields as touched for validation display
      Object.keys(this.formData.controls).forEach((key) => {
        this.touchedFields.add(key);
        const control = this.formData.get(key);
        if (control) {
          const error = this.validateField(key, control.value || "");
          if (error) {
            this.errors[key] = error;
          }
        }
      });

      // Check if form is valid
      if (this.formData.invalid || Object.keys(this.errors).length > 0) {
        return;
      }

      this.isLoading = true;

      const myFormData = this.formData.value;
      console.log("🚀 Form Data Before Sending:", myFormData);

      this.authService.signIn(myFormData).subscribe({
  next: (data: any) => {
    console.log(data.user);
    Swal.fire({
      icon: "success",
      title: "Login Successful",
      text: `Welcome, ${data.user.role === 1 ? "Admin" : "User"}!`,
      timer: 2000,
      showConfirmButton: false,
    });
    localStorage.setItem("token", data.token);
    this.isLoading = false;
    this.router.navigateByUrl(data.user.role === 1 ? "/dashboard" : "");
  },
  error: (err: any) => {
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: "Please check your credentials.",
    });
    console.error("❌ Login Failed", err);
    this.isLoading = false;
    this.errors["general"] = "Login failed. Please check your credentials.";
  },
});
    });
  });
} // ✅ Properly closed method here
}