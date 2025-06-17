import { Component, inject } from "@angular/core"
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from "@angular/forms"
import  { Router } from "@angular/router"
import { CommonModule } from "@angular/common"
import { AuthService } from "../../../services/auth.service"

interface FormErrors {
  [key: string]: string
}

@Component({
  selector: "app-register",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.css",
})
export class RegisterComponent {
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
    username: new FormControl("", [Validators.required, Validators.minLength(3)]),
    password: new FormControl("", [Validators.required, Validators.minLength(6)]),
    firstName: new FormControl("", [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl("", [Validators.required, Validators.minLength(2)]),
    phoneNumber: new FormControl("", [Validators.required, this.phoneValidator]),
  })

  // Custom phone validator
  phoneValidator(control: any) {
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/
    return phoneRegex.test(control.value) ? null : { invalidPhone: true }
  }

  // Field validation methods
  validateField(fieldName: string, value: string): string {
    switch (fieldName) {
      case "firstName":
      case "lastName":
        return value.length < 2 ? "Must be at least 2 characters" : ""
      case "username":
        return value.length < 3 ? "Must be at least 3 characters" : ""
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return !emailRegex.test(value) ? "Please enter a valid email" : ""
      case "password":
        return value.length < 6 ? "Must be at least 6 characters" : ""
      case "phoneNumber":
        const phoneRegex = /^\+?[\d\s\-()]{10,}$/
        return !phoneRegex.test(value) ? "Please enter a valid phone number" : ""
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

  // Enhanced form submission (keeping your original logic)
  RegisterControl(): void {
    // Mark all fields as touched for validation display
    Object.keys(this.formData.controls).forEach((key) => {
      this.touchedFields.add(key)
      const control = this.formData.get(key)
      if (control) {
        const error = this.validateField(key, control.value || "")
        if (error) {
          this.errors[key] = error
        }
      }
    })

    // Check if form is valid
    if (this.formData.invalid || Object.keys(this.errors).length > 0) {
      return
    }

    this.isLoading = true

    const myFormData = this.formData.value
    console.log(this.formData.value)

    this.authService.signUp(myFormData).subscribe({
      next: (data: any) => {
        console.log(data)
        this.isLoading = false
        this.router.navigate(["dashboard/login"])
      },
      error: (err: any) => {
        console.log(err)
        this.isLoading = false
        // You can add error handling here for API errors
      },
    })
  }
}