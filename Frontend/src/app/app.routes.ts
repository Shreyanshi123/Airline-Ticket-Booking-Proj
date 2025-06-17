// // // import { Routes } from '@angular/router';
// // // import { HomeComponent } from './components/main/home/home.component';
// // // import { SearchComponent } from './components/main/search/search.component';
// // // import { ScheduleComponent } from './components/dashboards/schedule/schedule.component';
// // // import { AddFlightComponent } from './components/dashboards/add-flight/add-flight.component';
// // // import { EditairlineComponent } from './components/dashboards/editairline/editairline.component';
// // // import { BookingComponent } from './components/main/booking/booking.component';
// // // import { DashboardComponent } from './components/dashboards/dashboard/dashboard.component';
// // // import { authGuard } from './guards/auth.guard';
// // // import { LoginComponent } from './components/main/login/login.component';
// // // import { RegisterComponent } from './components/main/register/register.component';
// // // import { MainComponent } from './components/main/main/main.component';
// // // import { DashMainComponent } from './components/dashboards/dash-main/dash-main.component';
// // // import { BookingConfirmationComponent } from './components/main/booking-confirmation/booking-confirmation.component';
// // // import { BookingHistoryComponent } from './components/main/booking-history/booking-history.component';
// // // import { PaymentSuccessComponent } from './components/main/payment-success/payment-success.component';
// // // import { BookingInformationComponent } from './components/main/booking-information/booking-information.component';
// // // import { AboutComponent } from './components/main/about/about.component';
// // // import { ContactComponent } from './components/main/contact/contact.component';
// // // import { PaymentComponent } from './components/main/payment/payment.component';
// // // import { UserProfileComponent } from './components/main/user-profile/user-profile.component';

// // // export const routes: Routes = [
// // //   {
// // //     path: '',
// // //     component: MainComponent,
// // //     children: [
// // //       { path: '', component: HomeComponent },
// // //       { path: 'about', component: AboutComponent },
// // //       { path: 'contact', component: ContactComponent },
// // //       { path: 'search', component: SearchComponent },
// // //       { path: 'booking/:flightNumber', component: BookingComponent },
// // //       { path: 'dashboard/login', component: LoginComponent },
// // //       { path: 'dashboard/register', component: RegisterComponent },
// // //       {
// // //         path: 'booking-confirmation/:flightId',
// // //         component: BookingConfirmationComponent,
// // //       },
// // //       {
// // //         path: 'userprofile',
// // //         component: UserProfileComponent,
// // //       },
// // //       { path: 'payment/:reservationId', component: PaymentComponent },
// // //       {
// // //         path: 'payment-success/:reservationId',
// // //         component: PaymentSuccessComponent,
// // //       },
// // //       {
// // //         path: 'booking-information/:id',
// // //         component: BookingInformationComponent,
// // //       },
// // //       { path: 'booking-history', component: BookingHistoryComponent },
// // //     ],
// // //   },
// // //   {
// // //     path: 'dashboard',
// // //     component: DashMainComponent,
// // //     canActivate: [authGuard],
// // //     children: [
// // //       { path: '', component: DashboardComponent },
// // //       {
// // //         path: 'dashboard/editFlight/:flightNumber',
// // //         component: EditairlineComponent,
// // //       },
// // //       { path: 'addFlight', component: AddFlightComponent },
// // //       { path: 'dashboard/schedule', component: ScheduleComponent },
// // //       { path: 'dashboard/login', component: LoginComponent },
// // //       { path: 'dashboard/register', component: RegisterComponent },
// // //     ],
// // //   },

// // //   // { path: 'home/booking/manage', component: ManageComponent },
// // // ];


// // import { Routes } from '@angular/router';
// // import { HomeComponent } from './components/main/home/home.component';
// // import { SearchComponent } from './components/main/search/search.component';
// // import { ScheduleComponent } from './components/dashboards/schedule/schedule.component';
// // import { AddFlightComponent } from './components/dashboards/add-flight/add-flight.component';
// // import { EditairlineComponent } from './components/dashboards/editairline/editairline.component';
// // import { BookingComponent } from './components/main/booking/booking.component';
// // import { DashboardComponent } from './components/dashboards/dashboard/dashboard.component';
// // import { LoginComponent } from './components/main/login/login.component';
// // import { RegisterComponent } from './components/main/register/register.component';
// // import { MainComponent } from './components/main/main/main.component';
// // import { DashMainComponent } from './components/dashboards/dash-main/dash-main.component';
// // import { BookingConfirmationComponent } from './components/main/booking-confirmation/booking-confirmation.component';
// // import { PaymentComponent } from './components/main/payment/payment.component';
// // import { BookingHistoryComponent } from './components/main/booking-history/booking-history.component';
// // import { PaymentSuccessComponent } from './components/main/payment-success/payment-success.component';
// // import { BookingInformationComponent } from './components/main/booking-information/booking-information.component';
// // import { UserProfileComponent } from './components/main/user-profile/user-profile.component';
// // import { ReservationChartComponent } from './components/dashboards/reservation-chart/reservation-chart.component';
// // import { UserDashboardComponent } from './components/dashboards/user-dashboard/user-dashboard.component';
// // import { RescheduleFlightComponent } from './components/dashboards/reschedule-flight/reschedule-flight.component';
// // import { UsersComponent } from './components/dashboards/users/users.component';
// // import { PopularFlightsComponent } from './components/dashboards/popular-flights/popular-flights.component';
// // import { AdminAnalyticsComponent } from './components/dashboards/admin-analytics/admin-analytics.component';
// // import { AdminUserRecommendationsComponent } from './components/dashboards/admin-user-recommendations/admin-user-recommendations.component';
// // import { UserAnalyticsComponent } from './components/dashboards/user-analytics/user-analytics.component';
// // import { AdminLayoutComponent } from './components/dashboards/admin-layout/admin-layout.component';
// // import { AboutComponent } from './components/main/about/about.component';
// // import { ContactComponent } from './components/main/contact/contact.component';

// // export const routes: Routes = [
// // {path:'',component:MainComponent,children:[
// //     {path:'',component:HomeComponent},
// //     {path:'home',component:HomeComponent},
// //     {path:'search',component:SearchComponent},
// //      {
// //         path: 'userprofile',
// //         component: UserProfileComponent,
// //       },
// //      { path: 'booking/:flightNumber', component: BookingComponent },
// //       { path: 'about', component:AboutComponent},
// //       { path: 'contact', component: ContactComponent },
// //     { path: 'home/booking', component: BookingComponent},
// //     {path:"dashboard/login",component:LoginComponent},
// //  {path:"dashboard/register",component:RegisterComponent},
// //  {path:"booking-confirmation/:flightId",component:BookingConfirmationComponent},
// //  {path:"payment/:reservationId",component:PaymentComponent},
// //  {path:'payment-success/:reservationId',component:PaymentSuccessComponent},
// //  {path:'booking-information/:id', component:BookingInformationComponent},
// //  {path:"booking-history",component:BookingHistoryComponent}
// // ]},
// //  {path:'dashboard',component:DashMainComponent,children:[

// // {path:'',component:DashboardComponent},
// // {path:'reservation-chart',component:ReservationChartComponent},
// // {path:'users',component:UserDashboardComponent},
// // {path:"admin-layout",component:AdminLayoutComponent},
// // {path:'userswithreservations',component:UsersComponent},
// // {path:'popularFlights',component:PopularFlightsComponent},
// // {path:'admin-analytics',component:AdminAnalyticsComponent},
// // {path:'user-analytics',component:UserAnalyticsComponent},
// // {path:'user-recommendations/:userId',component:AdminUserRecommendationsComponent},
// // {path:'dashboard/editFlight/:flightNumber',component:EditairlineComponent},
// // {path:'dashboard/rescheduleFlight/:flightNumber',component:RescheduleFlightComponent},
// //  {path:'addFlight',component:AddFlightComponent},
// //  {path:'chart',component:ReservationChartComponent},
// //  { path: 'dashboard/schedule', component: ScheduleComponent },
// //   {path:"dashboard/login",component:LoginComponent},
// //  {path:"dashboard/register",component:RegisterComponent},
 
// //  ]},

// // // { path: 'home/booking/manage', component: ManageComponent },
// // ];



// import { Routes } from '@angular/router';
// import { HomeComponent } from './components/main/home/home.component';
// import { SearchComponent } from './components/main/search/search.component';
// import { ScheduleComponent } from './components/dashboards/schedule/schedule.component';
// import { AddFlightComponent } from './components/dashboards/add-flight/add-flight.component';
// import { EditairlineComponent } from './components/dashboards/editairline/editairline.component';
// import { BookingComponent } from './components/main/booking/booking.component';
// import { DashboardComponent } from './components/dashboards/dashboard/dashboard.component';
// import { LoginComponent } from './components/main/login/login.component';
// import { RegisterComponent } from './components/main/register/register.component';
// import { MainComponent } from './components/main/main/main.component';
// import { DashMainComponent } from './components/dashboards/dash-main/dash-main.component';
// import { BookingConfirmationComponent } from './components/main/booking-confirmation/booking-confirmation.component';
// import { PaymentComponent } from './components/main/payment/payment.component';
// import { BookingHistoryComponent } from './components/main/booking-history/booking-history.component';
// import { PaymentSuccessComponent } from './components/main/payment-success/payment-success.component';
// import { BookingInformationComponent } from './components/main/booking-information/booking-information.component';
// import { UserProfileComponent } from './components/main/user-profile/user-profile.component';
// import { ReservationChartComponent } from './components/dashboards/reservation-chart/reservation-chart.component';
// import { UserDashboardComponent } from './components/dashboards/user-dashboard/user-dashboard.component';
// import { RescheduleFlightComponent } from './components/dashboards/reschedule-flight/reschedule-flight.component';
// import { UsersComponent } from './components/dashboards/users/users.component';
// import { PopularFlightsComponent } from './components/dashboards/popular-flights/popular-flights.component';
// import { AdminAnalyticsComponent } from './components/dashboards/admin-analytics/admin-analytics.component';
// import { AdminUserRecommendationsComponent } from './components/dashboards/admin-user-recommendations/admin-user-recommendations.component';
// import { UserAnalyticsComponent } from './components/dashboards/user-analytics/user-analytics.component';
// import { AdminLayoutComponent } from './components/dashboards/admin-layout/admin-layout.component';
// import { AboutComponent } from './components/main/about/about.component';
// import { ContactComponent } from './components/main/contact/contact.component';
// import { authGuard } from './guards/auth.guard';

// export const routes: Routes = [
//   {
//     path: '',
//     component: MainComponent,
//     children: [
//       { path: '', component: HomeComponent },
//       { path: 'home', component: HomeComponent },
//       { path: 'search', component: SearchComponent },
//       { path: 'userprofile', component: UserProfileComponent },
//       { path: 'booking/:flightNumber', component: BookingComponent },
//       { path: 'about', component: AboutComponent },
//       { path: 'contact', component: ContactComponent },
//       { path: 'home/booking', component: BookingComponent },
//       { path: 'dashboard/login', component: LoginComponent },
//       { path: 'dashboard/register', component: RegisterComponent },
//       { path: 'booking-confirmation/:flightId', component: BookingConfirmationComponent },
//       { path: 'payment/:reservationId', component: PaymentComponent },
//       { path: 'payment-success/:reservationId', component: PaymentSuccessComponent },
//       { path: 'booking-information/:id', component: BookingInformationComponent },
//       { path: 'booking-history', component: BookingHistoryComponent },
//     ],
//   },
//   {
//     path: 'dashboard',
//     component: AdminLayoutComponent, // ✅ Wraps all dashboard routes
//     canActivate:[authGuard],
//     children: [
//       { path: '', component: DashboardComponent }, // ✅ Default dashboard view
//       { path: 'reservation-chart', component: ReservationChartComponent },
//       { path: 'users', component: UserDashboardComponent },
//       { path: 'userswithreservations', component: UsersComponent },
//       { path: 'popularFlights', component: PopularFlightsComponent },
//       { path: 'admin-analytics', component: AdminAnalyticsComponent },
//       { path: 'user-analytics', component: UserAnalyticsComponent },
//       { path: 'user-recommendations/:userId', component: AdminUserRecommendationsComponent },
//       { path: 'editFlight/:flightNumber', component: EditairlineComponent },
//       { path: 'rescheduleFlight/:flightNumber', component: RescheduleFlightComponent },
//       { path: 'addFlight', component: AddFlightComponent },
//       { path: 'chart', component: ReservationChartComponent },
//       { path: 'schedule', component: ScheduleComponent },
//       { path: 'login', component: LoginComponent },
//       { path: 'register', component: RegisterComponent },
//     ],
//   },
// ];


import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { Routes } from '@angular/router';
import { HomeComponent } from './components/main/home/home.component';
import { SearchComponent } from './components/main/search/search.component';
import { ScheduleComponent } from './components/dashboards/schedule/schedule.component';
import { AddFlightComponent } from './components/dashboards/add-flight/add-flight.component';
import { EditairlineComponent } from './components/dashboards/editairline/editairline.component';
import { BookingComponent } from './components/main/booking/booking.component';
import { DashboardComponent } from './components/dashboards/dashboard/dashboard.component';
import { LoginComponent } from './components/main/login/login.component';
import { RegisterComponent } from './components/main/register/register.component';
import { MainComponent } from './components/main/main/main.component';
import { DashMainComponent } from './components/dashboards/dash-main/dash-main.component';
import { BookingConfirmationComponent } from './components/main/booking-confirmation/booking-confirmation.component';
import { PaymentComponent } from './components/main/payment/payment.component';
import { BookingHistoryComponent } from './components/main/booking-history/booking-history.component';
import { PaymentSuccessComponent } from './components/main/payment-success/payment-success.component';
import { BookingInformationComponent } from './components/main/booking-information/booking-information.component';
import { UserProfileComponent } from './components/main/user-profile/user-profile.component';
import { ReservationChartComponent } from './components/dashboards/reservation-chart/reservation-chart.component';
import { UserDashboardComponent } from './components/dashboards/user-dashboard/user-dashboard.component';
import { RescheduleFlightComponent } from './components/dashboards/reschedule-flight/reschedule-flight.component';
import { UsersComponent } from './components/dashboards/users/users.component';
import { PopularFlightsComponent } from './components/dashboards/popular-flights/popular-flights.component';
import { AdminAnalyticsComponent } from './components/dashboards/admin-analytics/admin-analytics.component';
import { AdminUserRecommendationsComponent } from './components/dashboards/admin-user-recommendations/admin-user-recommendations.component';
import { UserAnalyticsComponent } from './components/dashboards/user-analytics/user-analytics.component';
import { AdminLayoutComponent } from './components/dashboards/admin-layout/admin-layout.component';
import { AboutComponent } from './components/main/about/about.component';
import { ContactComponent } from './components/main/contact/contact.component';


export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: HomeComponent }, // ✅ Public
      { path: 'home', component: HomeComponent }, // ✅ Public
      { path: 'search', component: SearchComponent }, // ✅ Public
      { path: 'userprofile', component: UserProfileComponent, canActivate: [authGuard] }, // ✅ User Only
      { path: 'booking/:flightNumber', component: BookingComponent, canActivate: [authGuard] }, // ✅ User Only
      { path: 'about', component: AboutComponent }, // ✅ Public
      { path: 'contact', component: ContactComponent }, // ✅ Public
      { path: 'home/booking', component: BookingComponent, canActivate: [authGuard] }, // ✅ User Only
      { path: 'dashboard/login', component: LoginComponent }, // ✅ Public
      { path: 'dashboard/register', component: RegisterComponent }, // ✅ Public
      { path: 'booking-confirmation/:flightId', component: BookingConfirmationComponent, canActivate: [authGuard] }, // ✅ User Only
      { path: 'payment/:reservationId', component: PaymentComponent, canActivate: [authGuard] }, // ✅ User Only
      { path: 'payment-success/:reservationId', component: PaymentSuccessComponent, canActivate: [authGuard] }, // ✅ User Only
      { path: 'booking-information/:id', component: BookingInformationComponent, canActivate: [authGuard] }, // ✅ User Only
      { path: 'booking-history', component: BookingHistoryComponent, canActivate: [authGuard] }, // ✅ User Only
    ],
  },
  {
    path: 'dashboard',
    component: AdminLayoutComponent,
    canActivate: [adminGuard], // ✅ Protect dashboard routes
    children: [
      { path: '', component: DashboardComponent },
      { path: 'reservation-chart', component: ReservationChartComponent },
      { path: 'users', component: UserDashboardComponent },
      { path: 'userswithreservations', component: UsersComponent },
      { path: 'popularFlights', component: PopularFlightsComponent },
      { path: 'admin-analytics', component: AdminAnalyticsComponent },
      { path: 'user-analytics', component: UserAnalyticsComponent },
      { path: 'user-recommendations/:userId', component: AdminUserRecommendationsComponent },
      { path: 'editFlight/:flightNumber', component: EditairlineComponent },
      { path: 'rescheduleFlight/:flightNumber', component: RescheduleFlightComponent },
      { path: 'addFlight', component: AddFlightComponent },
      { path: 'chart', component: ReservationChartComponent },
      { path: 'schedule', component: ScheduleComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
];