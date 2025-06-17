import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
}

interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  userProfile: UserProfile | null = null;
  profileForm: FormGroup;
  passwordForm: FormGroup;

  router = inject(Router);

  // UI States
  isEditing = false;
  isLoading = false;
  isSidebarOpen = false;
  activeSection = 'profile';
  showDeleteConfirmation = false;

  firstName: any;
  lName: any;
  userEmail: any;
  userphoneNumber: any;

  // Messages
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private userService: AuthService) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)],
      ],
    });

    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );

    // Disable the profile form initially
    this.profileForm.disable();
  }

  ngOnInit(): void {
     window.scrollTo(0, 0); // Scrolls to the top of the page
    this.loadUserProfile();

    // Get user data from service
    const userData = this.userService.getUserData();

    if (userData && userData.user) {
      this.firstName = userData.user.firstName;
      this.lName = userData.user.lastName;
      this.userEmail = userData.user.email;
      this.userphoneNumber = userData.user.phoneNumber;

      // Patch the form with the data
      this.profileForm.patchValue({
        firstName: this.firstName,
        lastName: this.lName,
        email: this.userEmail,
        phoneNumber: this.userphoneNumber,
      });
    } else {
      // If no user data, try to refresh it
      this.loadUserProfile();
    }

    console.log(this.firstName);
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (
      newPassword &&
      confirmPassword &&
      newPassword.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  async loadUserProfile(): Promise<void> {
    this.isLoading = true;
    this.clearMessages();

    try {
      // getUserData() returns data directly, not a Promise/Observable
      const userData = this.userService.getUserData();

      if (userData && userData.user) {
        this.userProfile = userData;

        // Update component variables
        this.firstName = userData.user.firstName;
        this.lName = userData.user.lastName;
        this.userEmail = userData.user.email;
        this.userphoneNumber = userData.user.phoneNumber;

        // Patch form
        this.profileForm.patchValue({
          firstName: this.firstName,
          lastName: this.lName,
          email: this.userEmail,
          phoneNumber: this.userphoneNumber,
        });

        this.profileForm.disable();
        this.isEditing = false;
      } else {
        this.errorMessage = 'No user data found. Please login again.';
      }
    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to load user profile';
    } finally {
      this.isLoading = false;
    }
  }

  toggleEdit(): void {
    if (this.isEditing) {
      // Cancel editing - reset form and disable
      if (this.userProfile) {
        this.profileForm.patchValue(this.userProfile);
      }
      this.profileForm.disable();
    } else {
      // Start editing - enable form
      this.profileForm.enable();
    }

    this.isEditing = !this.isEditing;
    this.clearMessages();
  }

  async updateProfile(): Promise<void> {
  if (this.profileForm.invalid) {
    this.markFormGroupTouched(this.profileForm);
    return;
  }

  this.isLoading = true;
  this.clearMessages();

  try {
    // updateUserProfile returns an Observable, so use toPromise() here
    const updatedProfile = await this.userService
      .updateUserProfile(this.profileForm.value)
      .toPromise();

    this.userProfile = updatedProfile;

    // Update component variables with new data
    if (updatedProfile && updatedProfile.user) {
      this.firstName = updatedProfile.user.firstName;
      this.lName = updatedProfile.user.lastName;
      this.userEmail = updatedProfile.user.email;
      this.userphoneNumber = updatedProfile.user.phoneNumber;
    }

    this.isEditing = false;
    this.profileForm.disable();

    // Show success message using SweetAlert
    Swal.fire({
      icon: "success",
      title: "Profile Updated",
      text: "Your profile has been updated successfully!",
      timer: 3000,
      showConfirmButton: false,
    });
  } catch (error: any) {
    Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: error.message || "Failed to update profile.",
    });
  } finally {
    this.isLoading = false;
  }
}

 async changePassword(): Promise<void> {
  if (this.passwordForm.invalid) {
    this.markFormGroupTouched(this.passwordForm);
    return;
  }

  this.isLoading = true;
  this.clearMessages();

  try {
    // changePassword returns an Observable, so use toPromise() here
    await this.userService.changePassword(this.passwordForm.value).toPromise();

    this.passwordForm.reset();

    // Show success message using SweetAlert
    Swal.fire({
      icon: "success",
      title: "Password Changed",
      text: "Your password has been updated successfully!",
      timer: 3000,
      showConfirmButton: false,
    });
  } catch (error: any) {
    Swal.fire({
      icon: "error",
      title: "Failed to Change Password",
      text: error.message || "An error occurred while updating your password.",
    });
  } finally {
    this.isLoading = false;
  }
}

  confirmDeleteAccount(): void {
    this.showDeleteConfirmation = true;
    this.deleteAccount()
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
  }

  async deleteAccount(): Promise<void> {
  this.isLoading = true;
  this.clearMessages();

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const tokenData: any = jwtDecode(token);
    const userId: any =
      tokenData[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ];

    // deleteAccount returns an Observable, so use toPromise() here
    await this.userService.deleteAccount(userId).toPromise();

    // Sign out and redirect after successful deletion
    this.userService.signOut();
    this.router.navigate(["dashboard/login"]);

    // Show success message using SweetAlert
    Swal.fire({
      icon: "success",
      title: "Account Deleted",
      text: "You will be redirected to the login page.",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error: any) {
    Swal.fire({
      icon: "error",
      title: "Deletion Failed",
      text:  "Cann't delete account with confirmed and pending reservations .",
    });
    this.showDeleteConfirmation = false;
  } finally {
    this.isLoading = false;
  }
}

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
    this.clearMessages();
    this.isEditing = false;

    // Always disable profile form when switching sections or when not editing
    this.profileForm.disable();

    if (section === 'password') {
      this.passwordForm.reset();
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  // Utility methods for template
  getFieldError(
    fieldName: string,
    formGroup: FormGroup = this.profileForm
  ): string {
    const control = formGroup.get(fieldName);
    if (control && control.touched && control.errors) {
      if (control.errors['required'])
        return `${this.getFieldDisplayName(fieldName)} is required`;
      if (control.errors['minlength'])
        return `${this.getFieldDisplayName(fieldName)} must be at least ${
          control.errors['minlength'].requiredLength
        } characters`;
      if (control.errors['email']) return 'Please enter a valid email address';
      if (control.errors['pattern'])
        return 'Please enter a valid mobile number';
      if (control.errors['mismatch']) return 'Passwords do not match';
    }
    return '';
  }

  hasFieldError(
    fieldName: string,
    formGroup: FormGroup = this.profileForm
  ): boolean {
    const control = formGroup.get(fieldName);
    return !!(control && control.touched && control.errors);
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      username: 'Username',
      email: 'Email',
      phoneNumber: 'Mobile Number',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
    };
    return displayNames[fieldName] || fieldName;
  }
}
